import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, setEmployeeData } from "../../redux/slices/employeeSlice";
import { z } from "zod";
import { employeeLogin } from "../../api/authApi";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const EmployeeLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    validation?: string;
    server?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
  
    // Validate inputs using Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors({ validation: result.error.errors[0].message });
      return;
    }
  
    setLoading(true);
  
    try {
      const data = await employeeLogin(email, password);
  
      if (!data.success) {
        setErrors({ server: data.message || "Invalid email or password. Please try again." });
        return;
      }
  
      if (data.isVerified === false && !data.isBlocked && !data.isBusinessOwnerBlocked) {
        navigate("/employee-otpvalidation", { state: { email: data.email } });
        return;
      }
  
      if (data.isBlocked) {
        setErrors({ server: "Your account is blocked. Please contact support." });
        return;
      }
  
      if (data.isBusinessOwnerBlocked) {
        setErrors({ server: "Company is blocked. Please contact admin." });
        return;
      }
  
      dispatch(
        login({
          role: "employee",
          isAuthenticated: true,
          position: data.position,
          workTime: data.workTime,
          workTimer: data.workTimer,
        })
      );
  
      dispatch(
        setEmployeeData({
          employeeName: data.employeeName,
          employeeProfilePicture: data.employeeProfilePicture,
          companyLogo: data.companyLogo,
          employeeType: data.employeePosition,
          companyName: data.companyName,
        })
      );
  
      navigate("/employee/dashboard");
  
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="w-full md:w-3/5 p-6 md:p-12">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-500">
              Employee Login
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-3"></div>
          </div>

          <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-6">
            <div className="relative">
              <div className="bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center p-3">
                <FaEnvelope className="text-gray-400 mx-2" />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-100 w-full outline-none text-sm text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center p-3">
                <FaLock className="text-gray-400 mx-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-gray-100 w-full outline-none text-sm text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Messages */}
            {(errors.validation || errors.server) && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {errors.validation || errors.server}
                    </p>
                  </div>
                </div>
              </div>
            )}

             <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-blue-500 text-white rounded-full font-semibold
                transition-all duration-200`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/5 bg-blue-500 text-white p-8 flex flex-col justify-center items-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Hello, 👋 Employee</h2>
          <div className="w-20 h-1 bg-white mb-6"></div>
          <p className="text-center text-sm md:text-base mb-8">
            Welcome back, please log in to your account
          </p>
          <a
            href="/"
            className="border-2 border-white rounded-full px-8 py-2 font-semibold
              transition-colors duration-200 hover:bg-white hover:text-blue-500"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;