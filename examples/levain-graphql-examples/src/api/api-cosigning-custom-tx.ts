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
router.get('/process-tx', async (req, res) => {
  try {
    // This example requires an Ethereum Goerli Testnet wallet, and its associated private key
    const encryptedPrivateKeyFile = 'api-cosigner-private-key-goerli.json';

    // Call external API e.g. 0x to get tx builder, ignoring TS2304 error because of Node 18
    // @ts-ignore
    const response = await fetch(
      `${process.env.ZERO_EX_API_BASE_URL}/swap/v1/quote?buyToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellToken=ETH&sellAmount=100000&excludedSources=Kyber`,
      {
        method: 'GET',
        headers: {
          '0x-api-key': process.env.ZERO_EX_API_KEY as string,
          Accept: 'application/json',
        },
      },
    );

    const json = await response.json();
    console.log(json);

    // Create tx request via Levain from Ops Withdrawal Hot Wallet to the user's wallet
    const createTxRequest = await createTransactionRequest({
      walletId: process.env.LEVAIN_OPS_TRADING_WALLET_ID as string,
      transactionData: {
        // Wallets created using SimpleMultiSig.sol must use simpleMultiSig -- Safe implementation will be announced soon
        simpleMultiSig: {
          // @ts-ignore
          destination: json.to,
          // @ts-ignore
          data: json.data,
          // @ts-ignore
          value: json.value,
          // @ts-ignore
          gasLimit: json.gas,
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

    // Submit the signed transaction to Levain to co-sign to get the other signature
    const executedTx = await executeTransaction({
      requestId: createTxRequest.requestId,
      signature: signatureWithoutV,
    });

    console.log(executedTx);

    // HTTP response
    res.status(200).json({
      message: 'Successfully co-signed transaction using Levain GraphQL APIs',
      tx: executedTx.transactionHash,
      txExplorerLink: `https://goerli.etherscan.io/tx/${executedTx.transactionHash}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
