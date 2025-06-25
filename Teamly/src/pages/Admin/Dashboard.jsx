// noinspection JSUnresolvedReference

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import moment from "moment";
import InfoCard from "../../components/cards/InfoCard.jsx";
import { BsClipboardData } from "react-icons/bs";
import { MdPendingActions } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdTaskAlt } from "react-icons/md";
import { addThousandsSeparator } from "../../utils/helper.js";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/others/TaskListTable.jsx";
import CustomPieChart from "../../components/charts/CustomPieChart.jsx";
import CustomBarChart from "../../components/charts/CustomBarChart.jsx";
import Spinner from "../../components/others/Spinner.jsx";

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    const [loading, setLoading] = useState(true);

    const hour = moment().hour();
    const greeting =
        hour < 12 ? "Good Morning" :
            hour < 18 ? "Good Afternoon" :
                "Good Evening";

    const getDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
            if(response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data.charts || null);
            }
        }  catch(error) {
            console.error("Error fetching dashboard data: ", error);
        } finally {
            setLoading(false);
        }
    }

    const prepareChartData = (data) => {
        const taskDistribution = data?.statusDistribution || null;
        const taskPriorityDistribution = data?.priorityDistribution || null;

        const taskDistributionData = [
            { status: "Pending", count: taskDistribution?.Pending || 0 },
            { status: "In Progress", count: taskDistribution?.InProgress || 0 },
            { status: "Completed", count: taskDistribution?.Completed || 0 }
        ];
        setPieChartData(taskDistributionData);

        const taskPriorityDistributionData = [
            { priority: "Low", count: taskPriorityDistribution?.Low || 0 },
            { priority: "Moderate", count: taskPriorityDistribution?.Moderate || 0 },
            { priority: "High", count: taskPriorityDistribution?.High || 0 }
        ];
        setBarChartData(taskPriorityDistributionData);
    };

    const onSeeMore = () => {
        navigate('/admin/manage-tasks');
    };

    const STATUS_COLORS = [
        "#fcd34d", // amber-300 (Pending)
        "#a5b4fc", // indigo-300 (In Progress)
        "#6ee7b7"  // emerald-300 (Completed)
    ];


    const PRIORITY_COLORS = [
        "#67e8f9", // cyan-300 (Low)
        "#e879f9", // fuchsia-300 (Moderate)
        "#fda4af"  // rose-300 (High)
    ];


    useEffect(() => {
        getDashboardData();
    }, []);

    return (
        <>
            { loading ? (
                <Spinner />
            ) : (
                <DashboardLayout activeMenu={ "Dashboard" }>
                    <div className="card my-5">
                        <div>
                            <div className="col-span-3">
                                <h2 className="text-xl md:text-2xl">{ `${greeting}! ${user?.name}` }</h2>
                                <p className="text-xs md:text-[15px] text-gray-400 mt-1.5">
                                    { moment().format("dddd Do MMMM YYYY") }
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5 ">
                            <InfoCard
                                Icon={ BsClipboardData }
                                label={"Total MyTasks"}
                                value={addThousandsSeparator(
                                    dashboardData?.charts?.statusDistribution?.All || 0
                                )}
                                color={ "bg-primary" }
                            />
                            <InfoCard
                                Icon={ MdPendingActions }
                                label={"Pending MyTasks"}
                                value={addThousandsSeparator(
                                    dashboardData?.charts?.statusDistribution?.Pending || 0
                                )}
                                color={ "bg-amber-300" }
                            />
                            <InfoCard
                                Icon={ AiOutlineLoading3Quarters }
                                label={"In Progress MyTasks"}
                                value={addThousandsSeparator(
                                    dashboardData?.charts?.statusDistribution?.InProgress || 0
                                )}
                                color={ "bg-indigo-300" }
                            />
                            <InfoCard
                                Icon={ MdTaskAlt }
                                label={"Completed MyTasks"}
                                value={addThousandsSeparator(
                                    dashboardData?.charts?.statusDistribution?.Completed || 0
                                )}
                                color={ "bg-emerald-300" }
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
                        <div>
                            <div className="card">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-medium">Task Distribution</h5>
                                </div>
                                <CustomPieChart
                                    data={ pieChartData }
                                    colors={ STATUS_COLORS }
                                />
                            </div>
                        </div>

                        <div>
                            <div className="card">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-medium">Priority Distribution</h5>
                                </div>
                                <CustomBarChart
                                    data={ barChartData }
                                    colors={ PRIORITY_COLORS }
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="card">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-lg">Recent Tasks</h5>
                                    <button className="card-btn" onClick={ onSeeMore }>
                                        See All <LuArrowRight className="text-base" />
                                    </button>
                                </div>
                                <TaskListTable tableData={ dashboardData?.recentTasks || [] }/>
                            </div>
                        </div>
                    </div>
                </DashboardLayout>
            )}
        </>
    );
};

export default Dashboard;