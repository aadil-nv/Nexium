import React from "react";
import { Route, Routes } from "react-router-dom";
import BusinessOwnerPrivateRoute from "./BusinessOwnerPrivateRoute"; // Adjust the import path based on your project structure
import BusinessOwnerDashboard from "../components/businessOwner/BusinessOwnerPages/Dashboard";

import BusinessOwnerDashBoardLayout from "../pages/businessOwnerPages/DashboardLayout";
import Subscriptions from "../components/businessOwner/BusinessOwnerPages/Subscriptions";
import ServiceRequests from "../components/businessOwner/BusinessOwnerPages/ServiceRequests";
import EmployeeList from "../components/businessOwner/businessOwnerPages/EmployeeList";
import Notifications from "../components/global/Notifications";
import Announcements from "../components/global/Announcements";
import DemoTable from "../components/businessOwner/businessOwnerPages/DemoTable";
import Profile from "../components/global/Profile";
import PersonalDetailes from "../components/global/PersonalDetailes";
import Address from "../components/global/Address";
import Documents from "../components/global/Documents";
import Securitie from "../components/global/Securitie";

const BusinessOwnerRoutes = () => {


  return (
    <Routes>
      <Route element={<BusinessOwnerPrivateRoute />}> 
        <Route element={<BusinessOwnerDashBoardLayout />}>
          <Route path="dashboard" element={<BusinessOwnerDashboard />} />
          <Route path="employees"element={<EmployeeList />}/>
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="service-requests" element={<ServiceRequests />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="demo" element={<DemoTable />} />
          <Route path="profile" element={<Profile />} />
          <Route path="personaldetails" element={<PersonalDetailes  />} />
          <Route path="address" element={<Address />} />
          <Route path="documents" element={<Documents />} />
          <Route path="security" element={<Securitie />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
