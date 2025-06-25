import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import { PRIORITY_DATA } from "../../utils/data.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import Input from "../../components/inputs/Input.jsx";
import SelectDropdown from "../../components/inputs/SelectDropdown.jsx";
import SelectUsers from "../../components/inputs/SelectUsers.jsx";
import TodoListInput from "../../components/inputs/TodoListInput.jsx";
import AttachmentsInput from "../../components/inputs/AttachmentsInput.jsx";
import Spinner from "../../components/others/Spinner.jsx";
import Modal from "../../components/others/Modal.jsx";
import DeleteAlert from "../../components/others/DeleteAlert.jsx";

const CreateTask = () => {
    const location = useLocation();
    const { taskId } = location.state || {};

    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Low",
        dueDate: new Date().toISOString().split('T')[0],
        assignedTo: [],
        todoChecklist: [],
        attachments: []
    });

    const [currentTask, setCurrentTask] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [hasTaskDataBeenCleared, setHasTaskDataBeenCleared] = useState(false);

    const handleValueChange = (key, value) => {
        setTaskData((prevData) => ({ ...prevData, [key]: value }));
    };
    const clearData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "Low",
            dueDate: new Date().toISOString().split('T')[0],
            assignedTo: [],
            todoChecklist: [],
            attachments: []
        });
    };

    if(!taskId && !hasTaskDataBeenCleared) {
        clearData();
        setHasTaskDataBeenCleared(true);
    }

    // Create a Task
    const createTask = async () => {
        setButtonLoading(true);

        try {
            const todoList = taskData.todoChecklist?.map((item) => ({
                text: item,
                completed: false
            }));

            await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todoList
            });

            toast.success("Task Created Successfully");
            clearData();
            navigate("/admin/manage-tasks");
        } catch(error) {
            console.error("Error creating task", error);
            toast.error("Error Creating Task");
        } finally {
            setButtonLoading(false);
        }
    };

    // Update Task
    const updateTask = async () => {
        setButtonLoading(true);

        try {
            const todoList = taskData.todoChecklist?.map((item) => {
                const prevTodoChecklist = currentTask?.todoChecklist?.todoChecklist || [];
                const matchedTask = prevTodoChecklist.find((todo) => todo.text === item);
                return {
                    text: item,
                    completed: matchedTask ? matchedTask.completed : false
                };
            });

            await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todoList
            });
            toast.success("Task Updated Successfully");
            navigate("/admin/manage-tasks");
        } catch(error) {
            console.error("Error updating task", error);
            toast.error("Error Updating Task");
        } finally {
            setButtonLoading(false);
        }
    };

    const handleSubmit = async () => {
        setError("");

        if(!taskData.title.trim()) {
            setError("Title is required");
            return;
        }

        if(!taskData.description.trim()) {
            setError("Description is required");
            return;
        }

        if(!taskData.dueDate) {
            setError("Due date is required");
            return;
        }

        if(taskData.assignedTo?.length === 0) {
            setError("Task not assigned to anyone");
            return;
        }

        if(taskData.todoChecklist?.length === 0) {
            setError("Add at least one TODO");
            return;
        }

        if(taskId) {
            await updateTask();
            return;
        }

        await createTask();
    };

    // Get Task details by ID
    const getTaskDetailsByID = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

            if(response.data) {
                const taskInfo = response.data.task;
                setCurrentTask(taskInfo);
                setTaskData((prevState) => ({
                    title: taskInfo.title,
                    description: taskInfo.description,
                    priority: taskInfo.priority,
                    dueDate: taskInfo.dueDate
                    ? new Date(taskInfo.dueDate).toISOString().split('T')[0]
                        : null,
                    assignedTo: taskInfo?.assignedTo || [],
                    todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
                    attachments: taskInfo?.attachments || []
                }));
            }
        } catch(error) {
            console.error("Error fetching task details", error);
        } finally {
            setLoading(false);
        }
    };

    // Delete Task
    const deleteTask = async () => {
        try {
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

            setOpenDeleteAlert(false);
            toast.success("Task Deleted Successfully");
            navigate("/admin/manage-tasks");
        } catch(error) {
            console.error("Error deleting task", error);
            toast.error("Error Deleting Task");
        } finally {
            setOpenDeleteAlert(false);
        }
    };

    useEffect(() => {
        if(taskId) getTaskDetailsByID();
    }, [taskId]);


    return (
        <>
            { loading ? (
                <Spinner />
            ) : (
                <DashboardLayout activeMenu={ "Create Task" }>
                    <div className="mt-5">
                        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                            <div className="form-card col-span-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl md:text-xl font-medium">
                                        { taskId ? "Update Task" : "Create Task" }
                                    </h2>
                                    { taskId && (
                                        <button
                                            className="flex items-center gap-1.5 text-[15px] font-meedium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                                            onClick={ () => setOpenDeleteAlert(true) }
                                        >
                                            <LuTrash2 className="text-base"/> Delete
                                        </button>
                                    ) }
                                </div>

                                <div className="mt-4">
                                    <label className="text-xs font-medium text-slate-600">
                                        Task Title
                                    </label>
                                    <Input
                                        placeholder={ "Create App UI" }
                                        className="form-input"
                                        value={ taskData.title }
                                        onChange={ ({ target }) => handleValueChange("title", target.value) }
                                    />
                                </div>

                                <div className="mt-3">
                                    <label className="text-xs font-medium text-slate-600">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder={ "Design and implement the initial user interface layout for the application" }
                                        className="form-input"
                                        rows={4}
                                        value={ taskData.description }
                                        onChange={ ({ target }) => handleValueChange("description", target.value) }
                                    />
                                </div>

                                <div className="grid grid-cols-12 gap-4 mt-2">
                                    <div className="col-span-6 md:col-span-4">
                                        <label className="text-xs font-medium text-slate-600">
                                            Priority
                                        </label>

                                        <SelectDropdown
                                            options={ PRIORITY_DATA }
                                            value={ taskData.priority }
                                            onChange={ (value) => handleValueChange("priority", value) }
                                            placeholder={ "Select Priority" }
                                        />
                                    </div>

                                    <div className="col-span-6 md:col-span-4">
                                        <label className="text-xs font-medium text-slate-600">
                                            Due Date
                                        </label>
                                        <input
                                            placeholder={ "Due Date" }
                                            className="form-input"
                                            value={ taskData.dueDate }
                                            onChange={ ({ target }) => handleValueChange("dueDate", target.value) }
                                            type={ "date" }
                                        />
                                    </div>

                                    <div className="col-span-12 md:col-span-3">
                                        <label className="text-xs font-medium text-slate-600">
                                            Assign To
                                        </label>
                                        <SelectUsers
                                            selectedUsers={ taskData?.assignedTo }
                                            setSelectedUser={ (value) => {
                                                handleValueChange("assignedTo", value);
                                            } }
                                        />
                                    </div>

                                </div>

                                <div className="mt-3">
                                    <label className="text-xs font-medium text-slate-600">
                                        TODO Checklist
                                    </label>

                                    <TodoListInput
                                        todoList={ taskData?.todoChecklist }
                                        setTodoList={ (value) => handleValueChange("todoChecklist", value) }
                                    />
                                </div>

                                <div className="mt-3">
                                    <label className="text-xs font-medium text-slate-600">
                                        Add Attachments
                                    </label>

                                    <AttachmentsInput
                                        attachments={ taskData?.attachments }
                                        setAttachments={ (value) => handleValueChange("attachments", value) }
                                    />
                                </div>

                                { error && <p className="text-red-500 text-xs pt-4">{error}</p> }

                                <div className="flex w-full mt-7">
                                    <button
                                        className="btn-primary"
                                        onClick={ handleSubmit }
                                        disabled={ buttonLoading }
                                    >
                                        {taskId ? "Update Task" : "Create Task"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal
                        isOpen={ openDeleteAlert }
                        onClose={ () => setOpenDeleteAlert(false) }
                        title={ "Delete Task" }
                    >
                        <DeleteAlert
                            content={ "Are you sure you want to delete this task?" }
                            onDelete={ () => deleteTask() }
                            onCancel={ () => setOpenDeleteAlert(false) }
                            buttonContent={ "Delete" }
                        />
                    </Modal>
                </DashboardLayout>
            )}
        </>
    );
};

export default CreateTask;