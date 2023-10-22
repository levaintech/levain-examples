import express from 'express';
import fs from 'fs';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { decrypt, prefixHex, stripHexPrefix } from '../utils/crypto';
import {
  approveTransactionRequest,
  createTransactionDigests,
  createTransactionRequest,
  executeTransaction,
} from '../utils/mutations';

dotenv.config();

const router = express.Router();

// Endpoint to process withdrawal
router.get('/process-withdrawal', async (req, res) => {
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

    const withdrawalAddress = req.query.address;

    // Create tx request via Levain from Ops Withdrawal Hot Wallet to the user's wallet
    const createTxRequest = await createTransactionRequest({
      orgId: process.env.LEVAIN_ORG_ID as string,
      walletId,
      // networkAssetId: 'abbd6617-1783-444f-84f5-62514c54912c', // Ether on Ethereum Goerli Testnet
      networkAssetId: '4195f3f1-c04a-4fd3-8b86-27061502814d', // Ether on Ethereum Sepolia Testnet
      transactionData: {
        // Wallets created using SimpleMultiSig.sol must use simpleMultiSig -- Safe implementation will be announced soon
        simpleMultiSig: {
          destination: withdrawalAddress as string,
          value: '150000000000000', // Withdrawal amount in wei
          data: '0x',
          gasLimit: '21000',
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
      txExplorerLink: `https://sepolia.etherscan.io/tx/${executedTx.transactionHash}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
