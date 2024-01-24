import { LevainGraphClient } from '@levain/wallet-sdk';

const LEVAIN_GRAPH_ENDPOINT = 'https://api.levain.tech/graphql';
const LEVAIN_ACCESS_TOKEN = process.env.LEVAIN_ACCESS_TOKEN!;

export function createSdkClient(): LevainGraphClient {
  return new LevainGraphClient({
    url: LEVAIN_GRAPH_ENDPOINT,
    accessToken: LEVAIN_ACCESS_TOKEN,
  });
}
