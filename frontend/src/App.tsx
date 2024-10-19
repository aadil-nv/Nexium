import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SuperAdminRoutes from './authentication/SuperAdminRoute';
import BusinessOwnerRoutes from './authentication/BusinessOwnerRoute';
import LandingPage from './pages/landingPages/LandingPage'; // Import your landing page
import LandingLoginPage from './pages/landingPages/LandingLoginPage';
import LandingSignUpPage from './pages/landingPages/LandingSignUpPage';
import LandingOtp from './pages/landingPages/LandingOtpPage';
import PlansPage from './pages/landingPages/PlansPage';
import LandingForgottEmail from './pages/landingPages/LandingForgottEmail';
import LandingNewPasswordPage from './pages/landingPages/LandingNewPasswordPage';
import LandingForgottOtp from './pages/landingPages/LandingForgottOtp';

export default function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingLoginPage />} />
        <Route path="/signup" element={<LandingSignUpPage />} />
        <Route path="/otp" element={<LandingOtp />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/verify-email" element={<LandingForgottEmail />} />
        <Route path="/change-password" element={<LandingNewPasswordPage />} />
        <Route path="/forgot-otp" element={<LandingForgottOtp />} />

        {/* Business Owner Routes */}
        <Route path="/business-owner/*" element={<BusinessOwnerRoutes />} />

        {/* Super Admin Routes */}
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />

        {/* Redirect any unmatched route to the landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
