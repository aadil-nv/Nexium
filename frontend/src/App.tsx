import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import AdminLayout from './Pages/superAdminPages/AdminDashBoard';
import LandingPage from './Pages/landingPages/LandingPage';
import LandingLoginPage from './Pages/landingPages/LandingLoginPage';
import SignUp from './Pages/landingPages/LandingSignUpPage';
import AdminDashBoard from './components/superAdmin/AdminPages/AdminDashborad';
import CompaniesList from './components/superAdmin/AdminPages/CompaniesList';
import AllPlans from './components/superAdmin/AdminPages/AllPlans';
import Finance from './components/superAdmin/AdminPages/Finance';
import Users from './components/superAdmin/AdminPages/Users';
import Inventorys from './components/superAdmin/AdminPages/Inventorys';
import ServiceRequests from './components/superAdmin/AdminPages/ServiceRequests';
import AdminLoginPage from './Pages/superAdminPages/AdminLoginPage';
import LandingOtp from './Pages/landingPages/LandingOtpPage';
import PlansPage from './Pages/landingPages/PlansPage';
import CompanyLayout from './Pages/businessOwnerPages/CompanyLayout';
import Workers from './components/BusinessOwner/BusinessOwnerPages/Workers';
import { useSelector } from 'react-redux';
import Dashboard from './components/BusinessOwner/BusinessOwnerPages/Dashboard';
import AddWorkersForm from './components/BusinessOwner/BusinessOwnerPages/AddWorkersForm';

// Load your Stripe public key
const stripePromise = loadStripe('your-publishable-key-here'); // Replace with your actual Stripe public key

// Mock function to get user role (You can replace this with actual logic)
const getUserRole = () => {
  // Assume you fetch this from an API or context provider
  return localStorage.getItem("userRole") || "superAdmin"; // or "businessOwner"
};

function App() {
  const userRole = useSelector((state: { menu: { userRole: string} }) => state.menu.userRole);

  return (
    
      <Router>
        <Routes>
          {/* Landing Page Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingLoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<LandingOtp />} />
          <Route path="/plans" element={<PlansPage />} />

          {/* Admin or BusinessOwner Routes */}
          {userRole === "super-admin" ? (
            <Route element={<AdminLayout />}>
              <Route path="/super-admin/dashboard" element={<AdminDashBoard />} />
              <Route path="/super-admin/companies" element={<CompaniesList />} />
              <Route path="/super-admin/plans" element={<AllPlans />} />
              <Route path="/super-admin/services" element={<ServiceRequests />} />
              <Route path="/super-admin/users" element={<Workers />} />
              <Route path="/super-admin/inventory" element={<Inventorys />} />
              <Route path="/super-admin/finance" element={<Finance />} />
            </Route>
          ) : userRole === "businessOwner" ? (
            <Route element={<CompanyLayout />}>
              <Route path="/businessOwner/dashboard" element={<Dashboard />} />
              <Route path="/businessOwner/companies" element={<CompaniesList />} />
              <Route path="/businessOwner/plans" element={<AllPlans />} />
              <Route path="/businessOwner/services" element={<ServiceRequests />} />
              <Route path="/businessOwner/workers" element={<Workers />} />
              <Route path="/businessOwner/inventory" element={<Inventorys />} />
              <Route path="/businessOwner/finance" element={<Finance />} />
              <Route path="/businessOwner/addworkers" element={<AddWorkersForm />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}

          {/* Admin Login Page */}
          <Route path="/super-admin/login" element={<AdminLoginPage />} />
        </Routes>
      </Router>
   
  );
}

export default App;
