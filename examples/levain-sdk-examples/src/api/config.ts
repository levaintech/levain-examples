import dotenv from 'dotenv';
import { join } from 'node:path';
import { requireValue } from './utils';

dotenv.config({
  path: join(__dirname, '..', '..', '.env'),
});

export const config = {
  LEVAIN_API_ACCESS_TOKEN: requireValue(process.env.LEVAIN_API_ACCESS_TOKEN, 'LEVAIN_API_ACCESS_TOKEN was not set.'),
  LEVAIN_API_URL: requireValue(process.env.LEVAIN_API_URL, 'LEVAIN_API_URL was not set.'),
  LEVAIN_ORG_ID: requireValue(process.env.LEVAIN_ORG_ID, 'LEVAIN_ORG_ID was not set.'),
  LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID: requireValue(
    process.env.LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID,
    'LEVAIN_OPS_WITHDRAWAL_HOT_WALLET_ID was not set.',
  ),
  LEVAIN_USER_SIGNING_KEY_PASSWORD: requireValue(
    process.env.LEVAIN_USER_SIGNING_KEY_PASSWORD,
    'LEVAIN_USER_SIGNING_KEY_PASSWORD was not set.',
  ),
} as const;
