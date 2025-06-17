import express from "express";
import { protect, adminOnly} from "../middlewares/authMiddleware.js";
import {
    getDashboardData,
    getUserDashboardData,
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/dashboard-data", protect, adminOnly, getDashboardData);
taskRouter.get("/user-dashboard-data", protect, getUserDashboardData);

taskRouter.post("/", protect, createTask);

taskRouter.get("/", protect, getAllTasks); // Admin: All, Member: Assigned
taskRouter.get("/:id", protect, getTaskById);
taskRouter.put("/:id", protect, updateTask);
taskRouter.delete("/:id", protect, adminOnly, deleteTask);
taskRouter.put("/:id/status", protect, updateTaskStatus);
taskRouter.put("/:id/todo", protect, updateTaskChecklist);

export default taskRouter;