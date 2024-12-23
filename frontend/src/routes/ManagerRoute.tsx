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
import ServiceRequests from "../components/global/ServiceRequests";
import ManagerPrivateRoute from "./ManagerPrivateRoute";
import OnBordingEmployeeList from "../components/manager/dashboard/OnBordingEmployeeList";
import PreBoarding from "../components/manager/dashboard/PreBoarding";
import Interview from "../components/manager/dashboard/Interview";
import Profile from "../components/global/Profile";
import PersonalDetailes from "../components/global/PersonalDetailes";
import Address from "../components/global/Address";
import Documents from "../components/global/Documents";
import Securitie from "../components/global/Securitie";
import Settings from "../components/global/Settings";


const MangerRoutes = () => {
  return (
    <Routes>
     <Route element={<ManagerPrivateRoute />}>
      <Route element={<DashBoardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="departments" element={<Departments />} />
      
        {/* <Route path="service-requests" element={<ServiceRequests />} /> */}
        <Route path="payroll" element={<Payroll />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        

          <Route path="personaldetails" element={<PersonalDetailes  />} />
          <Route path="address" element={<Address />} />
          <Route path="documents" element={<Documents />} />
          <Route path="security" element={<Securitie />} />

        <Route path="settings" element={<Notifications />} />
        {/* <Route path="onboarding-employee-list" element={<OnBordingEmployeeList />} /> */}
        {/* <Route path="pre-boarding" element={<PreBoarding />} /> */}
        {/* <Route path="interview" element={<Interview />} /> */}
        <Route path="manager-profile" element={<Profile />} />
      </Route>
     </Route>
    </Routes>
  );
};

export default MangerRoutes;
