// noinspection JSUnresolvedReference

import useUserAuth from "../../hooks/useUserAuth.jsx";
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

const Dashboard = () => {
    useUserAuth();

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    const hour = moment().hour();
    const greeting =
        hour < 12 ? "Good Morning" :
            hour < 18 ? "Good Afternoon" :
                "Good Evening";

    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
            if(response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data.charts || null);
            }
        }  catch(error) {
            console.error("Error fetching dashboard data", error);
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
        navigate('/admin/tasks');
    };

    const STATUS_COLORS = [
        "#efb100", "#00b8db", "#00bc7d"
    ];

    const PRIORITY_COLORS = [
        "#00c951", "#ff6900", "#fb2c36"
    ];

    useEffect(() => {
        getDashboardData();
    }, []);
    return <DashboardLayout activeMenu={ "Dashboard" }>
        <div className="card my-5">
            <div>
                <div className="col-span-3">
                    <h2 className="text-xl md:text-2xl">{ `${greeting}! ${user?.name}` }</h2>
                    <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                        { moment().format("dddd Do MMMM YYYY") }
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5 ">
                <InfoCard
                    Icon={ BsClipboardData }
                    label={"Total Tasks"}
                    value={addThousandsSeparator(
                        dashboardData?.charts?.statusDistribution?.All || 0
                    )}
                    color={ "bg-blue-600" }
                />
                <InfoCard
                    Icon={ MdPendingActions }
                    label={"Pending Tasks"}
                    value={addThousandsSeparator(
                        dashboardData?.charts?.statusDistribution?.Pending || 0
                    )}
                    color={ "bg-yellow-500" }
                />
                <InfoCard
                    Icon={ AiOutlineLoading3Quarters }
                    label={"In Progress Tasks"}
                    value={addThousandsSeparator(
                        dashboardData?.charts?.statusDistribution?.InProgress || 0
                    )}
                    color={ "bg-cyan-500" }
                />
                <InfoCard
                    Icon={ MdTaskAlt }
                    label={"Completed Tasks"}
                    value={addThousandsSeparator(
                        dashboardData?.charts?.statusDistribution?.Completed || 0
                    )}
                    color={ "bg-emerald-500" }
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
};

export default Dashboard;