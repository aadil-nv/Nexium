import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeePrivateRoute from "./employeePrivateRoute";
import DashBoardLayout from "../pages/employeePages/DashboardLayout";
import Dashboard from "../components/employees/Dashboard";
import Department from "../components/employees/Department";
import Profile from "../components/global/Profile";
import PersonalDetailes from "../components/global/PersonalDetailes";
import Address from "../components/global/Address";
import Documents from "../components/global/Documents";
import Securitie from "../components/global/Securitie";
import Notifications from "../components/global/Notifications";
import Payroll from "../components/employees/Payroll";
import Announcements from "../components/global/Announcements";
import Attendance from "../components/employees/Attendance";
import Task from "../components/employees/Task";
import MyTask from "../components/employees/MyTask";
import Settings from "../components/global/Settings";
import Chat from "../components/global/Chat";
import Meeting from "../components/global/Meeting";
import MyTaskList from "../components/employees/MyTaskList";

const BusinessOwnerRoutes = () => {


    return (
      <Routes>
        <Route element={<EmployeePrivateRoute />}> 
          <Route element={<DashBoardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="team" element={<Department />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="profile" element={<Profile />} />
            <Route path="personaldetails" element={<PersonalDetailes  />} />
            <Route path="address" element={<Address />} />
            <Route path="documents" element={<Documents />} />
            <Route path="security" element={<Securitie />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="tasks" element={<Task />} />

            <Route path="task/:id" element={<MyTask />} />
            <Route path="task-list" element={<MyTaskList />} />

            <Route path="settings" element={<Settings />} />
            <Route path="chat" element={<Chat />} />
            <Route path="meeting" element={<Meeting />} />

            
          </Route>
        </Route>
      </Routes>
    );
  };
  
  export default BusinessOwnerRoutes;