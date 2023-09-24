import * as CryptoJS from "crypto-js";
import { sha256 } from "@noble/hashes/sha256";

// To be removed later on when such functions are done by Levain GraphQL API instead
export function prefixHex(str: string): string {
  return str.startsWith("0x") ? str : `0x${str}`;
}

export function stripHexPrefix(str: string): string {
  return str.startsWith("0x") ? str.slice(2) : str;
}

// Read and decrypt the encrypted private key (i.e. the user signing key) hosted locally on this service
const AES_256_CBC = "AES_256_CBC";

/**
 * Key derivation spec we arbitrarily set and considered secured.
 *
 * @WARNING DO NOT change to use AES256 (CryptoJS) default key derivation function which is EvpKDF with hash iteration = 1.
 * @WARNING reducing this configuration directly reduce password brute force difficulty.
 */

const HASHER = "sha256";
const PBKDF2 = "pbkdf2";
const KEY_SIZE = 8; // words = 256 bits
const HASH_ITER = 10_000;

export interface CipherBlob {
  cipher: typeof AES_256_CBC;
  keyDerivation: typeof PBKDF2;
  keyHasher: typeof HASHER;
  iter: typeof HASH_ITER;
  salt: string;
  iv: string;
  cipherText: string;
  hash: string;
}

function dSHA256(data: string): string {
  const buf = Buffer.from(data, "utf-8");
  const dSHA = Buffer.from(sha256(sha256(buf)));
  return dSHA.toString("hex").slice(0, 16);
}

/**
 * Perform AES256 decryption by a key derived using pbkdf2.
 *
 * @param password utf-8 encoded string, input of pbkdf
 * @param cipherBlob
 * @returns {string} utf-8 encoded string, plain text before encryption.
 */
export function decrypt(password: string, cipherBlob: CipherBlob): string {
  const { cipher, keyDerivation, keyHasher, cipherText, iv, salt, hash } =
    cipherBlob;

  if (
    cipher !== AES_256_CBC ||
    keyDerivation !== PBKDF2 ||
    keyHasher !== HASHER
  ) {
    throw new Error("Unexpected cipher specification.");
  }

  const pw = CryptoJS.enc.Utf8.parse(password);
  const s = CryptoJS.enc.Hex.parse(salt);
  const key = CryptoJS.PBKDF2(pw, s, {
    keySize: KEY_SIZE, // word count
    iterations: HASH_ITER,
    hasher: CryptoJS.algo.SHA256,
  });
  const ct = CryptoJS.enc.Base64.parse(cipherText);
  const cp = CryptoJS.lib.CipherParams.create({ ciphertext: ct });
  const plain = CryptoJS.AES.decrypt(cp, key, {
    mode: CryptoJS.mode.CBC,
    iv: CryptoJS.enc.Hex.parse(iv),
  });

  // Password verification by checking plain secret with known hash of true secret
  if (dSHA256(password) !== hash) {
    throw new Error("Invalid password");
  }

  // This will occassionally run into error with Malformed UTF-8 error for invalid password
  return plain.toString(CryptoJS.enc.Utf8);
}
