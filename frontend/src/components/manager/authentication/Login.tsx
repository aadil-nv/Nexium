import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../../config/validationSchema"; // Import Zod schema
import { useDispatch } from "react-redux";
import images from "../../../images/images";
import { login ,setManagerData } from "../../../redux/slices/managerSlice";
import { motion } from "framer-motion";
import { LoginFormData } from "../../../utils/interfaces";
import { managerLogin } from "../../../api/managerApi";

export default function ManagerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const dispatch = useDispatch();

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setLoginError(null);

    try {
      const responseData = await managerLogin(data);
      console.log("responseData of manager is 1111111111", responseData);
      
      if(responseData.success === false && responseData.message == "Account is blocked. Please contact admin") {
        setLoginError(responseData.message);
        return
      }
   
      if (responseData.success === false &&  responseData.isVerified === false) {
        navigate("/manager-otpvalidation", { state: { email: responseData.email, message: responseData.message } });
        return;
      }

      // If verified, proceed to dashboard
      dispatch(login({ role: "manager", isAuthenticated: true }));
      dispatch(setManagerData({
        managerName: responseData.data.managerName,
        managerProfilePicture: responseData.data.managerProfilePicture,
        companyLogo: responseData.data.companyLogo,
        companyName: responseData.data.companyName,
        managerType: responseData.data.managerType,}));
            navigate("/manager/dashboard");
      setLoginError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 py-2">
      <motion.div
        className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Section (Login Form) */}
        <div className="w-full md:w-3/5 p-5">
          <div className="text-left font-bold">
            <img src={images.nexuimLogoWithName} alt="Logo" className="w-20 h-auto" />
          </div>
          <div className="py-10">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-500">Login to your account</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto mt-4 mb-4"></div>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col items-center w-full max-w-xs ml-20">
              {/* Email Input */}
              <motion.div
                className={`bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2
                  ${errors.email ? "border-green-500" : isValid ? "border-green-500" : "border-gray-300"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaEnvelope className="text-gray-400 m-2" />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-100 outline-none text-sm text-black flex-1"
                  {...register("email")}
                />
              </motion.div>
              {errors.email && <p className="text-green-500 text-xs mb-2">{errors.email.message}</p>}

              {/* Password Input */}
              <motion.div
                className={`bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 relative
                  ${errors.password ? "border-green-500" : isValid ? "border-green-500" : "border-gray-300"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
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
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </motion.div>
              {errors.password && <p className="text-green-500 text-xs mb-2">{errors.password.message}</p>}

              {/* Login Error */}
              {loginError && <p className="text-green-500 text-xs mb-2">{loginError}</p>}

              {/* Submit Button */}
              <motion.button
                type="submit"
                className={`w-full pt-2 border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white transition-colors
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Right Section (Decoration) */}
        <motion.div
          className="w-full md:w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12 flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Hello, 👋 Admin</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          </div>
          <p className="mb-4 text-center">Welcome back Admin, show your skill</p>
          <a
            href="/"
            className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500 transition-colors"
          >
            Home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
