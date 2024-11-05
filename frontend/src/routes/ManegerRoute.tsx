import React from "react";
import { Route, Routes } from "react-router-dom";
import DashBoardLayout from "../pages/mangerPages/DashboardLayout";
import Dashboard from "../components/manager/dashboard/Dashboard";
import Employees from "../components/manager/dashboard/Employees";
import Departments from "../components/manager/dashboard/Departments";
import Attendance from "../components/manager/dashboard/Attendance";
import Payroll from "../components/manager/dashboard/Payroll";
import Leaves from "../components/manager/dashboard/Leaves";
import Announcements from "../components/global/Announcements";
import Notifications from "../components/global/Notifications";
import ServiceRequests from "../components/manager/dashboard/ServiceRequest";


const MangerRoutes = () => {
  return (
    <Routes>
      <Route element={<DashBoardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="emoployees" element={<Employees />} />
        <Route path="departments" element={<Departments />} />
        <Route path="attendances" element={<Attendance />} />
        <Route path="service-requests" element={<ServiceRequests />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Notifications />} />
        <Route path="settings" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default MangerRoutes;
