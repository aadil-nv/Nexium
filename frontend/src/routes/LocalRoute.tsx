import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingSignUpPage from "../pages/landingPages/LandingSignUpPage";
import LandingOtp from "../pages/landingPages/LandingOtpPage";
import PlansPage from "../pages/landingPages/PlansPage";
import LandingForgottEmail from "../pages/landingPages/LandingForgottEmail";
import LandingNewPasswordPage from "../pages/landingPages/LandingNewPasswordPage";
import LandingForgottOtp from "../pages/landingPages/LandingForgottOtp";
import LandingLoginPage from "../pages/landingPages/LandingLoginPage";
import LandingPage from "../pages/landingPages/LandingPage";
<<<<<<< HEAD
import SuperAdminLogin from "../components/superAdmin/superAdminLogin/superAdminLogin";
import Table from "../components/global/Table";

const BusinessOwnerRoutes = () => {


  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/superadmin-login" element={<SuperAdminLogin />} />
=======
import SuperAdminLOgin from "../components/superAdmin/superAdminLogin/superAdminLogin";

const BusinessOwnerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/superadmin-login" element={<SuperAdminLOgin />} />
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
      <Route path="/login" element={<LandingLoginPage />} />
      <Route path="/signup" element={<LandingSignUpPage />} />
      <Route path="/otp" element={<LandingOtp />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/verify-email" element={<LandingForgottEmail />} />
      <Route path="/change-password" element={<LandingNewPasswordPage />} />
      <Route path="/forgot-otp" element={<LandingForgottOtp />} />
<<<<<<< HEAD
      
=======
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
    </Routes>
  );
};

export default BusinessOwnerRoutes;
