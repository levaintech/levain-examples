import { LevainGraphClient } from '@levain/wallet-sdk';
import { config } from './config';

export const levainGraph = new LevainGraphClient({
  accessToken: config.LEVAIN_API_ACCESS_TOKEN,
  baseUrl: config.LEVAIN_API_URL,
});
