import  { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import images from "../../../images/images";
import { login, setManagerData } from "../../../redux/slices/managerSlice";
import { motion } from "framer-motion";
import { managerLogin } from "../../../api/managerApi";


// Types
interface LoginFormData {
  email: string;
  password: string;
}

interface ManagerData {
  managerName: string;
  managerProfilePicture: string;
  companyLogo: string;
  companyName: string;
  managerType: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  isVerified?: boolean;
  email?: string;
  data?: ManagerData;
}

export default function ManagerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>();
  const dispatch = useDispatch();

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setLoginError(null);

    try {
      const responseData = await managerLogin(data) as LoginResponse;

      if (!responseData.success) {
        if (responseData.message === "Invalid email or password" ||
            responseData.message === "Account is blocked. Please contact admin" ||
            responseData.message === "company is blocked. Please contact admin") {
          setLoginError(responseData.message);
          return;
        }

        if (!responseData.isVerified) {
          navigate("/manager-otpvalidation", { 
            state: { 
              email: responseData.email, 
              message: responseData.message 
            } 
          });
          return;
        }
      }

      if (responseData.data) {
        dispatch(login({ role: "manager", isAuthenticated: true }));
        dispatch(setManagerData({
          managerName: responseData.data.managerName,
          managerProfilePicture: responseData.data.managerProfilePicture,
          companyLogo: responseData.data.companyLogo,
          companyName: responseData.data.companyName,
          managerType: responseData.data.managerType,
        }));
        navigate("/manager/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setLoginError(axiosError.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.div
        className="bg-white shadow-lg rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Section (Login Form) */}
        <div className="w-full md:w-3/5 p-6 md:p-8">
          <div className="text-left font-bold">
            <img src={images.nexuimLogoWithName} alt="Logo" className="w-16 md:w-20 h-auto" />
          </div>
          <div className="py-6 md:py-10">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-green-600">Login to your account</h2>
              <div className="w-24 h-1 bg-green-600 mx-auto mt-4 mb-6"></div>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto">
              {/* Email Input */}
              <motion.div
                className={`bg-gray-50 w-full p-3 flex items-center rounded-lg border-2 transition-colors
                  ${errors.email ? "border-green-600" : isValid ? "border-green-600" : "border-gray-300"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaEnvelope className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-transparent outline-none text-sm flex-1 text-black"
                  {...register("email", { required: "Email is required" })}
                />
              </motion.div>
              {errors.email && <p className="text-green-600 text-xs self-start">{errors.email.message}</p>}

              {/* Password Input */}
              <motion.div
                className={`bg-gray-50 w-full p-3 flex items-center rounded-lg border-2 transition-colors relative
                  ${errors.password ? "border-green-600" : isValid ? "border-green-600" : "border-gray-300"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-transparent outline-none text-sm flex-1"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3"
                >
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </motion.div>
              {errors.password && <p className="text-green-600 text-xs self-start">{errors.password.message}</p>}

              {/* Login Error */}
              {loginError && <p className="text-red-600 text-sm text-center">{loginError}</p>}

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="relative w-full h-12  bg-green-600 text-white rounded-md px-12 py-2 font-semibold 
                          hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Right Section (Decoration) */}
        <motion.div
          className="w-full md:w-2/5 bg-green-600 text-white py-12 md:py-36 px-6 md:px-12 flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Hello, 👋 Admin</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          </div>
          <p className="mb-6 text-center">Welcome back Admin, show your skill</p>
          <a
            href="/"
            className="border-2 border-white rounded-full px-8 md:px-12 py-2 inline-block font-semibold
                     hover:bg-white hover:text-green-600 transition-colors"
          >
            Home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}