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

We have the following demos on how you can build your own services to interact with Levain for your use cases.

* [Create a Levain Wallet](./src/create-wallet.ts) programmatically, where you can generate your own keys, bring them onto Levain for the wallet creation. This will be entirely self-managed, and **you will be responsible for your own backup procedures**.
* [Generate Deposit Addresses](./src/generate-deposit-addresses.ts) where you can generate deposit addresses on a specific Levain Wallet, to issue them to your own users.
* [Create a Transaction via an API Co-signer](./src/api-cosigning.ts) programmatically, where you can create a transaction to send funds from a Levain Wallet to a destination address through an API co-signer service with an encrypted private key.

### Run examples

```bash
npm run start:wallet
```

```bash
npm run start:deposit
```

```bash
npm run start:withdrawal
```

## License

MIT