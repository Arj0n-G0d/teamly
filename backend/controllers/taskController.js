// noinspection JSUnresolvedReference

import Task from "../models/Task.js";
import joi from "joi";

// Joi Todo Schema
const todoCreateSchema = joi.object({
    text: joi.string().min(1).required(),
    completed: joi.boolean().default(false)
});

const todoUpdateSchema = joi.object({
    text: joi.string().min(1),
    completed: joi.boolean()
});

// Joi Task Schema
const taskCreateSchema = joi.object({
    title: joi.string().min(1).required(),
    description: joi.string().default("").allow(""),
    priority: joi.string().valid("Low", "Moderate", "High").default("Moderate"),
    dueDate: joi.date().min("now").required(),
    assignedTo: joi.array().items(joi.string()),
    attachments: joi.array().items(joi.string()),
    todoChecklist: joi.array().items(todoCreateSchema)
});

const taskUpdateSchema = joi.object({
    title: joi.string().min(1),
    description: joi.string().default("").allow(""),
    priority: joi.string().valid("Low", "Moderate", "High").default("Moderate"),
    dueDate: joi.date().min("now"),
    assignedTo: joi.array().items(joi.string()),
    attachments: joi.array().items(joi.string()),
    todoChecklist: joi.array().items(todoUpdateSchema)
});

// @desc Get Dashboard Data
// @route GET /api/tasks/dashboard-data
// @access Private (Requires JWT)
const getDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Get User Dashboard Data
// @route GET /api/tasks/user-dashboard-data
// @access Private (Requires JWT)
const getUserDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Create Task
// @route POST /api/tasks
// @access Private (Admin Only)
const createTask = async (req, res) => {
    try {
        if(!req.body) return res.status(400).json({ message: "No body sent" });

        const { error, value } = taskCreateSchema.validate(req.body);
        if(error) {
            return res.status(400).json({ message: "Validation failed", error });
        }
        const {
            title, description, priority, dueDate,
            assignedTo, attachments, todoChecklist
        } = value;

        const task = new Task({
            title, description, priority, dueDate,
            assignedTo, createdBy: req.userId, attachments, todoChecklist
        });

        await task.save();
        res.status(201).json({ task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Get all Tasks (Admin: All, Member: Assigned)
// @route GET /api/tasks/
// @access Private (Requires JWT)
const getAllTasks = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};

        if(status) filter["status"] = status;

        let tasks;
        if(req.userRole === "Admin")
            tasks = await
                Task.find(filter, null, null)
                    .populate("assignedTo", "name email profileImageUrl");

        else
            tasks = await
                Task.find({ ...filter, assignedTo: req.userId }, null, null)
                    .populate("assignedTo", "name email profileImageUrl");

        // Add the count of todos completed to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                let todosCompleted = 0;
                for(let todo in task.todoChecklist) {
                    if(todo.completed) todosCompleted++;
                }
                return { ...task._doc, todosCompleted };
            })
        );

        // Status (All, Pending, In Progress, Completed) summary counts
        const allTasks = await Task.countDocuments(
            req.userRole === "Admin" ? {} : { assignedTo: req.userId }
        );
        const pendingTasks = await Task.countDocuments(
            req.userRole === "Admin" ? { status: "Pending" } : { assignedTo: req.userId, status: "Pending" }
        );
        const inProgressTasks = await Task.countDocuments(
            req.userRole === "Admin" ? { status: "In Progress" } : { assignedTo: req.userId, status: "In Progress" }
        );
        const completedTasks = await Task.countDocuments(
            req.userRole === "Admin" ? { status: "Completed" } : { assignedTo: req.userId, status: "Completed" }
        );

        res.status(200).json({
            tasks,
            allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Get Task by ID
// @route GET /api/tasks/:id
// @access Private (Requires JWT)
const getTaskById = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Update Task by ID
// @route PUT /api/tasks/:id
// @access Private (Requires JWT)
const updateTask = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Delete Task by ID
// @route DELETE /api/tasks/:id
// @access Private (Admin Only)
const deleteTask = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Update Task status by ID
// @route GET /api/tasks/:id/status
// @access Private (Requires JWT)
const updateTaskStatus = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Update Task Checklist by ID
// @route GET /api/tasks/:id/todo
// @access Private (Requires JWT)
const updateTaskChecklist = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

export {
    getDashboardData, getUserDashboardData, createTask, getAllTasks,
    getTaskById, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist
};
