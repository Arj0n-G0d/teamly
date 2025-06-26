import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { verifyTransporter } from "./config/mailer.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import path from "node:path";
import { fileURLToPath } from 'node:url';

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

// Verify Mail server
await verifyTransporter();

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const buildPath = path.join(_dirname, "../Teamly/dist");

// Serve the uploads folder
app.use('/uploads', express.static(path.join(_dirname, 'uploads')));

// Serve the build folder
app.use(express.static(buildPath));

//  Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/reports", reportRouter);

app.get("/teamly/*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Started listening on ${PORT}`);
});

