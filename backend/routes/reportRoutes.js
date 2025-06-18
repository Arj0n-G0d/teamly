import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { exportTaskReport, exportUserReport } from "../controllers/reportController.js";


const reportRouter = express.Router();

reportRouter.get("/export/tasks", protect, adminOnly, exportTaskReport);
reportRouter.get("/export/users", protect, adminOnly, exportUserReport);

export default reportRouter;