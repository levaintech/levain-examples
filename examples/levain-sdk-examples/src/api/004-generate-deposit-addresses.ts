import express from 'express';
import { levainGraph } from './client';

const router = express.Router();

// Endpoint to pre-farm deposit addresses
router.get('/deposit-addresses', async (req, res) => {
  try {
    const walletId = req.query.walletId;

    let depositAddresses: any = [];
    // Create 10 deposit addresses
    for (let i = 0; i < 10; i++) {
      const randomUserId = Math.floor(Math.random() * 100000000);
      const depositAddress = await levainGraph.createWalletDepositAddress({
        walletId: walletId as string,
        label: `user-id-${randomUserId}`,
      });
      console.log(depositAddress);

      depositAddresses.push(depositAddress.address);
    }

    // HTTP response
    res.status(200).json({
      message: 'Successfully generated deposit addresses.',
      depositAddresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
