// noinspection JSUnresolvedReference

import Task from "../models/Task.js";
import joi from "joi";

// Joi Todo Schema
const todoCreateSchema = joi.object({
    text: joi.string().min(1).required(),
    completed: joi.boolean().default(false)
});

const todoUpdateSchema = joi.object({
    _id: joi.string(),
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
    description: joi.string().allow(""),
    priority: joi.string().valid("Low", "Moderate", "High"),
    dueDate: joi.date().min("now"),
    assignedTo: joi.array().items(joi.string()),
    attachments: joi.array().items(joi.string()),
    todoChecklist: joi.array().items(todoUpdateSchema)
});

// Joi Status Schema
const statusSchema = joi.object({
    status: joi.string().valid("Pending", "In Progress", "Completed")
});

// Joi TodoChecklist Schema
const todoChecklistSchema = joi.object({
    todoChecklist: joi.array().items(todoUpdateSchema)
});

// @desc Get Dashboard Data
// @route GET /api/tasks/dashboard-data
// @access Private (Admin Only)
const getDashboardData = async (req, res) => {
    try {
        // Fetch Statistics
        const totalTasks = await Task.countDocuments({ createdBy: req.userId });
        const overDueTasks = await Task.countDocuments({
            createdBy: req.userId ,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        // Task Distribution by Status
        const statuses = ["Pending", "In Progress", "Completed"];
        const statusDistributionRaw = await Task.aggregate([
            {
                $match: { createdBy: req.userId }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const statusDistribution = statuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); // Remove spaces for response keys
            acc[formattedKey] = statusDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        statusDistribution["All"] = totalTasks;
        statusDistribution["OverDueTasks"] = overDueTasks;

        // Ensure all priorities are included
        const priorities = ["Low", "Moderate", "High"];
        const priorityDistributionRaw = await Task.aggregate([
            {
                $match: { createdBy: req.userId }
            },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);
        const priorityDistribution = priorities.reduce((acc, priority) => {
            acc[priority] = priorityDistributionRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find({ createdBy: req.userID }, null, null).sort({ createdAt: -1 })
            .limit(10).select("title status priority dueDate createdAt");

        res.status(200).json({
            charts: {
                statusDistribution,
                priorityDistribution
            },
            recentTasks
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Get User Dashboard Data
// @route GET /api/tasks/user-dashboard-data
// @access Private (Requires JWT)
const getUserDashboardData = async (req, res) => {
    try {
        // Fetch Statistics
        const id = req.userId;
        const totalTasks = await Task.countDocuments({ assignedTo: id });
        const overDueTasks = await Task.countDocuments({
            assignedTo: id,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        // Task Distribution by Status
        const statuses = ["Pending", "In Progress", "Completed"];
        const statusDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const statusDistribution = statuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = statusDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        statusDistribution["All"] = totalTasks;
        statusDistribution["OverDueTasks"] = overDueTasks;

        // Task Distribution by Priority
        const priorities = ["Low", "Moderate", "High"];
        const priorityDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: id } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);
        const priorityDistribution = priorities.reduce((acc, priority) => {
            acc[priority] = priorityDistributionRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find({ createdBy: req.userId }, null, null)
            .sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt");

        res.status(200).json({
            charts: {
                statusDistribution,
                priorityDistribution
            },
            recentTasks
        });
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
        if(error) return res.status(400).json({ message: "Validation failed", error });

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
                Task.find({ ...filter, createdBy: req.userId }, null, null)
                    .populate("assignedTo", "name email profileImageUrl");

        else
            tasks = await Task.find({ ...filter, assignedTo: req.userId }, null, null)
                .populate("assignedTo", "name email profileImageUrl")
                .populate("createdBy", "name email _id");

        // Add the count of todos completed to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                let todosCompleted = 0;
                task.todoChecklist.forEach((todo) => {
                    if(todo.completed) todosCompleted++;
                });
                return { ...task._doc, todosCompleted };
            })
        );

        // Status (All, Pending, In Progress, Completed) summary counts
        const allTasks = await Task.countDocuments(
            req.userRole === "Admin" ? { createdBy: req.userId } : { assignedTo: req.userId }
        );
        const pendingTasks = await Task.countDocuments(
            req.userRole === "Admin" ? { createdBy: req.userId, status: "Pending" } : { assignedTo: req.userId, status: "Pending" }
        );
        const inProgressTasks = await Task.countDocuments(
            req.userRole === "Admin" ? { createdBy: req.userId, status: "In Progress" } : { assignedTo: req.userId, status: "In Progress" }
        );
        const completedTasks = await Task.countDocuments(
            req.userRole === "Admin" ? { createdBy: req.userId, status: "Completed" } : { assignedTo: req.userId, status: "Completed" }
        );

        res.status(200).json({
            tasks,
            statusSummary: {
                allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
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
        const { id } = req.params;
        let task;
        
        if(req.userRole === "Admin") task = await Task.findById(id, null, null);
        else task = await Task.findById(id, null, null).populate("assignedTo", "name email profileImageUrl").populate("createdBy", "name email");

        if(!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Update Task by ID
// @route PUT /api/tasks/:id
// @access Private (Requires JWT)
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id, null, null).populate("assignedTo", "name email profileImageUrl").populate("createdBy", "name email");
        if(!task) return res.status(404).json({ message: "Task not found" });

        const { error, value } = taskUpdateSchema.validate(req.body);
        if(error) return res.status(400).json({ message: "Validation failed", error });

        const {
            title, description, priority, dueDate,
            assignedTo, attachments, todoChecklist
        } = value;

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;
        task.attachments = attachments || task.attachments;
        task.todoChecklist = todoChecklist || task.todoChecklist;

        await task.save();
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Delete Task by ID
// @route DELETE /api/tasks/:id
// @access Private (Admin Only)
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if(!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Update Task status by ID
// @route PUT /api/tasks/:id/status
// @access Private (Requires JWT)
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id, null, null);
        if(!task) return res.status(404).json({ message: "Task not found" });

        const { error, value } = statusSchema.validate(req.body);
        if(error) return res.status(400).json({ message: "Validation failed", error });
        const { status } = value;

        const isAssigned = task.assignedTo.some(id => id === req.userId);
        if(!(isAssigned || req.userRole === "Admin")) return res.status(403).json({ message: "Not authorized" });

        task.status = status || task.status;

        if(task.status === "Completed") {
            task.todoChecklist.forEach((todo) => { todo.completed = true; });
            task.progress = 100;
        }
        else {
            task.todoChecklist.forEach((todo) => { todo.completed = false; });
            task.progress = 0;
        }

        await task.save();
        res.status(200).json({ message: "Task Status updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Update Task Checklist by ID
// @route PUT /api/tasks/:id/todo
// @access Private (Requires JWT)
const updateTaskChecklist = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id, null, null).populate("createdBy", "name email");
        if(!task) return res.status(404).json({ message: "Task not found" });

        const { error, value } = todoChecklistSchema.validate(req.body);
        if(error) return res.status(400).json({ message: "Validation failed", error });
        const { todoChecklist } = value;

        const isAssigned = task.assignedTo.some(id => id.toString() === req.userId.toString());
        if(!(isAssigned || req.userRole === "Admin"))  return res.status(403).json({ message: "Not authorized" });

        task.todoChecklist = todoChecklist || task.todoChecklist;

        const totalCount = task.todoChecklist.length;
        let completedCount = 0;
        task.todoChecklist.forEach(todo => {
            if(todo.completed) completedCount++;
        });
        task.progress = totalCount !== 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        if(task.progress === 100) task.status = "Completed";
        else if(task.progress > 0) task.status = "In Progress";
        else task.status = "Pending";

        await task.save();
        const updatedTask = await Task.findById(id).populate("assignedTo", "name email profileImageUrl").populate("createdBy", "name email");
        res.status(200).json({ task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

export {
    getDashboardData, getUserDashboardData, createTask, getAllTasks,
    getTaskById, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist
};
