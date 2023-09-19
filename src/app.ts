import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Endpoint to process withdrawal
app.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "Demo server running OK",
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
