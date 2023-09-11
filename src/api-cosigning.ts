import express from "express";
import fs from "fs";
import * as CryptoJS from "crypto-js";
import { ethers } from "ethers";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client/core";
import { sha256 } from "@noble/hashes/sha256";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.LEVAIN_API_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = process.env.LEVAIN_API_ACCESS_TOKEN;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Read and decrypt the encrypted private key (i.e. the user signing key) hosted locally on this service
const AES_256_CBC = "AES_256_CBC";

/**
 * Key derivation spec we arbitrarily set and considered secured.
 *
 * @WARNING DO NOT change to use AES256 (CryptoJS) default key derivation function which is EvpKDF with hash iteration = 1.
 * @WARNING reducing this configuration directly reduce password brute force difficulty.
 */

const HASHER = "sha256";
const PBKDF2 = "pbkdf2";
const KEY_SIZE = 8; // words = 256 bits
const HASH_ITER = 10_000;

export interface CipherBlob {
  cipher: typeof AES_256_CBC;
  keyDerivation: typeof PBKDF2;
  keyHasher: typeof HASHER;
  iter: typeof HASH_ITER;
  salt: string;
  iv: string;
  cipherText: string;
  hash: string;
}

function dSHA256(data: string): string {
  const buf = Buffer.from(data, "utf-8");
  const dSHA = Buffer.from(sha256(sha256(buf)));
  return dSHA.toString("hex").slice(0, 16);
}

/**
 * Perform AES256 decryption by a key derived using pbkdf2.
 *
 * @param password utf-8 encoded string, input of pbkdf
 * @param cipherBlob
 * @returns {string} utf-8 encoded string, plain text before encryption.
 */
export function decrypt(password: string, cipherBlob: CipherBlob): string {
  const { cipher, keyDerivation, keyHasher, cipherText, iv, salt, hash } =
    cipherBlob;

  if (
    cipher !== AES_256_CBC ||
    keyDerivation !== PBKDF2 ||
    keyHasher !== HASHER
  ) {
    throw new Error("Unexpected cipher specification.");
  }

  const pw = CryptoJS.enc.Utf8.parse(password);
  const s = CryptoJS.enc.Hex.parse(salt);
  const key = CryptoJS.PBKDF2(pw, s, {
    keySize: KEY_SIZE, // word count
    iterations: HASH_ITER,
    hasher: CryptoJS.algo.SHA256,
  });
  const ct = CryptoJS.enc.Base64.parse(cipherText);
  const cp = CryptoJS.lib.CipherParams.create({ ciphertext: ct });
  const plain = CryptoJS.AES.decrypt(cp, key, {
    mode: CryptoJS.mode.CBC,
    iv: CryptoJS.enc.Hex.parse(iv),
  });

  // Password verification by checking plain secret with known hash of true secret
  if (dSHA256(password) !== hash) {
    throw new Error("Invalid password");
  }

  // This will occassionally run into error with Malformed UTF-8 error for invalid password
  return plain.toString(CryptoJS.enc.Utf8);
}

export interface CreateTransactionRequestInput {
  orgId: string;
  walletId: string;
  networkAssetId: string | null;
  transactionData: NewTransactionRequestData;
}

export interface NewTransactionRequestData {
  simpleMultiSig: NewSimpleMultiSigTransactionRequestData;
}

export interface NewSimpleMultiSigTransactionRequestData {
  destination: string;
  value: string;
  data: string;
  gasLimit: string;
}

// Create a transaction request
async function createTransactionRequest(input: CreateTransactionRequestInput) {
  const CREATE_TRANSACTION_REQUEST = gql`
    mutation CreateTransactionRequest($input: CreateTransactionRequestInput!) {
      createTransactionRequest(input: $input) {
        requestId
        walletId
        networkAssetId
        createdAt
        updatedAt
        summaryEvm {
          data
          value
        }
        asset {
          identifier
          name
          decimals
          isNative
        }
        initiator {
          userId
          user {
            email
          }
        }
        status
      }
    }
  `;

  const response = await client.mutate({
    mutation: CREATE_TRANSACTION_REQUEST,
    variables: { input },
  });

  return response.data.createTransactionRequest;
}

