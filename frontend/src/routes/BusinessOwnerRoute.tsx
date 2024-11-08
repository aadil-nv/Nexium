import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoutes"; // Adjust the import path based on your project structure
import BusinessOwnerDashboard from "../components/businessOwner/BusinessOwnerPages/Dashboard";
import AddEmployeesForm from "../components/businessOwner/BusinessOwnerPages/AddEmployeesForm";
import BusinessOwnerDashBoardLayout from "../pages/businessOwnerPages/DashboardLayout";
import Subscriptions from "../components/businessOwner/BusinessOwnerPages/Subscriptions";
import ServiceRequests from "../components/businessOwner/BusinessOwnerPages/ServiceRequests";
import EmployeeList from "../components/businessOwner/businessOwnerPages/EmployeeList";
import Notifications from "../components/global/Notifications";
import Announcements from "../components/global/Announcements";
import Table from "../components/global/Table";
import DemoTable from "../components/businessOwner/businessOwnerPages/DemoTable";

const BusinessOwnerRoutes = () => {


  return (
    <Routes>
      <Route element={<PrivateRoute />}> {/* Add PrivateRoute here */}
        <Route element={<BusinessOwnerDashBoardLayout />}>
          <Route path="dashboard" element={<BusinessOwnerDashboard />} />
          <Route path="employees"element={<EmployeeList />}/>
          <Route path="addworkers" element={<AddEmployeesForm />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="service-requests" element={<ServiceRequests />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="demo" element={<DemoTable />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
