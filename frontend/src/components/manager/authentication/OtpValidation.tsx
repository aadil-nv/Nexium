import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd"; // Import Ant Design's Spin component
import { validateOtp, resendOtp } from "../../../api/managerApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store"; // Adjust path based on project structure
import { setTimer, decrementTimer } from "../../../redux/slices/otpSlice";
import { login, setManagerData } from "../../../redux/slices/managerSlice";
import axios,{ AxiosError } from "axios";


export default function OtpValidation() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = (useLocation().state as { email: string })?.email;

  const timer = useSelector((state: RootState) => state.otp.timer);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, dispatch]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };


  const handleOtpValidation = async () => {
      const otpString = otp.join("");
      if (!otpString) {
          setOtpError("OTP cannot be empty.");
          return;
      }
  
      setLoading(true);
      setOtpError(null);
  
      try {
          const response = await validateOtp(otpString, email);
          console.log("API Response: ", response);
  
          if (response?.success) {
              console.log("OTP validation successful. Navigating to dashboard...");
              dispatch(login({ role: "manager", isAuthenticated: true }));
              dispatch(setManagerData({
                        managerName: response.data.managerName,
                        managerProfilePicture: response.data.managerProfilePicture,
                        companyLogo: response.data.companyLogo,
                        companyName: response.data.companyName,
                        managerType: response.data.managerType,
                      }));
              navigate("/manager/dashboard");
          } else {
              console.error("OTP validation failed. Response: ", response);
              setOtpError(response?.message || "Invalid OTP. Please try again.");
          }
      } catch (error) {
          console.error("Error during OTP validation: ", error);
  
          if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string }>;
              setOtpError(axiosError.response?.data?.message || "Error validating OTP. Please try again.");
          } else {
              setOtpError("An unexpected error occurred. Please try again.");
          }
      } finally {
          setLoading(false);
      }
  };
  


  const handleResendOtp = async () => {
    if (timer > 0) return; // Prevent resending if timer is active

    setLoading(true);
    setOtpError(null);

    try {
      const response = await resendOtp(email);
      if (response.success) {
        dispatch(setTimer(90)); // Start the timer for 90 seconds
      } else {
        setOtpError("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setOtpError(error.message || "Error resending OTP. Please try again.");
      } else {
        // Fallback for unknown errors
        setOtpError("Error resending OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 bg-gray-100">
      <motion.div
        className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full md:w-3/5 p-6">
          <div className="py-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-500">Enter OTP</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto mt-2 mb-6"></div>
            </div>

            <div className="flex justify-center gap-3 mb-6 items-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl text-black border-2 border-gray-300 rounded-md focus:outline-none"
                />
              ))}
            </div>

            {otpError && <p className="text-red-500 text-center mb-4">{otpError}</p>}

            <div className="flex justify-center mb-6">
              <motion.button
                type="button"
                onClick={handleOtpValidation}
                className={`min-w-1 pt-2 border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? <Spin size="small" style={{ color: "green" }} /> : "Validate OTP"}
              </motion.button>
            </div>

            <div className="flex justify-center">
              <motion.div
                onClick={handleResendOtp}
                className={`pt-2 text-green-500 font-semibold cursor-pointer hover:text-green-700 transition-colors ${loading || timer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? <Spin size="small" style={{ color: "green" }} /> : timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          className="w-full md:w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-32 px-12 flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Hello, 👋 Manager</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          </div>
          <p className="text-center mb-6">Welcome back, Manager. Show your skill!</p>
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