// Create a transaction request after passing further approval checks
async function approveTransactionRequest(input: any) {
  const APPROVE_TRANSACTION_REQUEST = gql`
    mutation ApproveTransactionRequest(
      $input: ApproveTransactionRequestInput!
    ) {
      approveTransactionRequest(input: $input) {
        walletTransactionRequestId
        approverId
        actionType
        createdAt
        updatedAt
        actor {
          orgId
          memberId
          userId
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: APPROVE_TRANSACTION_REQUEST,
    variables: { input },
  });

  return response.data.approveTransactionRequest;
}

// Create transaction digests
async function createTransactionDigests(input: any) {
  const CREATE_TRANSACTION_DIGESTS = gql`
    mutation CreateTransactionDigests($input: CreateTransactionDigestsInput!) {
      createTransactionDigests(input: $input) {
        requestId
        walletId
        networkAssetId
        createdAt
        updatedAt
        summaryEvm {
          data
          value
        }
        asset {
          identifier
          name
          decimals
          isNative
        }
        digests {
          digest
          kvsDigest {
            signature
            state
            createdAt
            updatedAt
          }
          kvsDigestId
        }
        initiator {
          userId
          user {
            email
          }
        }
        status
      }
    }
  `;

  const response = await client.mutate({
    mutation: CREATE_TRANSACTION_DIGESTS,
    variables: { input },
  });

  return response.data.createTransactionDigests;
}

// Sign the transaction request
async function signTransactionRequest(input: any) {
  const SIGN_TRANSACTION_REQUEST = gql`
    mutation SignTransactionRequest($input: SignTransactionRequestInput!) {
      signTransactionRequest(input: $input) {
        requestId
        walletId
        networkAssetId
        createdAt
        updatedAt
        summaryEvm {
          data
          value
        }
        asset {
          identifier
          name
          decimals
          isNative
        }
        digests {
          digest
          kvsDigest {
            signature
            state
            createdAt
            updatedAt
          }
          kvsDigestId
        }
        initiator {
          userId
          user {
            email
          }
        }
        transactionSignature
        transactionSigned
        status
      }
    }
  `;

  const response = await client.mutate({
    mutation: SIGN_TRANSACTION_REQUEST,
    variables: { input },
  });

  return response.data.signTransactionRequest;
}

export function prefixHex(str: string): string {
  return str.startsWith("0x") ? str : `0x${str}`;
}

export function stripHexPrefix(str: string): string {
  return str.startsWith("0x") ? str.slice(2) : str;
}

// Endpoint to process withdrawal
app.get("/process-withdrawal", async (req, res) => {
  try {
    /*
     * The following checks are not implemented in this sample code, but should be implemented in production:
     * 1. Request security checks, making sure it's sent from your own internal systems e.g. HMAC, etc.
     * 2. AML checks on the withdrawal address of the user e.g. Chainalysis, etc.
     * 3. Travel rule checks, e.g. integration with Notabene, etc.
     * 4. Internal business requirements e.g. KYC status, deduction of fees, etc.
     * 5. Whitelist the address on the Ops Withdrawal Hot Wallet on Levain
     *
     * Once all checks have passed, create a transaction request via Levain
     */

    const withdrawalAddress = req.query.address;

    // Create tx request via Levain from Ops Withdrawal Hot Wallet to the user's wallet
    const createTxRequest = await createTransactionRequest({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId: process.env.LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID as string,
      networkAssetId: "cdfef64e-d040-4f1b-bc71-5955d0442305", // Goerli Ether on Ethereum Goerli Testnet
      transactionData: {
        // Wallets created using SimpleMultiSig.sol must use simpleMultiSig -- Safe implementation will be announced soon
        simpleMultiSig: {
          destination: withdrawalAddress as string,
          value: "150000000000000", // Withdrawal amount in wei
          data: "0x",
          gasLimit: "21000",
        },
      },
    });

    // Approve tx request using the requestId
    const approveTxRequest = await approveTransactionRequest({
      transactionRequestId: createTxRequest.requestId,
    });

    // Handle for errors during approvals
    if (approveTxRequest.actionType !== "APPROVE") {
      throw new Error("Transaction request not approved");
    }

    // Create transaction digests using the requestId
    const createTxDigests = await createTransactionDigests({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId: process.env.LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID as string,
      requestId: createTxRequest.requestId,
    });

    const digestToApiCosign = createTxDigests.digests[0].digest;
    console.log("Digest", digestToApiCosign);

    // This contains sensitive information: the encrypted private key. You will sign transactions using this key
    const apiCoSignerPrivateKey = JSON.parse(
      fs.readFileSync("api-cosigner-private-key.json", "utf-8")
    );
    const privateKey = decrypt(
      process.env.LEVAIN_USER_SIGNING_KEY_PASSWORD as string,
      apiCoSignerPrivateKey.encryptedPrivateKey
    );

    const signer = new ethers.SigningKey(privateKey);

    const signature = await signer.sign(prefixHex(digestToApiCosign));
    const signatureWithoutV =
      stripHexPrefix(signature.r) + stripHexPrefix(signature.s);

    console.log("signatureWithoutV", signatureWithoutV);

    // Submit the signed transaction to Levain to co-sign to get the other signature
    const signTxRequest = await signTransactionRequest({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId: process.env.LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID as string,
      requestId: createTxRequest.requestId,
      signature: signatureWithoutV,
    });

    // The actual signed transaction that can be broadcasted on-chain, signed by gas tank
    const signedTx = signTxRequest.transactionSigned;
    const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_BASE_URL);
    const tx = await provider.send("eth_sendRawTransaction", [signedTx]);
    console.log(`https://goerli.etherscan.io/tx/${tx}`);

    // HTTP response
    res.status(200).json({
      message: "Successfully co-signed transaction using Levain GraphQL APIs",
      tx: tx,
      etherscanTx: `https://goerli.etherscan.io/tx/${tx}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
  console.log(
    `Demo service using Levain GraphQL APIs is running at http://localhost:${port}`
  );
});
