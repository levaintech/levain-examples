import express from "express";
import dotenv from "dotenv";
import { createWalletDepositAddress } from "./utils/mutations";

dotenv.config();

const app = express();
const port = 3000;

// Endpoint to pre-farm deposit addresses
app.get("/deposit-addresses", async (req, res) => {
  try {
    const walletId = req.query.walletId;

    let depositAddresses: any = [];
    // Create 10 deposit addresses
    for (let i = 0; i < 10; i++) {
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
