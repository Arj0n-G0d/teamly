import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if(token?.startsWith("Bearer")) {
            token = token.split(" ")[1]; // Extracting Token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decodedToken.id, null, null).select("-password");
            if(!user) return res.status(404).json({ message: "User not found" });
            req.user = user;

            next();
        }
        else res.status(401).json({ message: "No Token or Not authorized" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const adminOnly = async (req, res, next) => {
    if(req.user?.role === "Admin") next();
    else res.status(403).json({ message: "Access denied, Admin only" });
}

export { protect, adminOnly };