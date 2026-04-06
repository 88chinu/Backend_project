import express from "express";
import Record from "../models/Record.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all records
router.get("/", protect, async (req, res) => {
  const records = await Record.find();
  res.json(records);
});

// Create record (Admin)
router.post("/", protect, isAdmin, async (req, res) => {
  const record = await Record.create(req.body);
  res.json(record);
});

// Update record
router.patch("/:id", protect, isAdmin, async (req, res) => {
  const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(record);
});

// Delete (soft delete)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  const record = await Record.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
  });
  res.json({ message: "Deleted" });
});

export default router;