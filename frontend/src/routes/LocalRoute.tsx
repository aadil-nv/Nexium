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
import SuperAdminLogin from "../components/superAdmin/superAdminLogin/superAdminLogin";
import PrivateRoute from "./PrivateRoute";

const LocalRoutes = () => {
  const routes = [
    { path: "/", element: <LandingPage /> },
    { path: "/superadmin-login", element: <SuperAdminLogin /> },
    { path: "/login", element: <LandingLoginPage /> },
    { path: "/signup", element: <LandingSignUpPage /> },
    { path: "/otp", element: <LandingOtp /> },
    { path: "/plans", element: <PlansPage /> },
    { path: "/verify-email", element: <LandingForgottEmail /> },
    { path: "/change-password", element: <LandingNewPasswordPage /> },
    { path: "/forgot-otp", element: <LandingForgottOtp /> },
  ];

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
      ))}
    </Routes>
  );
};

export default LocalRoutes;

