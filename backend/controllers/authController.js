import User from "../models/User.js";
import bcrypt, {hash} from "bcryptjs";
import jwt from "jsonwebtoken";

//  Generate JWT
const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @desc: Register new User
// @route: POST /api/auth/register
// @access: Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;
        if(!name || !email || !password) return res.status(400).json({ message: "Required fields missing" });

        const existingUser = await User.findOne({ email }, null, null);
        if(existingUser) return res.status(400).json({ message: "User already exists" });

        let role = "Member";
        if(adminInviteToken === process.env.ADMIN_INVITE_TOKEN) role = "Admin";

        const hashedPass = await bcrypt.hash(password, 10);
        const user = new User({
            name, email, password: hashedPass, role, profileImageUrl
        });
        await user.save();

        res.status(201).json({
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc: Login User
// @route: POST /api/auth/login
// @access: Public
const loginUser = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc: Get User profile
// @route: GET /api/auth/profile
// @access: Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc: Update User profile
// @route: PUT /api/auth/profile
// @access: Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
