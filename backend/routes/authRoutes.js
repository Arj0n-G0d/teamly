import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
    getUserProfile,
    loginUser,
    registerUser,
    updateUserProfile,
    handleImageUpload,
    generateAdminInviteToken,
    generateFakeCredentials
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", protect, getUserProfile);
authRouter.put("/profile", protect, updateUserProfile);

authRouter.post("/upload-image", upload.single("image"), handleImageUpload);
authRouter.post("/generate-admin-invite-token", generateAdminInviteToken);
authRouter.get("/generate-fake-credentials", generateFakeCredentials);

export default authRouter;