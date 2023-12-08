import { GraphQLClient } from 'graphql-request';

const LEVAIN_GRAPH_ENDPOINT = 'https://api.levain.tech/graphql';
const LEVAIN_ACCESS_TOKEN = process.env.LEVAIN_ACCESS_TOKEN!;

export function createGraphClient(): GraphQLClient {
  return new GraphQLClient(LEVAIN_GRAPH_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${LEVAIN_ACCESS_TOKEN}`,
    },
  });
}
