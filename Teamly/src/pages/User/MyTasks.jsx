import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import Spinner from "../../components/others/Spinner.jsx";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/others/TaskStatusTabs.jsx";
import TaskCard from "../../components/cards/TaskCard.jsx";
import toast from "react-hot-toast";

const MyTasks = () => {
    const [allTasks, setAllTasks] = useState();

    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All")

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const getAllTasks = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus
                }
            });
            setAllTasks(response?.data?.tasks?.length > 0 ? response.data.tasks : []);

            const statusSummary = response?.data?.statusSummary || {};
            const statusArray = [
                { label: "All", count: statusSummary.allTasks || 0 },
                { label: "Pending", count: statusSummary.pendingTasks || 0 },
                { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
                { label: "Completed", count: statusSummary.completedTasks || 0 },
            ];

            setTabs(statusArray);
        } catch(error) {
            console.error("Error fetching tasks: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (taskId) => {
        navigate(`/user/view-task-details/${taskId}`);
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
                responseType: "blob"
            });

            // Create the URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "task_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Task Report Downloaded");
        } catch(error) {
            console.error("Error downloading user report", error);
            toast.error("Failed to Download Task Report");
        }
    };

    useEffect(() => {
        getAllTasks(filterStatus);
    }, [filterStatus]);

    return (
        <>
            { loading ? (
                <Spinner />
            ) : (
                <DashboardLayout activeMenu={ "My Tasks" }>
                    <div className="my-5">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                            <div className="flex md:flex md:items-center items-center justify-between gap-3">
                                <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
                            </div>

                            {tabs?.[0]?.count > 0 && (
                                <div className="flex items-center gap-3">
                                    <TaskStatusTabs
                                        tabs={ tabs }
                                        activeTab={ filterStatus }
                                        setActive={ setFilterStatus }
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 mb-5">
                        { allTasks?.map((item, index) => (
                            <TaskCard
                                key={ index }
                                title={ item.title }
                                description={ item.description }
                                priority={ item.priority }
                                status={ item.status }
                                progress={ item.progress }
                                createdAt={ item.createdAt }
                                dueDate={ item.dueDate }
                                assignedTo={ item.assignedTo?.map((item) => item.profileImageUrl) }
                                attachmentCount={ item.attachments?.length || 0 }
                                completedTodoCount={ item?.todosCompleted || 0}
                                todoChecklist={ item?.todoChecklist || [] }
                                onClick={() =>  handleClick(item._id) }
                                buttonContent= { "View" }
                                createdBy={ item.createdBy }
                            />
                        )) }
                    </div>
                </DashboardLayout>
            )}
        </>
    );
};

export default MyTasks;