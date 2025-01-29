import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../landingPage/theme-provider';

interface VerifyEmailProps {
  otp?: string[];
  handleOtpChange?: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleOtpKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  otpError?: string | null;
  handleOtpSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  isTimerActive?: boolean;
  formatTimeLeft?: () => string;
  handleResendOtp?: () => void;
  setShowOtpVerification?: (show: boolean) => void;
  setShowForgotPassword?: (show: boolean) => void;
  forgotPasswordEmail?: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({
  otp = ['', '', '', '', '', ''],
  handleOtpChange = () => {},
  handleOtpKeyDown = () => {},
  otpError = null,
  handleOtpSubmit = (e) => e.preventDefault(),
  isTimerActive = false,
  formatTimeLeft = () => '00:00',
  handleResendOtp = () => {},
  setShowOtpVerification = () => {},
  setShowForgotPassword = () => {},
  forgotPasswordEmail = ''
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-10">
        <h2 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Enter OTP
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Please enter the verification code sent to {forgotPasswordEmail}
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              className={`w-12 h-12 text-center text-2xl rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {otpError && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {otpError}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 transform hover:scale-[1.02]"
        >
          Verify OTP
        </button>

        <div className="text-center">
          {isTimerActive ? (
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Resend OTP in {formatTimeLeft()}
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setShowOtpVerification(false);
              setShowForgotPassword(true);
            }}
            className="flex items-center justify-center mx-auto text-blue-500 hover:text-blue-600"
          >
            <FaArrowLeft className="mr-2" />
            Back to Forgot Password
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default VerifyEmail;