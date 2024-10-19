import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../components/BusinessOwner/BusinessOwnerPages/Dashboard';
import CompaniesList from '../components/superAdmin/AdminPages/CompaniesList'; // This should be removed if it's not for Business Owner
import AllPlans from '../components/superAdmin/AdminPages/AllPlans'; // This should be removed if it's not for Business Owner
import Finance from '../components/superAdmin/AdminPages/Finance'; // This should be removed if it's not for Business Owner
import ServiceRequests from '../components/superAdmin/AdminPages/ServiceRequests'; // This should be removed if it's not for Business Owner
import Workers from '../components/BusinessOwner/BusinessOwnerPages/Workers';
import AddWorkersForm from '../components/BusinessOwner/BusinessOwnerPages/AddWorkersForm';
 // Ensure this component exists
import LandingForgottEmail from '../pages/landingPages/LandingForgottEmail';
import LandingNewPasswordPage from '../pages/landingPages/LandingNewPasswordPage';
import LandingForgottOtp from '../pages/landingPages/LandingForgottOtp';
import LandingLoginPage from '../pages/landingPages/LandingLoginPage';
import SignUp from '../pages/landingPages/LandingSignUpPage';
import LandingOtp from '../pages/landingPages/LandingOtpPage';
import PlansPage from '../pages/landingPages/PlansPage';
import BusinessOwnerDashBoardLayout from '../pages/businessOwnerPages/CompanyLayout';

const BusinessOwnerRoutes = () => {
  return (
    <Routes>

      <Route element={<BusinessOwnerDashBoardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/business-owner/workers" element={<Workers />} />
        <Route path="/business-owner/addworkers" element={<AddWorkersForm />} />
        
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
