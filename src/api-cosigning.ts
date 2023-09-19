import express from "express";
import fs from "fs";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { decrypt, prefixHex, stripHexPrefix } from "./utils/crypto";
import { approveTransactionRequest, createTransactionDigests, createTransactionRequest, signTransactionRequest } from "./utils/mutations";

dotenv.config();

const app = express();
const port = 3000;

// Endpoint to process withdrawal
app.get("/process-withdrawal", async (req, res) => {
  try {
    /*
     * The following checks are not implemented in this sample code, but should be implemented in production:
     * 1. Request security checks, making sure it's sent from your own internal systems e.g. HMAC, etc.
     * 2. AML checks on the withdrawal address of the user e.g. Chainalysis, Merkle Science, etc.
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
