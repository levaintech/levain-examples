import express from 'express';
import { levainGraph } from './client';
import { WalletType } from '@levain/wallet-sdk';
import { config } from './config';

const router = express.Router();

// Endpoint to create wallets programatically
router.get('/create-wallet', async (req, res) => {
  try {
    const { keys, wallet } = await levainGraph.createKeysAndWallet({
      orgId: config.LEVAIN_ORG_ID,
      type: WalletType.EvmContractSimpleMultiSig,
      name: 'Sepolia Test Wallet',
      network: 'caip2:eip155:11155111',
      walletPassword: 'aStrongEnoughPassword@1337!',
    });

    console.log('Created keys:');
    console.log(JSON.stringify(keys, null, 2));

    console.log('Created wallet:');
    console.log(JSON.stringify(wallet, null, 2));

    // HTTP response
    res.status(200).json({
      message:
        'Successfully created a wallet using your keys. Please go to https://app.levain.tech/ to see your wallet.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
