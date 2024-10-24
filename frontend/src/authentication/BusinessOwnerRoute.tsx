import React from "react";
import { Route, Routes } from "react-router-dom";
import BusinessOwnerDashboard from "../components/businessOwner/BusinessOwnerPages/Dashboard";
import EmployeesList from "../components/businessOwner/BusinessOwnerPages/EmployeesList";
import AddEmployeesForm from "../components/businessOwner/BusinessOwnerPages/AddEmployeesForm";
import BusinessOwnerDashBoardLayout from "../pages/businessOwnerPages/DashboardLayout";
import Subscriptions from "../components/businessOwner/BusinessOwnerPages/Subscriptions";
import ServiceRequests from "../components/businessOwner/BusinessOwnerPages/ServiceRequests";
import Employees from "../components/businessOwner/BusinessOwnerPages/Employees";
import Notifications from "../components/global/Notifications";
import Announcements from "../components/global/Announcements";



const BusinessOwnerRoutes = () => {
  return (
    <Routes>
      <Route element={<BusinessOwnerDashBoardLayout />}>
        <Route path="dashboard" element={<BusinessOwnerDashboard />} />
        <Route path="workers" element={<Employees />} />
        <Route path="addworkers" element={<AddEmployeesForm />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="service-requests" element={<ServiceRequests />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
