import express from "express";
import { Wallet } from "ethers";
import { encrypt } from "@soufflejs/crypto";
import dotenv from "dotenv";
import { createKey, createWallet, organizationNetworks } from "../utils/mutations";

dotenv.config();

const router = express.Router();

// Endpoint to create wallets programatically
router.get("/create-wallet", async (req, res) => {
  try {
    // Create and encrypt `Main` key, though we recommend you to already have your offline generation of keys elsewhere
    const password = "CakeCEC@1234";
    const mainKeyPair = Wallet.createRandom();
    const mainPrivateKeyEncrypted = await encrypt(
      password,
      mainKeyPair.privateKey
    );

    // Create `Backup` key, but we don't need the private key, so please keep it safely offline
    const backupKeyPair = Wallet.createRandom();

    // This is what's being sent to Levain in encrypted form
    console.log(mainPrivateKeyEncrypted);

    // These are what you should keep safely offline
    console.log(mainKeyPair.publicKey, mainKeyPair.privateKey);
    console.log(backupKeyPair.publicKey, backupKeyPair.privateKey);

    // Submit both public keys to Levain
    const key1 = await createKey({
      orgId: process.env.LEVAIN_ORG_ID as string,
      name: "Key 1 created via API",
      type: "SCALAR_NEUTERED",
      publicKey: mainKeyPair.publicKey,
      retrieveIfExists: false,
    });
    const key2 = await createKey({
      orgId: process.env.LEVAIN_ORG_ID as string,
      name: "Key 2 created via API",
      type: "SCALAR_NEUTERED",
      publicKey: backupKeyPair.publicKey,
      retrieveIfExists: false,
    });

    const keyForWalletPassword = await createKey({
      orgId: process.env.LEVAIN_ORG_ID as string,
      name: "API-created RSA keypair for wallet password",
      type: "RSA",
      retrieveIfExists: false,
    });

    // Create wallet
    const wallet = await createWallet({
      orgId: process.env.LEVAIN_ORG_ID as string,
      organizationNetworkId: "b60e5c14-59ce-4cea-ad34-309de16c12c6",
      description: "API-created Levain Wallet powered by SimpleMultiSig",
      type: "EvmContractSimpleMultiSig", // Alternatively, EvmContractSafe
      name: "API-created Levain Wallet 1",
      mainKey: {
        keyId: key1.keyId,
        passwordRecoveryKeyId: keyForWalletPassword.keyId,
        encryptedPrivateKey: mainPrivateKeyEncrypted, // This is the encrypted private key
      },
      backupKey: {
        keyId: key2.keyId,
      },
    });

    console.log(wallet);

    // HTTP response
    res.status(200).json({
      message: "Successfully created a wallet using your keys. Please go to https://app.levain.tech/ to see your wallet.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
