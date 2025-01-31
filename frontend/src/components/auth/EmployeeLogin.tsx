import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import image from "../../images/images";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, setEmployeeData } from "../../redux/slices/employeeSlice";
import { z } from "zod";
import { Spin } from "antd";
import { employeeInstance } from "../../services/employeeInstance";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const EmployeeLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs using Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      return;
    }

    setValidationError(""); // Clear validation errors
    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        "https://www.aadil.online/authentication-service/api/employee/employee-login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success === true) {
        dispatch(login({ role: "employee", isAuthenticated: true ,position: response.data.position, workTime: response.data.workTime,workTimer: response.data.workTimer }));
        dispatch(setEmployeeData({ 
          employeeName: response?.data?.employeeName,
           employeeProfilePicture: response?.data?.eployeeProfilePicture,
            companyLogo: response?.data?.companyLogo,
             employeeType: response?.data.employeePosition,
              companyName: response?.data.companyName }));

        await employeeInstance.post("/employee/api/attendance/update-attendance");
        
        navigate("/employee/dashboard");
      }
    } catch (err) {
      console.error("Error during login:", err);
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.data.success === false) {
          navigate("/employee-otpvalidation", { state: { email: err.response.data.email } });
        }
        setError(err.response.data.message || "An error occurred. Please try again.");
      } else {
        setError("An error occurred while logging in. Please try again later.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <div className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl">
        <div className="w-full md:w-3/5 p-5 md:px-16 sm:px-8">
          <div className="text-left font-bold mb-8">
            <img src={image.navBarLogo} alt="Logo" className="w-20 h-auto" />
          </div>
          <div className="py-6 text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-500">Employee Login</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 mb-4"></div>
            <form onSubmit={handleLogin} className="flex flex-col items-center w-full max-w-xs mx-auto">
              <div className="bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 border-gray-300">
                <FaEnvelope className="text-gray-400 m-2" />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-100 outline-none text-sm text-black flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 border-gray-300 relative">
                <FaLock className="text-gray-400 m-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-gray-100 outline-none text-sm text-black flex-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2"
                >
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </div>
              {validationError && <div className="text-red-500 text-sm mb-4">{validationError}</div>}
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              <button
                type="submit"
                className="w-full pt-2 border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 font-semibold flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : "Login"}
              </button>
            </form>
          </div>
        </div>
        <div className="w-full md:w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-16 sm:py-36 px-12 flex flex-col justify-center items-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Hello,👋Employee</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="mb-4 text-center text-sm sm:text-base">Welcome back, please log in to your account</p>
          <a href="/" className="border-2 border-white rounded-full px-12 py-2 font-semibold hover:bg-white hover:text-blue-500 transition-colors">
            Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
