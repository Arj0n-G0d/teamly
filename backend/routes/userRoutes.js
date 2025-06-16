import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
    getAllUsers,
    getUserById
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", protect, adminOnly, getAllUsers);
userRouter.get("/:id", protect, adminOnly, getUserById);

export default userRouter;