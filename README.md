# Levain GraphQL Examples

This repository contains examples of how to use the [Levain GraphQL API](https://developer.levain.tech/).

## Setup

### Install dependencies

```bash
npm install
```

### Configure environment variables

You'll need to configure the environment variables used in the examples. To do so, copy the `.env.example` file to `.env` and fill in the values. For API access tokens, you can get them from [Levain](https://app.levain.tech/).

```bash
cp .env.example .env
```

## Examples

We have the following demos on how you can build your own services to interact with Levain. While this demo app is built with Express with TypeScript, you can use any language or framework to interact with the Levain GraphQL API so long as you can make requests with GraphQL.

- [Create a Levain Wallet](./src/api/create-wallet.ts) programmatically, where you can generate your own keys, bring them onto Levain for the wallet creation. This will be entirely self-managed, and **you will be responsible for your own backup procedures**.
- [Generate deposit addresses](./src/api/generate-deposit-addresses.ts) where you can generate deposit addresses on a specific Levain Wallet, to issue them to your own users.
- [Create a transaction via an API co-signer](./src/api/api-cosigning.ts) programmatically, where you can create a transaction to send funds from a Levain Wallet to a destination address through an API co-signer service with an encrypted private key.
- [Create a swap using 0x API and then sign via Levain](./src/api/api-cosigning.ts) programmatically, where you can create a transaction to send funds from a Levain Wallet to a destination address through an API co-signer service with an encrypted private key.

### Run

To run the examples, you can run the following command:

```bash
npm run start
```

To access the examples, you'll have to access the following URLs:

- _Create a Levain Wallet_ at `http://localhost:3000/create-wallet`
- _Generate deposit addresses_ at `http://localhost:3000/generate-deposit-addresses`
- _Create a transaction via an API co-signer_ at `http://localhost:3000/process-withdrawal?address=0xWhitelistedAddress`
- _Create a swap using 0x API and then sign via Levain_ at `http://localhost:3000/process-tx`

## License

MIT
