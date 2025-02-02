import { Route, Routes } from "react-router-dom";
import BusinessOwnerPrivateRoute from "./BusinessOwnerPrivateRoute"; // Adjust the import path based on your project structure
import BusinessOwnerDashboard from "../components/businessOwner/businessOwnerPages/BusinessOwnerDashboard";

import BusinessOwnerDashBoardLayout from "../pages/businessOwnerPages/DashboardLayout";
import Subscriptions from "../components/businessOwner/businessOwnerPages/Subscriptions";
import ServiceRequests from "../components/global/ServiceRequests";
import EmployeeList from "../components/businessOwner/businessOwnerPages/EmployeeList";
import Notifications from "../components/global/Notifications";
import DemoTable from "../components/businessOwner/businessOwnerPages/InvoiseTable";
import Profile from "../components/global/Profile";
import PersonalDetailes from "../components/global/PersonalDetailes";
import Address from "../components/global/Address";
import Documents from "../components/global/Documents";
import Securitie from "../components/global/Securitie";
import SuccessPage from "../components/ui/SuccessPage";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Settings from "../components/global/Settings";
import Chat from "../components/chat/Chat";
import MeetingScheduler from "../components/meeting/Meeting";
import JoinMeeting from "../components/meeting/JoinMeeting";

const BusinessOwnerRoutes = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Function to close the success page and redirect or perform an action
  const handleSuccessClose = () => {
    navigate("/business-owner/subscriptions"); // Redirect to dashboard or another route
  };

  return (
    <Routes>
      <Route element={<BusinessOwnerPrivateRoute />}>
        <Route element={<BusinessOwnerDashBoardLayout />}>
          <Route path="dashboard" element={<BusinessOwnerDashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="service-requests" element={<ServiceRequests />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="demo" element={<DemoTable />} />
          <Route path="profile" element={<Profile />} />
          <Route path="personaldetails" element={<PersonalDetailes />} />
          <Route path="address" element={<Address />} />
          <Route path="documents" element={<Documents />} />
          <Route path="security" element={<Securitie />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chat" element={<Chat />} />
          <Route path="meeting" element={<MeetingScheduler />} />
          <Route path="join-meeting" element={<JoinMeeting />} />          
          <Route path="success"element={<SuccessPage message="Success" onClose={handleSuccessClose} />}/>
        </Route>
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
