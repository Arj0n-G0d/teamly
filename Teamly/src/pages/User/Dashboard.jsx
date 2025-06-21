import useUserAuth from "../../hooks/useUserAuth.jsx";

const Dashboard = () => {
    useUserAuth();
    return <div>Dashboard</div>
};

export default Dashboard;