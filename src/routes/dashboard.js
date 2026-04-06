import express from "express";
import Record from "../models/Record.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Summary
router.get("/summary", protect, async (req, res) => {
  const income = await Record.aggregate([
    { $match: { type: "income" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const expense = await Record.aggregate([
    { $match: { type: "expense" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({
    income: income[0]?.total || 0,
    expense: expense[0]?.total || 0,
  });
});

export default router;