import { GraphQLClient, ResponseMiddleware } from 'graphql-request';
import { notFound, redirect } from 'next/navigation';

const LEVAIN_GRAPH_ENDPOINT = 'https://api.levain.tech/graphql';
const LEVAIN_ACCESS_TOKEN = process.env.LEVAIN_ACCESS_TOKEN!;

export function createGraphClient(): GraphQLClient {
  return new GraphQLClient(LEVAIN_GRAPH_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${LEVAIN_ACCESS_TOKEN}`,
    },
    responseMiddleware: createErrorRoutingMiddleware(),
  });
}

function createErrorRoutingMiddleware(): ResponseMiddleware {
  return (response) => {
    if (!(response instanceof Error)) {
      return;
    }
    const err = response as any;
    // User has provided invalid credentials - jwt cannot be validated
    if (err?.response?.errors?.[0]?.code === 'UNAUTHORIZED') {
      return notFound();
    }
    // User has valid credentials but is not allowed to perform the action
    if (err?.response?.errors?.[0]?.code === 'FORBIDDEN') {
      return notFound();
    }
    // User is trying to perform an invalid action
    if (err?.response?.errors?.[0]?.code === 'INVALID_ACTION') {
      return notFound();
    }
    // User has provided invalid input to a specific parameter as part of the request
    if (err?.response?.errors?.[0]?.code === 'INPUT_VALIDATION_ERROR') {
      return notFound();
    }

    if (err?.response?.message === 'Forbidden' && err?.response?.status === 403) {
      return redirect('/setup');
    }
  };
}
