// noinspection JSUnresolvedReference

import User from "../models/User.js";
import Task from "../models/Task.js";
import joi from "joi";

// Joi Email schema
const emailSchema = joi.object({
    email: joi.string().email().required()
});

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
        const allUsers = await User.find({ role: "Member", admins: req.userId }, null, null).select("-password");

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
        if(!user) return res.status(404).json({ message: "User not found" });

        if(!user.admins.some((id) => id.toString() === req.userId.toString())) return res.status(400).json({ message: "Not authorized" });

        const userWithTaskCount = await addTaskCount(user);
        res.status(200).json({ userWithTaskCount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc Add a member to Team
// @route POST /api/users/
// @access Private (Admin Only)
const addMember = async (req, res) => {
    try {
        const { error, value } = emailSchema.validate(req.body);
        if(error) return res.status(400).json({ message: "Validation failed", error });
        const { email } = value;

        const member = await User.findOne({ email }, null, null);
        if(!member) return res.status(404).json({ message: "User not found" });
        if(member.role === "Admin") return res.status(400).json({ message: "Only members can be added to a team" });
        const admin = await User.findById(req.userId, null, null);

        if (!admin.members.some(id => id.equals(member._id))) {
            admin.members.push(member._id);
            await admin.save();
        }

        if (!member.admins.some(id => id.equals(admin._id))) {
            member.admins.push(admin._id);
            await member.save();
        }

        res.status(200).json({ user: admin });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc Remove a member from Team
// @route POST /api/users/delete
// @access Private (Admin Only)
const removeMember = async (req, res) => {
    try {
        const { error, value } = emailSchema.validate(req.body);
        if(error) return res.status(400).json({ message: "Validation failed", error });
        const { email } = value;

        const member = await User.findOne({ email }, null, null);
        if(!member) return res.status(404).json({ message: "User not found" });
        const admin = await User.findById(req.userId, null, null);

        const tasks = await Task.find({ createdBy: req.userId }, null, null);
        await Promise.all(
            tasks.map(async (task) => {
                const beforeCount = task.assignedTo.length;
                task.assignedTo = task.assignedTo.filter(id => !id.equals(member._id));
                if (task.assignedTo.length !== beforeCount) {
                    await task.save();
                }
            })
        );

        admin.members = admin.members.filter(id => !id.equals(member._id));
        await admin.save();

        member.admins = member.admins.filter(id => !id.equals(admin._id));
        await member.save();

        res.status(200).json({ user: admin });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};

export { getAllUsers, getUserById, addMember, removeMember };