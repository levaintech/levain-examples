import { LevainGraphClient } from '@levain/wallet-sdk';

export const levainGraph = new LevainGraphClient({
  accessToken: process.env.LEVAIN_API_ACCESS_TOKEN,
  baseUrl: process.env.LEVAIN_API_URL,
});
