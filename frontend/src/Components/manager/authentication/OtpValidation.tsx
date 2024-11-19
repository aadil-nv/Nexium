import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom"; // Add react-router-dom for navigation
import images from "../../../images/images";
import { validateOtp } from "../../../api/managerApi"; // Adjust the import according to your project structure
import { login } from "../../../features/managerSlice";
import { useDispatch } from "react-redux";

export default function OtpValidation() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook to navigate
  const dispatch = useDispatch();
  const email = (useLocation().state as { email: string })?.email;

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    // Only allow digits
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input field when a digit is entered
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpDelete = (index: number) => {
    // If the value is deleted, move focus to the previous input
    if (index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpValidation = async () => {
    const otpString = otp.join(""); // Combine the OTP digits into a string
    if (!otpString) return;

    setLoading(true);
    setOtpError(null);

    try {
      const response = await validateOtp(otpString ,email);
      if (response.success) {
        // If OTP is valid, navigate to the manager's dashboard
        dispatch(login({ role: "manager", token: response.accessToken }));
        navigate("/manager/dashboard");
      } else {
        // If OTP validation fails, show an error message
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Error validating OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setLoading(true);
    setOtpError(null);
    // Simulate OTP resend logic
    setTimeout(() => {
      setLoading(false);
      // Resend OTP logic here (e.g., API call to resend OTP)
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <motion.div
        className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Section (OTP Entry) */}
        <div className="w-full md:w-3/5 p-5">
          <div className="text-left font-bold">
            <img src={images.nexuimLogoWithName} alt="Logo" className="w-20 h-auto" />
          </div>
          <div className="py-10">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-500">Enter OTP</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto mt-4 mb-4"></div>
            </div>

            <div className="flex justify-center gap-2 mb-4 items-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)} // Ensure this uses ChangeEvent
                  onInput={() => handleOtpDelete(index)} // Adjusted to use the correct function
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl text-black border-2 border-gray-300 rounded-md focus:outline-none"
                />
              ))}
            </div>

            {otpError && <p className="text-red-500 text-xs mb-2">{otpError}</p>}

            {/* Centered Validate OTP Button */}
            <div className="flex justify-center mb-4">
              <motion.button
                type="button"
                onClick={handleOtpValidation}
                className={`min-w-1 pt-2 border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                {loading ? "Validating..." : "Validate OTP"}
              </motion.button>
            </div>

            {/* Centered Resend OTP Text */}
            <div className="flex justify-center mb-4">
              <motion.div
                onClick={handleResendOtp}
                className={`pt-2 text-green-500 font-semibold cursor-pointer hover:text-green-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                {loading ? "Resending..." : "Resend OTP"}
              </motion.div>
            </div>
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
            <h2 className="text-3xl font-bold mb-2">Hello, 👋 Manager</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          </div>
          <p className="mb-4 text-center">Welcome back, Manager. Show your skill!</p>
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
