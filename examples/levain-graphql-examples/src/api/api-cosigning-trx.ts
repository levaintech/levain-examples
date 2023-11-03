import express from 'express';
import fs from 'fs';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { decrypt, prefixHex, stripHexPrefix } from '../utils/crypto';
import {
  approveTransactionRequest,
  buildTransaction,
  createTransactionDigests,
  createTransactionRequest,
  executeTransaction,
} from '../utils/mutations';

dotenv.config();

const router = express.Router();

// Endpoint to process withdrawal
router.get('/process-withdrawal-trx', async (req, res) => {
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

    // This example requires a Tron Shasta (testnet) wallet, and its associated private key
    const walletId = process.env.LEVAIN_OPS_WITHDRAWAL_TRON_HOT_WALLET_ID as string;
    const encryptedPrivateKeyFile = 'api-cosigner-private-key-tron.json';

    const withdrawalAddress = req.query.address;

    if (withdrawalAddress === undefined) {
      throw new Error('You must specify an address to send to');
    }

    const blockchain = 'caip19:tip474:2494104990'; // See https://developer.levain.tech/products/graph/docs/supported-chains
    const trxSlip44 = 'slip44:195'; // TRX on Tron Shasta Testnet
    const trxCaip19 = `${blockchain}/${trxSlip44}`; // Formatted CAIP19 reference, see https://developer.levain.tech/products/graph/docs/supported-tokens

    const trxTransaction = await buildTransaction(walletId, {
      to: withdrawalAddress as string,
      asset: trxCaip19,
      amount: 1, // Decimals are taken care of by Levain, only input the formatted amount e.g. 10.5 UNI, 20 USDT etc.
      feeLevel: 'Low',
    });

    // Create tx request via Levain from Ops Withdrawal Hot Wallet to the user's wallet
    const createTxRequest = await createTransactionRequest({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId,
      networkAssetId: 'a0012465-6331-4284-9a65-80dce837e5ba', // TRX on Tron Shasta Testnet
      transactionData: {
        tron: {
          json: trxTransaction.tron.json,
        },
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
      txExplorerLink: `https://shasta.tronscan.org/#/transaction/${executedTx.transactionHash}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
