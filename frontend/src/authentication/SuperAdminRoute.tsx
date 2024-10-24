import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashBoard from "../components/superAdmin/AdminPages/AdminDashborad";
import CompaniesList from "../components/superAdmin/AdminPages/CompaniesList";
import AllPlans from "../components/superAdmin/AdminPages/AllPlans";
import DashBoardLayout from "../pages/superAdminPages/superAdminDashBoardLayout";
import CustomerCare from "../components/superAdmin/AdminPages/CustomerCare";
import Announcements from "../components/global/Announcements";
import Notifications from "../components/global/Notifications";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route element={<DashBoardLayout />}>
        <Route path="dashboard" element={<AdminDashBoard />} />
        <Route path="companies" element={<CompaniesList />} />
        <Route path="plans" element={<AllPlans />} />
        <Route path="service-requests" element={<CustomerCare />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
