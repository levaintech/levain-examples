import express from 'express';
import walletRoute from './api/001-create-wallet';
import apiCosigningRoute from './api/002-api-cosigning';
import txWith0xRoute from './api/003-api-cosigning-custom-tx';
import depositAddressRoute from './api/004-generate-deposit-addresses';

import { config } from 'dotenv';

config();
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    res.status(200).json({
      message: 'Demo service running OK.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.use(apiCosigningRoute);
app.use(walletRoute);
app.use(depositAddressRoute);
app.use(txWith0xRoute);

app.listen(port, () => {
  console.log(`Demo service using Levain GraphQL APIs is running at http://localhost:${port}`);
});
