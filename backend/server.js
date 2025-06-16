import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";

const app = express();

// Middleware to handle CORS
app.use(cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
));

// Middleware to parse JSON
app.use(express.json());

// Connect DB
await connectDB();

//  Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
// app.use("/api/reports", reportRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Started listening on ${PORT}`);
});

