import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashBoard from "../components/superAdmin/AdminPages/AdminDashborad";
import CompaniesList from "../components/superAdmin/AdminPages/CompaniesList";
import AllPlans from "../components/superAdmin/AdminPages/AllPlans";
import Finance from "../components/superAdmin/AdminPages/Finance";
import Users from "../components/superAdmin/AdminPages/Users";
import Inventorys from "../components/superAdmin/AdminPages/Inventorys";
import ServiceRequests from "../components/superAdmin/AdminPages/ServiceRequests";
import AdminLoginPage from "../pages/superAdminPages/AdminLoginPage";
import AdminDashBoardLayout from "../pages/superAdminPages/AdminDashBoard";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminDashBoardLayout />}>
        <Route path="dashboard" element={<AdminDashBoard />} />
        <Route path="companies" element={<CompaniesList />} />
        <Route path="plans" element={<AllPlans />} />
        <Route path="services" element={<ServiceRequests />} />
        <Route path="users" element={<Users />} />
        <Route path="inventory" element={<Inventorys />} />
        <Route path="finance" element={<Finance />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
