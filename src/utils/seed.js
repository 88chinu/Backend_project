import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Record from "../models/Record.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  await User.deleteMany();
  await Record.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  await User.create([
    { name: "Admin", email: "admin@finance.com", password, role: "admin" },
    { name: "Analyst", email: "analyst@finance.com", password, role: "analyst" },
    { name: "Viewer", email: "viewer@finance.com", password, role: "viewer" },
  ]);

  await Record.create([
    { amount: 50000, type: "income", category: "salary", date: new Date() },
    { amount: 2000, type: "expense", category: "food", date: new Date() },
  ]);

  console.log("Data seeded");
  process.exit();
};

seed();