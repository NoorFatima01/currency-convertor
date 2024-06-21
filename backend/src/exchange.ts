import axios from "axios";
import express from "express";
import { Request, Response } from "express";

const EXCHANGE_RATE_API_URL = "http://api.exchangeratesapi.io/v1";

const router = express.Router();

// Endpoint to convert currency
router.get("/convert", async (req: Request, res: Response) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ error: "Missing required query parameters: from, to, amount" });
  }

  try {
    const response = await axios.get(
      `https://api.freecurrencyapi.com/v1/latest`,
      {
        params: {
          apikey: "fca_live_NRYiJ4yYdTIPYGJADAQcWcFx7GkAzoGwUtsdERZ1",
          base_currency: from,
          currencies: to,
        },
      }
    );

    const data = response.data;
    const rate = data.data[to as string];

    if (!rate) {
      return res
        .status(400)
        .json({ error: "Failed to fetch the exchange rate for the given currency pair" });
    }

    const convertedAmount = rate * parseFloat(amount as string);

    res.json({
      success: true,
      from,
      to,
      amount: parseFloat(amount as string),
      convertedAmount,
    });
  } catch (error: any) {
    console.error(
      "Error converting currency:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to convert currency" });
  }
});

router.get("/symbols", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://api.freecurrencyapi.com/v1/currencies",
      {
        params: {
          apikey: "fca_live_NRYiJ4yYdTIPYGJADAQcWcFx7GkAzoGwUtsdERZ1",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    res.status(200).json(data);
  } catch (error: any) {
    console.error(
      "Error fetching symbols:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch symbols" });
  }
});

export default router;
