import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import recordRoutes from "./routes/records.js";
import dashboardRoutes from "./routes/dashboard.js";

import errorHandler from "./middleware/error.js";

dotenv.config();
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000
app.use(express.json());

app.get("/", (req, res) => {
    res.send("HomePage Of The App");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes)

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at the port http://localhost:${PORT}`);
});