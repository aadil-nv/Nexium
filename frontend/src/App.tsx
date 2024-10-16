import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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
import LandingOtp from './Pages/LandingPage/LandingOtpPage';
import PlansPage from './Pages/LandingPage/PlansPage';
import CompanyLayout from './Pages/OwnerDashboard/CompanyLayout';
import Workers from './Components/BusinessOwner/BusinessOwnerPages/Workers';
import { useSelector } from 'react-redux';
import Dashboard from './Components/BusinessOwner/BusinessOwnerPages/Dashboard';
import AddWorkersForm from './Components/BusinessOwner/BusinessOwnerPages/AddWorkersForm';

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
