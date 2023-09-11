import express from "express";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client/core";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.LEVAIN_API_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = process.env.LEVAIN_API_ACCESS_TOKEN;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Create deposit addresses
async function createWalletDepositAddress(input: any) {
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

// Endpoint to pre-farm deposit addresses
app.get("/deposit-addresses", async (req, res) => {
  try {
    const walletId = req.query.walletId;

    let depositAddresses = [];
    // Create 10 deposit addresses
    for (let i = 0; i < 100; i++) {
      const randomUserId = Math.floor(Math.random() * 100000000);
      const depositAddress = await createWalletDepositAddress({
        orgId: process.env.LEVAIN_ORG_ID as string,
        walletId: walletId as string,
        label: `user-id-${randomUserId}`,
        caip2Uri: "",
      });
      console.log(depositAddress);

      depositAddresses.push(depositAddress.address);
    }

    // HTTP response
    res.status(200).json({
      message: "Successfully generated deposit addresses.",
      depositAddresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
  console.log(
    `Demo service using Levain GraphQL APIs is running at http://localhost:${port}`
  );
});
