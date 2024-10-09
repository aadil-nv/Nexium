import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './Pages/AdminDashBoard/AdminDashBoard';
import LandingPage from './Pages/LandingPage/LandingPage';
import LandingLoginPage from './Pages/LandingPage/LandingLoginPage';
import SignUp from './Pages/LandingPage/LandingSignUpPage';
import AdminDashBoard from './Components/AdminDashboard/AdminPages/AdminDashborad';
import CompaniesList from './Components/AdminDashboard/AdminPages/CompaniesList';
import AllPlans from './Components/AdminDashboard/AdminPages/AllPlans';
import Finance from './Components/AdminDashboard/AdminPages/Finance';
import Users from './Components/AdminDashboard/AdminPages/Users';
import Inventorys from './Components/AdminDashboard/AdminPages/Inventorys';
import ServiceRequests from './Components/AdminDashboard/AdminPages/ServiceRequests';
import AdminLoginPage from './Pages/AdminDashBoard/AdminLoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingLoginPage />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes (with AdminLayout) */}
        <Route element={<AdminLayout />}>
          <Route path="/super-admin/dashboard" element={<AdminDashBoard />} />
          <Route path="/super-admin/companies" element={<CompaniesList />} />
          <Route path="/super-admin/plans" element={<AllPlans />} />
          <Route path="/super-admin/services" element={<ServiceRequests />} />
          <Route path="/super-admin/users" element={<Users />} />
          <Route path="/super-admin/inventory" element={<Inventorys />} />
          <Route path="/super-admin/finance" element={<Finance />} />
        </Route>

        <Route path='/super-admin/login' element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
