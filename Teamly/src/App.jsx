import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";

import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import ManageTasks from "./pages/Admin/ManageTasks.jsx";
import CreateTask from "./pages/Admin/CreateTask.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";

import UserDashboard from "./pages/User/Dashboard.jsx";
import Tasks from "./pages/User/Tasks.jsx";

const App = () => {
  return (
      <div>
        <Router>
          <Routes>
            <Route path = "/login" element = {<Login />} />
            <Route path = "/sign-up" element = {<SignUp />} />

            {/*Admin Routes*/}
            <Route element = {<PrivateRoute allowedRoles = {["admin"]} />}>
              <Route path = "/admin/dashboard" element = {<AdminDashboard />} />
              <Route path = "/admin/manage-tasks" element = {<ManageTasks />} />
              <Route path = "/admin/manage-users" element = {<ManageUsers />} />
              <Route path = "/admin/create-task" element = {<CreateTask />} />
            </Route>

            {/*User Routes*/}
            <Route element = {<PrivateRoute allowedRoles = {["user"]} />}>
              <Route path = "/user/dashboard" element = {<UserDashboard />} />
              <Route path = "/user/tasks" element = {<Tasks />} />
            </Route>
          </Routes>
        </Router>
      </div>
  );
}

export default App;