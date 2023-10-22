import express from 'express';
import fs from 'fs';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { decrypt, prefixHex, stripHexPrefix } from '../utils/crypto';
import {
  approveTransactionRequest,
  buildErc20Transaction,
  createTransactionDigests,
  createTransactionRequest,
  executeTransaction,
} from '../utils/mutations';

dotenv.config();

const router = express.Router();

// Endpoint to process withdrawal
router.get('/process-withdrawal-erc20', async (req, res) => {
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

    // This example requires an Ethereum Sepolia Testnet wallet, and its associated private key
    const walletId = process.env.LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID as string;
    const encryptedPrivateKeyFile = 'api-cosigner-private-key-sepolia.json';

    // Levain uses CAIP standards for referencing blockchain networks and tokens
    const blockchain = 'caip19:eip155:11155111'; // See https://developer.levain.tech/products/graph/docs/supported-chains
    const tokenContractAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'; // UNI on Ethereum Sepolia Testnet
    const tokenContractCaip19 = `${blockchain}/erc20:${tokenContractAddress}`; // Formatted CAIP19 reference, see https://developer.levain.tech/products/graph/docs/supported-tokens
    console.log(tokenContractCaip19);
    const withdrawalAddress = req.query.address;

    // Build ERC-20 transfer transaction to get the tx data
    const erc20Transaction = await buildErc20Transaction(walletId, {
      to: withdrawalAddress as string,
      asset: tokenContractCaip19,
      amount: 0.00001, // Decimals are taken care of by Levain, only input the formatted amount e.g. 10.5 UNI, 20 USDT etc.
      feeLevel: 'low',
    });

    // Create tx request via Levain from Ops Withdrawal Hot Wallet to the user's wallet
    const createTxRequest = await createTransactionRequest({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId,
      transactionData: {
        simpleMultiSig: erc20Transaction.simpleMultiSig,
      },
    });

    // Approve tx request using the requestId
    const approveTxRequest = await approveTransactionRequest({
      transactionRequestId: createTxRequest.requestId,
    });

    // Handle for errors during approvals
    if (approveTxRequest.actionType !== 'APPROVE') {
      throw new Error('Transaction request not approved');
    }

    // Create transaction digests using the requestId
    const createTxDigests = await createTransactionDigests({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId,
      requestId: createTxRequest.requestId,
    });

    const digestToApiCosign = createTxDigests.digests[0].digest;
    console.log('Digest to be API co-signed', digestToApiCosign);

    // This contains sensitive information: the encrypted private key. You will sign transactions using this key
    const apiCoSignerPrivateKey = JSON.parse(fs.readFileSync(encryptedPrivateKeyFile, 'utf-8'));

    const privateKey = decrypt(
      process.env.LEVAIN_USER_SIGNING_KEY_PASSWORD as string,
      apiCoSignerPrivateKey.encryptedPrivateKey,
    );

    const signer = new ethers.SigningKey(privateKey);

    const signature = await signer.sign(prefixHex(digestToApiCosign));
    const signatureWithoutV = stripHexPrefix(signature.r) + stripHexPrefix(signature.s);

    console.log('signatureWithoutV', signatureWithoutV);

    // Submit the signed transaction to Levain to co-sign and execute for us, gas estimation is handled by Levain and funds are drawn from the gas tank
    const executedTx = await executeTransaction({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId,
      requestId: createTxRequest.requestId,
      signature: signatureWithoutV,
    });

    // HTTP response
    res.status(200).json({
      message: 'Successfully co-signed transaction using Levain GraphQL APIs',
      tx: executedTx.transactionHash,
      txExplorerLink: `https://sepolia.etherscan.io/tx/${executedTx.transactionHash}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
