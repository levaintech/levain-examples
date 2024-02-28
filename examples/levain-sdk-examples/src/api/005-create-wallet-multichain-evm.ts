import express from 'express';
import { levainGraph } from './client';
import { KeyType, WalletType } from '@levain/wallet-sdk';
import { generate } from '@levain/levain-client-keygen';
import { config } from './config';

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

    // Create the user signing key & backup key
    const signingKeyPair = generate(walletPassword);
    const backupKeyPair = generate(walletPassword);

    // Submit the public keys to Levain
    const signingKey = await levainGraph.createKey({
      orgId,
      type: KeyType.ScalarNeutered,
      publicKey: signingKeyPair.publicKey,
      retrieveIfExists: false,
    });
    const backupKey = await levainGraph.createKey({
      orgId,
      type: KeyType.ScalarNeutered,
      publicKey: backupKeyPair.publicKey,
      retrieveIfExists: false,
    });

    const walletPasswordEncryptionKey = await levainGraph.createKey({
      orgId,
      type: KeyType.Rsa,
      retrieveIfExists: false,
    });

    console.log('Created user signing key:');
    console.log(signingKeyPair);
    console.log(JSON.stringify(signingKeyPair, null, 2));
    console.log('Created user backup key:');
    console.log(signingKeyPair);

    console.log(JSON.stringify(backupKeyPair, null, 2));
    console.log('Created encryption key:');
    console.log(JSON.stringify(walletPasswordEncryptionKey, null, 2));
    console.log(signingKey, backupKey, walletPasswordEncryptionKey);

    for (let i = 0; i < networksCaip2Ids.length; i++) {
      const wallet = await levainGraph.createWallet({
        orgId,
        name: 'API-created Multi-chain EVM Wallet',
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
        salt: '0x4578616d706c6553616c74000000000000000000000000000000000000000000', // "ExampleSalt", appended with zeroes, see https://www.devoven.com/encoding/string-to-bytes32
      });
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
