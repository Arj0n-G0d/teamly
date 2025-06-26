import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";

import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";

import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import ManageTasks from "./pages/Admin/ManageTasks.jsx";
import CreateTask from "./pages/Admin/CreateTask.jsx";
import TeamMembers from "./pages/Admin/TeamMembers.jsx";

import UserDashboard from "./pages/User/Dashboard.jsx";
import MyTasks from "./pages/User/MyTasks.jsx";
import UserProvider, { UserContext } from "./context/UserContext.jsx";
import { Toaster } from "react-hot-toast";
import ViewTaskDetails from "./pages/User/ViewTaskDetails.jsx";
import { BrowserRouter } from "react-router-dom";

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading) return <Outlet />;

  if(!user) return <Navigate to="/login" />;

  return user.role === "Admin"
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/user/dashboard" />;
};


const App = () => {
    return (
        <UserProvider>
            <div>
                <BrowserRouter basename="/teamly">
                    <Routes>

                        {/* Default Route */}
                        <Route path="/" element={<Root />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/sign-up" element={<SignUp />} />

                        {/* Admin Routes */}
                        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/manage-tasks" element={<ManageTasks />} />
                            <Route path="/admin/team-members" element={<TeamMembers />} />
                            <Route path="/admin/create-task" element={<CreateTask />} />
                        </Route>

                        {/* User Routes */}
                        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                            <Route path="/user/dashboard" element={<UserDashboard />} />
                            <Route path="/user/my-tasks" element={<MyTasks />} />
                            <Route path="/user/view-task-details/:id" element={<ViewTaskDetails />} />
                        </Route>

                    </Routes>
                </BrowserRouter>
            </div>

            <Toaster
                toastOptions={{
                    className: "",
                    style: {
                        fontSize: "15px",
                    },
                }}
            />
        </UserProvider>
    );
}

export default App;