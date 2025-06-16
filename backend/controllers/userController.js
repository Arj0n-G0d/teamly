// noinspection JSUnresolvedReference

import User from "../models/User.js";
import Task from "../models/Task.js";

// Add task counts to the given User
const addTaskCount = async (user) => {
    const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
    const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

    return {
        ...user._doc, // Include all existing User data
        pendingTasks,
        inProgressTasks,
        completedTasks
    };
}

// @desc Get all users
// @route GET /api/users/
// @access Private (Admin Only)
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({ role: "Member" }).select("-password");

        // Add task counts to each User
        const allUsersWithTaskCount = await Promise.all(
            allUsers.map(addTaskCount)
        );

        res.status(200).json({ allUsersWithTaskCount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private (Admin Only)
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id, null, null);
        if(!user) res.status(404).json({ message: "User not found" });

        const userWithTaskCount = await addTaskCount(user);
        res.status(200).json({ userWithTaskCount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export { getAllUsers, getUserById };