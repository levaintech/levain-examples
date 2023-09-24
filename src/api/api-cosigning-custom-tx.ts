import express from "express";
import fs from "fs";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { decrypt, prefixHex, stripHexPrefix } from "../utils/crypto";
import {
  approveTransactionRequest,
  createTransactionDigests,
  createTransactionRequest,
  signTransactionRequest,
} from "../utils/mutations";

dotenv.config();

const router = express.Router();

// Endpoint to process withdrawal
router.get("/process-tx", async (req, res) => {
  try {
    // Call external API e.g. 0x to get tx builder
    // @ts-ignore
    const response = await fetch(
      `${process.env.ZERO_EX_API_BASE_URL}/swap/v1/quote?buyToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellToken=ETH&sellAmount=100000&excludedSources=Kyber`,
      {
        method: "GET",
        headers: {
          "0x-api-key": process.env.ZERO_EX_API_KEY as string,
          Accept: "application/json",
        },
      }
    );

    const json = await response.json();
    console.log(json);

    // Create tx request via Levain from Ops Withdrawal Hot Wallet to the user's wallet
    const createTxRequest = await createTransactionRequest({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId: process.env.LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID as string,
      transactionData: {
        // Wallets created using SimpleMultiSig.sol must use simpleMultiSig -- Safe implementation will be announced soon
        simpleMultiSig: {
          destination: json.to,
          data: json.data,
          value: json.value,
          gasLimit: json.gas,
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
    console.log("Digest to be API co-signed", digestToApiCosign);

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
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
