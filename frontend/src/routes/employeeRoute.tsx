import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeePrivateRoute from "./employeePrivateRoute";
import DashBoardLayout from "../pages/employeePages/DashboardLayout";
import Dashboard from "../components/employees/Dashboard";

const BusinessOwnerRoutes = () => {


    return (
      <Routes>
        <Route element={<EmployeePrivateRoute />}> 
          <Route element={<DashBoardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            
          </Route>
        </Route>
      </Routes>
    );
  };
  
  export default BusinessOwnerRoutes;