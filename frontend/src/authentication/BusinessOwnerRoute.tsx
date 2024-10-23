import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/BusinessOwner/BusinessOwnerPages/Dashboard";
import EmployeesList from "../components/businessOwner/BusinessOwnerPages/EmployeesList";
import AddEmployeesForm from "../components/businessOwner/BusinessOwnerPages/AddEmployeesForm";
import BusinessOwnerDashBoardLayout from "../pages/businessOwnerPages/DashboardLayout";
import Subscriptions from "../components/businessOwner/BusinessOwnerPages/Subscriptions";
import ServiceRequests from "../components/businessOwner/BusinessOwnerPages/ServiceRequests";



const BusinessOwnerRoutes = () => {
  return (
    <Routes>
      <Route element={<BusinessOwnerDashBoardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="workers" element={<EmployeesList />} />
        <Route path="addworkers" element={<AddEmployeesForm />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="service-requests" element={<ServiceRequests />} />
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
