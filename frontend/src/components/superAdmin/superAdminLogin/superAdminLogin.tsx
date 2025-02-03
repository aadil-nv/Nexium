import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../../config/validationSchema";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/slices/superAdminSlice";
import { loginSuperAdmin } from "../../../api/superAdminApi";
import { IFormInputs } from "../../../interface/superAdminInterface";
import { AxiosError } from "axios";
import nabarLogo from "../../../assets/landingPageAssets/NavbarLogo.png"


const SuperAdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<IFormInputs>({ resolver: zodResolver(loginSchema) });
  const dispatch = useDispatch();

  const handleLogin = async (data: IFormInputs) => {
    setLoading(true);
    setLoginError(null);
    try {
       await loginSuperAdmin(data);
      dispatch(login({ role: "superAdmin", isAuthenticated: true }));
      navigate("/super-admin/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        setLoginError(error.response?.data?.message || "Login failed. Please check your credentials.");
      } else if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <div className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl">
        <div className="w-full md:w-3/5 p-5">
          <div className="text-left font-bold">
            <img src={nabarLogo} alt="Logo" className="w-20 h-auto" />
          </div>
          <div className="py-10 text-center">
            <h2 className="text-4xl font-bold text-blue-500">Login to your account</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 mb-4"></div>
            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col items-center w-full max-w-xs ml-20">
              <div className={`bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 ${errors.email ? "border-red-500" : isValid ? "border-green-500" : "border-gray-300"}`}>
                <FaEnvelope className="text-gray-400 m-2" />
                <input type="email" placeholder="Email" className="bg-gray-100 outline-none text-sm text-black flex-1" {...register("email")} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email.message}</p>}
              <div className={`bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 relative ${errors.password ? "border-red-500" : isValid ? "border-green-500" : "border-gray-300"}`}>
                <FaLock className="text-gray-400 m-2" />
                <input type={showPassword ? "text" : "password"} placeholder="Password" className="bg-gray-100 outline-none text-sm text-black flex-1" {...register("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2">
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password.message}</p>}
              {loginError && <p className="text-red-500 text-xs mb-2">{loginError}</p>}
              <button type="submit" className={`w-full pt-2 border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
        <div className="w-full md:w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-2">Hello, 👋 Admin</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="mb-4 text-center">Welcome back Admin, show your skill</p>
          <a href="/" className="border-2 border-white rounded-full px-12 py-2 font-semibold hover:bg-white hover:text-blue-500 transition-colors">Home</a>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
