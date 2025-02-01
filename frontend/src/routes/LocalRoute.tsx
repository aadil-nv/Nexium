import { Route, Routes } from "react-router-dom";
import LandingSignUpPage from "../pages/landingPages/LandingSignUpPage";
import LandingOtp from "../pages/landingPages/LandingOtpPage";
import PlansPage from "../pages/landingPages/PlansPage";
import LandingForgottEmail from "../pages/landingPages/LandingForgottEmail";
import LandingLoginPage from "../pages/landingPages/LandingLoginPage";
import LandingPage from "../pages/landingPages/LandingPage";
import SuperAdminLogin from "../components/superAdmin/superAdminLogin/superAdminLogin";
import PrivateRoute from "./PrivateRoute";
import Login from "../components/manager/authentication/Login";
import  OtpValidation from "../components/manager/authentication/OtpValidation";
import EmployeeLogin from "../components/auth/EmployeeLogin";
import EmployeeOtp from "../components/auth/EmployeeeOtp";
import LandingAboutPage from "../pages/landingPages/LandingAboutPage";

const LocalRoutes = () => {
  const routes = [
    { path: "/", element: <LandingPage /> },
    { path: "/superadmin-login", element: <SuperAdminLogin /> },
    { path: "/login", element: <LandingLoginPage /> },
    { path: "/signup", element: <LandingSignUpPage /> },
    { path: "/otp", element: <LandingOtp /> },
    { path: "/plans", element: <PlansPage /> },
    { path: "/verify-email", element: <LandingForgottEmail /> },
    { path: "/manager-login", element: <Login /> },
    { path: "/manager-otpvalidation", element: <OtpValidation /> },
    { path: "/employee-login", element: <EmployeeLogin /> },
    { path: "/employee-otpvalidation", element: <EmployeeOtp /> },
    { path: "/about", element: <LandingAboutPage /> },




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

