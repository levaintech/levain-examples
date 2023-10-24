import express from 'express';
import dotenv from 'dotenv';
import apiCosigningRoute from './api/api-cosigning';
import apiCosigningErc20Route from './api/api-cosigning-erc20';
import apiCosigningTrc20Route from './api/api-cosigning-trc20';
import walletRoute from './api/create-wallet';
import depositAddressRoute from './api/generate-deposit-addresses';
import txWith0xRoute from './api/api-cosigning-custom-tx';

dotenv.config();

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
app.use(apiCosigningErc20Route);
app.use(apiCosigningTrc20Route);
app.use(walletRoute);
app.use(depositAddressRoute);
app.use(txWith0xRoute);

app.listen(port, () => {
  console.log(`Demo service using Levain GraphQL APIs is running at http://localhost:${port}`);
});
