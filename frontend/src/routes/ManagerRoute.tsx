import { Route, Routes } from "react-router-dom";
import DashBoardLayout from "../pages/mangerPages/DashboardLayout";
import Dashboard from "../components/manager/dashboard/Dashboard";
import Employees from "../components/manager/dashboard/Employees";
import Departments from "../components/manager/dashboard/Departments";
import Payroll from "../components/manager/dashboard/Payroll";
import Leaves from "../components/manager/dashboard/Leaves";
import Notifications from "../components/global/Notifications";
import ManagerPrivateRoute from "./ManagerPrivateRoute";
import Profile from "../components/global/Profile";
import PersonalDetailes from "../components/global/PersonalDetailes";
import Address from "../components/global/Address";
import Documents from "../components/global/Documents";
import Securitie from "../components/global/Securitie";
import Settings from "../components/global/Settings";
import LeaveSettings from "../components/manager/dashboard/LeaveSettings";
import Chat from "../components/chat/Chat";
import Meeting from "../components/meeting/Meeting";
import PreAppliedLeaves from "../components/manager/dashboard/PreAppliedLeaves";
import Projects from "../components/manager/dashboard/Projects";
import JoinMeeting from "../components/meeting/JoinMeeting";
import Dashboard404 from "../components/Error/Dashboard404";

const MangerRoutes = () => {

  return (
    <Routes>
     <Route element={<ManagerPrivateRoute />}>
      <Route element={<DashBoardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="departments" element={<Departments />} />
      
        <Route path="payroll-settings" element={<Payroll />} />
        <Route path="leave-settings" element={<LeaveSettings />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        

          <Route path="personaldetails" element={<PersonalDetailes  />} />
          <Route path="address" element={<Address />} />
          <Route path="documents" element={<Documents />} />
          <Route path="security" element={<Securitie />} />
          <Route path="chat" element={<Chat />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="pre-applied-leaves" element={<PreAppliedLeaves />} />
          <Route path="projects" element={<Projects />} />

          <Route path="join-meeting" element={<JoinMeeting />} />

        <Route path="settings" element={<Notifications />} />
        <Route path="manager-profile" element={<Profile />} />
        <Route path="*" element={<Dashboard404 />} />  
      </Route>
     </Route>
    </Routes>
  );
};

export default MangerRoutes;
