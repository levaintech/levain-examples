import express from 'express';
import { Wallet } from 'ethers';
import { encrypt } from '@soufflejs/crypto';
import dotenv from 'dotenv';
import { getNetworkAssets } from '../utils/mutations';

dotenv.config();

const router = express.Router();

// Endpoint to create wallets programatically
router.get('/network-assets', async (req, res) => {
  try {
    // Get network assets
    const networkAssets = await getNetworkAssets(process.env.LEVAIN_ORG_ID as string);

    for (const item of networkAssets) {
      const network = item.node.network;
      console.log(`### ${network.protocolName} ${network.networkName}`);
      console.log();
      console.log(`| Symbol | Asset Name | Identifier | Decimals |`);
      console.log(`| ------ | ---------- | ---------- | -------- |`);
      if (network.assets.edges.length > 0) {
        for (const asset of network.assets.edges) {
          // @ts-ignore
          console.log(
            `| ${asset.node.symbol} | ${asset.node.name} | \`${asset.node.identifier}\` | ${asset.node.decimals} |`,
          );
        }
      }
      console.log();
    }

    // HTTP response
    res.status(200).json(networkAssets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
