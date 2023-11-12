import express from 'express';
import { levainGraph } from './client';
import { requireValue } from './utils';
import { config } from './config';

const router = express.Router();

// Endpoint to process withdrawal
router.get('/process-tx', async (req, res) => {
  try {
    // Call external API e.g. 0x to get tx builder
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

    const walletId = config.LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID;
    const walletPassword = config.LEVAIN_USER_SIGNING_KEY_PASSWORD;

    // Create tx request via Levain from Ops Withdrawal Hot Wallet to the user's wallet
    const createTxRequest = await levainGraph.createTransactionRequest({
      walletId,
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
    await levainGraph.approveTransactionRequest({
      transactionRequestId: createTxRequest.requestId,
    });

    // Create transaction digests using the requestId
    const { digests } = await levainGraph.createTransactionDigests({
      requestId: createTxRequest.requestId,
    });

    const digestToApiCosign = digests[0].digest;
    console.log('Digest to be API co-signed', digestToApiCosign);

    // Submit the signed transaction to Levain to co-sign to get the other signature
    const { transactionHash } = await levainGraph.executeTransaction({
      requestId: createTxRequest.requestId,
      walletId,
      walletPassword,
      digests,
    });

    const scanLink = `https://goerli.etherscan.io/tx/${transactionHash}`;
    console.log(scanLink);

    // HTTP response
    res.status(200).json({
      message: 'Successfully co-signed transaction using Levain GraphQL + SDK',
      etherscanTx: scanLink,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
