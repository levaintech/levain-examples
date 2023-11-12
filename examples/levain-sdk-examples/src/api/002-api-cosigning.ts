import express from 'express';
import { levainGraph } from './client';
import { config } from './config';

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

    const withdrawalAddress = req.query.address;

    const walletId = config.LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID;
    const walletPassword = config.LEVAIN_USER_SIGNING_KEY_PASSWORD;

    // Create Transaction
    const txRequest = await levainGraph.sendAsset({
      asset: 'caip19:eip155:11155111/slip44:60', // Sepolia ETH
      to: withdrawalAddress as string,
      walletId,
      amount: '0.1',
    });

    // Approve Transaction
    await levainGraph.approveTransactionRequest({
      transactionRequestId: txRequest.requestId,
    });

    // Create Transaction Digests for co-signing
    const { digests } = await levainGraph.createTransactionDigests({
      requestId: txRequest.requestId,
    });

    // Execute transaction
    const { transactionHash } = await levainGraph.executeTransaction({
      requestId: txRequest.requestId,
      digests,
      walletId,
      walletPassword,
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
