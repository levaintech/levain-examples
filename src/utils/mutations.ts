import { gql } from "@apollo/client/core";

import { client } from "./graphql";

export interface CreateTransactionRequestInput {
  orgId: string;
  walletId: string;
  networkAssetId?: string | null;
  transactionData: NewTransactionRequestData;
}

export interface NewTransactionRequestData {
  simpleMultiSig: NewSimpleMultiSigTransactionRequestData;
}

export interface NewSimpleMultiSigTransactionRequestData {
  destination: string;
  value: string;
  data: string;
  gasLimit: string;
}

// Create a transaction request
export async function createTransactionRequest(
  input: CreateTransactionRequestInput,
) {
  const CREATE_TRANSACTION_REQUEST = gql`
    mutation CreateTransactionRequest($input: CreateTransactionRequestInput!) {
      createTransactionRequest(input: $input) {
        requestId
        walletId
        networkAssetId
        createdAt
        updatedAt
        summaryEvm {
          data
          value
        }
        asset {
          identifier
          name
          decimals
          isNative
        }
        initiator {
          userId
          user {
            email
          }
        }
        status
      }
    }
  `;

  const response = await client.mutate({
    mutation: CREATE_TRANSACTION_REQUEST,
    variables: { input },
  });

  return response.data.createTransactionRequest;
}

// Create a transaction request after passing further approval checks
export async function approveTransactionRequest(input: any) {
  const APPROVE_TRANSACTION_REQUEST = gql`
    mutation ApproveTransactionRequest(
      $input: ApproveTransactionRequestInput!
    ) {
      approveTransactionRequest(input: $input) {
        walletTransactionRequestId
        approverId
        actionType
        createdAt
        updatedAt
        actor {
          orgId
          memberId
          userId
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: APPROVE_TRANSACTION_REQUEST,
    variables: { input },
  });

  return response.data.approveTransactionRequest;
}

// Create transaction digests
export async function createTransactionDigests(input: any) {
  const CREATE_TRANSACTION_DIGESTS = gql`
    mutation CreateTransactionDigests($input: CreateTransactionDigestsInput!) {
      createTransactionDigests(input: $input) {
        requestId
        walletId
        networkAssetId
        createdAt
        updatedAt
        summaryEvm {
          data
          value
        }
        asset {
          identifier
          name
          decimals
          isNative
        }
        digests {
          digest
          kvsDigest {
            signature
            state
            createdAt
            updatedAt
          }
          kvsDigestId
        }
        initiator {
          userId
          user {
            email
          }
        }
        status
      }
    }
  `;

  const response = await client.mutate({
    mutation: CREATE_TRANSACTION_DIGESTS,
    variables: { input },
  });

  return response.data.createTransactionDigests;
}

// Sign the transaction request
export async function signTransactionRequest(input: any) {
  const SIGN_TRANSACTION_REQUEST = gql`
    mutation SignTransactionRequest($input: SignTransactionRequestInput!) {
      signTransactionRequest(input: $input) {
        requestId
        walletId
        networkAssetId
        createdAt
        updatedAt
        summaryEvm {
          data
          value
        }
        asset {
          identifier
          name
          decimals
          isNative
        }
        digests {
          digest
          kvsDigest {
            signature
            state
            createdAt
            updatedAt
          }
          kvsDigestId
        }
        initiator {
          userId
          user {
            email
          }
        }
        transactionSignature
        transactionSigned
        status
      }
    }
  `;

  const response = await client.mutate({
    mutation: SIGN_TRANSACTION_REQUEST,
    variables: { input },
  });

  return response.data.signTransactionRequest;
}

// Create keys on Levain
export async function createKey(input: any) {
  const CREATE_KEY = gql`
    mutation CreateKey($input: CreateKeyInput!) {
      createKey(input: $input) {
        keyId
        name
        publicKey
      }
    }
  `;

  const response = await client.mutate({
    mutation: CREATE_KEY,
    variables: { input },
  });

  return response.data.createKey;
}

// Create a wallet on Levain
export async function createWallet(input: any) {
  const CREATE_WALLET = gql`
    mutation CreateWallet($input: CreateWalletInput!) {
      createWallet(input: $input) {
        walletId
        organizationNetworkId
        organizationNetwork {
          network {
            protocolName
            networkName
          }
        }
        name
        status
        mainAddress
      }
    }
  `;

  const response = await client.mutate({
    mutation: CREATE_WALLET,
    variables: { input },
  });

  return response.data.createWallet;
}

// Query for organization network IDs
export async function organizationNetworks(input: any) {
  const ORG_NETWORKS = gql`
    query OrganizationNetworks($orgId: ID!) {
      organization(orgId: $orgId) {
        networks {
          edges {
            node {
              organizationNetworkId
              network {
                networkId
                identifier
                protocolName
                networkName
              }
            }
          }
        }
      }
    }
  `;

  const response = await client.query({
    query: ORG_NETWORKS,
    variables: { input },
  });

  return response.data.organization;
}

// Create deposit addresses
export async function createWalletDepositAddress(input: any) {
  const CREATE_WALLET_DEPOSIT_ADDRESS = gql`
    mutation CreateWalletDepositAddress(
      $input: CreateWalletDepositAddressInput!
    ) {
      createWalletDepositAddress(input: $input) {
        label
        address
        walletDepositAddressId
      }
    }
  `;

  const response = await client.mutate({
    mutation: CREATE_WALLET_DEPOSIT_ADDRESS,
    variables: { input },
  });

  return response.data.createWalletDepositAddress;
}
