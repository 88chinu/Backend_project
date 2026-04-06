import express from "express";
import User from "../models/User.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all users
router.get("/", protect, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Update user
router.patch("/:id", protect, isAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(user);
});

// Delete user
router.delete("/:id", protect, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

export default router;