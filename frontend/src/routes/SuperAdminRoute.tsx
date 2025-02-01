
import { Route, Routes } from "react-router-dom";
import AdminDashBoard from "../components/superAdmin/AdminPages/AdminDashborad";
import BusinessOwnersList from "../components/superAdmin/AdminPages/BusinessOwnersList";
import AllPlans from "../components/superAdmin/AdminPages/AllPlans";
import DashBoardLayout from "../pages/superAdminPages/superAdminDashBoardLayout";
import ServiceSupport from "../components/superAdmin/AdminPages/ServiceSupport";
import Notifications from "../components/global/Notifications";
import SuperAdminPrivateRoute from "../routes/SuperAdminPrivateRoute"; // Import the private route
import Profile from "../components/global/Profile";
import Settings from "../components/global/Settings";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route element={<SuperAdminPrivateRoute> <DashBoardLayout /></SuperAdminPrivateRoute>}>
        <Route path="dashboard" element={<AdminDashBoard />} />
        <Route path="businessowners" element={<BusinessOwnersList />} />
        <Route path="plans" element={<AllPlans />} />
        <Route path="service-requests" element={<ServiceSupport />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;

