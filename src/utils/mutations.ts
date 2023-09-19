import { gql } from "@apollo/client/core";

import { client } from "./graphql";

export interface CreateTransactionRequestInput {
  orgId: string;
  walletId: string;
  networkAssetId: string | null;
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
export async function createTransactionRequest(input: CreateTransactionRequestInput) {
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
