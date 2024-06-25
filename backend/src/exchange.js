"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const firebaseAdmin_1 = require("./firebaseAdmin");
const router = express_1.default.Router();
// Endpoint to convert currency
router.get("/convert", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, amount, userId } = req.query;
    if (!from || !to || !amount) {
        return res
            .status(400)
            .json({ error: "Missing required query parameters: from, to, amount" });
    }
    try {
        const response = yield axios_1.default.get(`https://api.freecurrencyapi.com/v1/latest`, {
            params: {
                apikey: process.env.FREE_CURRENCY_API_KEY,
                base_currency: from,
                currencies: to,
            },
        });
        const data = response.data;
        const rate = data.data[to];
        if (!rate) {
            return res.status(400).json({
                error: "Failed to fetch the exchange rate for the given currency pair",
            });
        }
        const convertedAmount = rate * parseFloat(amount);
        // Save conversion history to Firestore
        const conversionData = {
            userId: userId,
            from: from,
            to: to,
            amount: parseFloat(amount),
            rate,
            convertedAmount,
            date: new Date(),
        };
        yield firebaseAdmin_1.db.collection("history").add(conversionData);
        res.json({
            success: true,
            from,
            to,
            amount: parseFloat(amount),
            convertedAmount,
        });
    }
    catch (error) {
        console.error("Error converting currency:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to convert currency" });
    }
}));
router.get("/symbols", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get("https://api.freecurrencyapi.com/v1/currencies", {
            params: {
                apikey: process.env.FREE_CURRENCY_API_KEY,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = response.data;
        res.status(200).json(data);
    }
    catch (error) {
        console.error("Error fetching symbols:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch symbols" });
    }
}));
router.get("/history/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 5;
    if (!userId) {
        return res.status(400).json({ error: "Missing required parameter: userId" });
    }
    try {
        const historyCollection = firebaseAdmin_1.db.collection("history");
        const userHistory = yield historyCollection.where("userId", "==", userId)
            .offset(page * pageSize)
            .limit(pageSize)
            .get();
        const history = userHistory.docs.map(doc => doc.data());
        const totalDocs = (yield historyCollection.where("userId", "==", userId).get()).size;
        res.json({ success: true, history, totalDocs });
    }
    catch (error) {
        console.error("Error fetching history:", error.message);
        res.status(500).json({ error: "Failed to fetch history" });
    }
}));
exports.default = router;
