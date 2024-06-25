import axios from "axios";
import express from "express";
import { Request, Response } from "express";
import { db } from "./firebaseAdmin";
import firebaseAuthMiddleware from "./firebaseAuthMiddleware";

const router = express.Router();

// Endpoint to convert currency
router.get("/convert", async (req: Request, res: Response) => {
  const { from, to, amount, userId } = req.query;

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
          apikey: process.env.FREE_CURRENCY_API_KEY,
          base_currency: from,
          currencies: to,
        },
      }
    );

    const data = response.data;
    const rate = data.data[to as string];

    if (!rate) {
      return res.status(400).json({
        error: "Failed to fetch the exchange rate for the given currency pair",
      });
    }

    const convertedAmount = rate * parseFloat(amount as string);

    // Save conversion history to Firestore
    const conversionData = {
      userId: userId as string,
      from: from as string,
      to: to as string,
      amount: parseFloat(amount as string),
      rate,
      convertedAmount,
      date: new Date(),
    };

    await db.collection("history").add(conversionData);

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
          apikey: process.env.FREE_CURRENCY_API_KEY,
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

router.get("/history/:userId", firebaseAuthMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page as string) || 0;
  const pageSize = parseInt(req.query.pageSize as string) || 5;

  if (!userId) {
    return res.status(400).json({ error: "Missing required parameter: userId" });
  }

  try {
    const historyCollection = db.collection("history");
    const userHistory = await historyCollection.where("userId", "==", userId)
      .offset(page * pageSize)
      .limit(pageSize)
      .get();
    const history = userHistory.docs.map(doc => doc.data());
    const totalDocs = (await historyCollection.where("userId", "==", userId).get()).size;

    res.json({ success: true, history, totalDocs });
  } catch (error: any) {
    console.error("Error fetching history:", error.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});


export default router;
