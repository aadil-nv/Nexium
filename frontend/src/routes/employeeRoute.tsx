import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeePrivateRoute from "./employeePrivateRoute";
import DashBoardLayout from "../pages/employeePages/DashboardLayout";
import Dashboard from "../components/employees/Dashboard";
import Team from "../components/employees/Team";
import Profile from "../components/global/Profile";
import PersonalDetailes from "../components/global/PersonalDetailes";
import Address from "../components/global/Address";
import Documents from "../components/global/Documents";
import Securitie from "../components/global/Securitie";
import Notifications from "../components/global/Notifications";
import Payroll from "../components/employees/Payroll";
import Leaves from "../components/employees/Leaves";
import Announcements from "../components/global/Announcements";
import Attendance from "../components/global/Attendance";

const BusinessOwnerRoutes = () => {


    return (
      <Routes>
        <Route element={<EmployeePrivateRoute />}> 
          <Route element={<DashBoardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="team" element={<Team />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="profile" element={<Profile />} />
            <Route path="personaldetails" element={<PersonalDetailes  />} />
            <Route path="address" element={<Address />} />
            <Route path="documents" element={<Documents />} />
            <Route path="security" element={<Securitie />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="announcements" element={<Announcements />} />
            
          </Route>
        </Route>
      </Routes>
    );
  };
  
  export default BusinessOwnerRoutes;