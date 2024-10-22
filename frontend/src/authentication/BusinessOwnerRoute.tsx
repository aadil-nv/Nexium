import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/BusinessOwner/BusinessOwnerPages/Dashboard";
import Workers from "../components/BusinessOwner/BusinessOwnerPages/Workers";
import AddWorkersForm from "../components/BusinessOwner/BusinessOwnerPages/AddWorkersForm";
import BusinessOwnerDashBoardLayout from "../pages/businessOwnerPages/CompanyDashBoard";


const BusinessOwnerRoutes = () => {
  return (
    <Routes>
      <Route element={<BusinessOwnerDashBoardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="workers" element={<Workers />} />
        <Route path="addworkers" element={<AddWorkersForm />} />
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
