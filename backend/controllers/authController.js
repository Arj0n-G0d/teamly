// noinspection JSUnresolvedReference

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import joi from "joi";

//  Generate JWT
const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// User Joi Schemas
const userRegisterSchema = joi.object({
    name: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    profileImageUrl: joi.string().default("").allow(""),
    adminInviteToken: joi.string()
});

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
});

const userUpdateSchema = joi.object({
    name: joi.string().min(2),
    email: joi.string().email(),
    password: joi.string().min(8),
    profileImageUrl: joi.string().allow("")
});

// @desc Register new User
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        if(!req.body) return res.status(400).json({ message: "No body sent" });

        const { error, value } = userRegisterSchema.validate(req.body);
        if(error) return res.status(400).json({ message: "Validation failed", error });
        const { name, email, password, profileImageUrl, adminInviteToken } = value;

        // Check for existing Eser
        const existingUser = await User.findOne({ email }, null, null);
        if(existingUser) return res.status(409).json({ message: "User already exists" });

        // Deciding User role
        let role = "Member";
        if(adminInviteToken === process.env.ADMIN_INVITE_TOKEN) role = "Admin";

        // Hashing Password
        const hashedPass = await bcrypt.hash(password, 10);

        // Create a new User
        const user = new User({
            name, email, password: hashedPass, role, profileImageUrl
        });
        await user.save();

        // Return User data with JWT
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc Login User
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        if(!req.body) return res.status(400).json({ message: "No body sent" });

        const { error, value } = userLoginSchema.validate(req.body);
        if(error) return res.status(400).json({ message: "Validation failed", error });
        const { email, password } = value;

        // Get existing User (If exists)
        const user = await User.findOne({ email }, null, null);
        if(!user) return res.status(401).json({ message: "Invalid email or password" });

        // Password Matching
        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched) return res.status(401).json({ message: "Invalid email or password" });

        // Return User data with JWT
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc Get User profile
// @route GET /api/auth/profile
// @access Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId, null, null).select("-password");

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc Update User profile
// @route PUT /api/auth/profile
// @access Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        if(!req.body) return res.status(400).json({ message: "No body sent" });

        const { error, value } = userUpdateSchema.validate(req.body);
        if(error) return res.status(400).json({ message: "Validation failed", error });
        const { name, email, password, profileImageUrl } = value;

        const user = await User.findById(req.userId, null, null);

        if(name) user.name = name;
        if(email) user.email = email;
        if(password) user.password = await bcrypt.hash(password, 10);
        if(profileImageUrl) user.profileImageUrl = profileImageUrl;

        let updatedUser = await user.save();

        res.status(201).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImageUrl: updatedUser.profileImageUrl,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc Handle image upload
// @route POST /api/auth/image-upload
// @access Public
const handleImageUpload = (req, res) => {
    if(!req.file) return res.status(400).json({message: "No image uploaded"});
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
};

export { registerUser, loginUser, getUserProfile, updateUserProfile, handleImageUpload };
