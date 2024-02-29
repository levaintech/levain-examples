import express from 'express';
import { levainGraph } from './client';
import { KeyType, WalletType } from '@levain/wallet-sdk';
import { generate } from '@levain/levain-client-keygen';
import { config } from './config';
import crypto from 'crypto';

const router = express.Router();

// Endpoint to create wallets programatically
router.get('/create-wallet-multichain-evm', async (req, res) => {
  try {
    const orgId = config.LEVAIN_ORG_ID;

    const networksCaip2Ids = [
      'caip2:eip155:11155111', // Ethereum Sepolia Testnet
      'caip2:eip155:80001', // Polygon Mumbai Testnet
      'caip2:eip155:97', // BNB Chain Testnet
    ];
    const walletPassword = 'aStrongEnoughPassword@1337!'; // Used for encrypting the user signing key for the first wallet approver
    const salt = crypto.randomBytes(32).toString('hex'); // Used for wallet creation for deterministic address across EVM chains; 32 bytes = 64 char

    // Create the user signing key & backup key
      // Generate and submit the public keys to Levain
      const { main, backup, encryption } = await levainGraph.createKeys({
        orgId,
        walletPassword: params.walletPassword,
      });
      
      // IMPORTANT - Save the generated keys in secure storage
      console.log('Please backup the following together with your wallet password');
      console.log('Created user signing key:');
      console.log(signingKeyPair);
      console.log(JSON.stringify(signingKeyPair, null, 2));
      console.log('Created user backup key:');
      console.log(signingKeyPair);
  
      // And the salt value depending on your use case
      console.log(
        'Salt used (please keep this so that you can deploy a multi-sig wallet with the same address across other chains):',
      );
      console.log(`0x${salt}`);

      const wallet = await levainGraph.createWallet({
        orgId,
        name: 'API-created Multi-chain EVM Wallet (with salt)',
        type: WalletType.EvmContractSimpleMultiSig,
        network: networksCaip2Ids[i],
        mainKey: {
          keyId: signingKey.keyId,
          passwordRecoveryKeyId: walletPasswordEncryptionKey.keyId,
          encryptedPrivateKey: signingKeyPair.encryptedPrivateKey,
        },
        backupKey: {
          keyId: backupKey.keyId,
        },
        use1167Proxy: true,
        salt: `0x${salt}`,
      });

      console.log(JSON.stringify(backupKeyPair, null, 2));
      console.log('Created encryption key:');
      console.log(JSON.stringify(walletPasswordEncryptionKey, null, 2));
      console.log(signingKey, backupKey, walletPasswordEncryptionKey);

      console.log('Created wallet:');
      console.log(JSON.stringify(wallet, null, 2));
    }

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
