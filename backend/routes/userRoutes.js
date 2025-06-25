import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
    getAllUsers,
    getUserById,
    addMember,
    removeMember
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", protect, adminOnly, getAllUsers);
userRouter.get("/:id", protect, adminOnly, getUserById);
userRouter.post("/", protect, adminOnly, addMember);
userRouter.post("/delete", protect, adminOnly, removeMember);

export default userRouter;