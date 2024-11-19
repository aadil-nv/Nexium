import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../../config/validationSchema"; // Import Zod schema
import { useDispatch } from "react-redux";
import axios from "axios";
import images from "../../../images/images"
import { login   } from "../../../features/superAdminSlice";
import {privateApi} from "../../../services/axiosConfig"
import useAuth from "../../../hooks/useAuth";
// import { RESET_STORE } from '../../../store/resetAction';

// Somewhere in your application



// Define Form Inputs based on the Zod schema
interface FormInputs {
  email: string;
  password: string;
}

export default function superAdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {register, handleSubmit,formState: { errors, isValid },} = useForm<FormInputs>({resolver: zodResolver(loginSchema),});
  const dispatch = useDispatch();
  const {businessOwner,superAdmin}=useAuth()
  // dispatch({ type: RESET_STORE });

  console.log("businessOwner",businessOwner.isAuthenticated);
  console.log("superAdmin",superAdmin.isAuthenticated);
  
  

  const handleLogin = async (data: FormInputs) => {
    setLoading(true);
    setLoginError(null);

    try {
      const response = await axios.post(
        "http://localhost:7000/api/super-admin/superadmin-login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
          
        }
      );

      const responseData = response.data;
      console.log("responseData", responseData);
      
      dispatch(login({
        role:"superAdmin",
        token: responseData.accessToken,
      }));
      // localStorage.setItem("adminToken", responseData.accessToken);
      navigate("/super-admin/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setLoginError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <div className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl">
       
        <div className="w-full md:w-3/5 p-5">
          <div className="text-left font-bold">
            <img src={images.nexuimLogoWithName} alt="Logo" className="w-20 h-auto" />
          </div>
          <div className="py-10">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-blue-500">
                Login to your account
              </h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 mb-4"></div>
            </div>

            <div className="flex flex-col items-center">
              <form
                onSubmit={handleSubmit(handleLogin)}
                className="flex flex-col items-center w-full max-w-xs"
              >
                
                <div
                  className={`bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 
                ${
                  errors.email
                    ? "border-red-500"
                    : isValid
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                >
                  <FaEnvelope className="text-gray-400 m-2" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="bg-gray-100 outline-none text-sm text-black flex-1"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mb-2">
                    {errors.email.message}
                  </p>
                )}{" "}
                {/* Show error */}
                <div
                  className={`bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 relative 
                ${
                  errors.password
                    ? "border-red-500"
                    : isValid
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                >
                  <FaLock className="text-gray-400 m-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="bg-gray-100 outline-none text-sm text-black flex-1"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mb-2">
                    {errors.password.message}
                  </p>
                )}{" "}
                {/* Show error */}
                {/* Show login error */}
                {loginError && (
                  <p className="text-red-500 text-xs mb-2">{loginError}</p>
                )}
                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full pt-2 border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-500 hover:text-white transition-colors
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right section (Decoration) */}
        <div className="w-full md:w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12 flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Hello, 👋 Admin</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          </div>
          <p className="mb-4 text-center">
            Welcome back Admin, show your skill
          </p>

          <a
            href="/"
            className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-500 transition-colors"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}