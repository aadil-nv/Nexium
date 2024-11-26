import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../landingPage/theme-provider';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resendOtp, validateOtp } from '../../../api/authApi';

type LocationState = { email: string };

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
);

const ForgotOtp: React.FC = () => {
  const { theme } = useTheme();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { state } = useLocation();
  const email = (state as LocationState)?.email;
  const navigate = useNavigate();

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    setIsTimerActive(false);
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => timeLeft > 0 && e.preventDefault();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleResendOtp = async () => {
    setTimeLeft(90);
    setIsTimerActive(true);
    setOtp(Array(6).fill(''));
    setErrorMessage('');

    try {
      const data = await resendOtp(email);
      toast[data.success ? 'success' : 'error'](data.message || 'Failed to resend OTP');
    } catch (error) {
      toast.error('Error resending OTP. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join('');

    try {
      const data = await validateOtp(email, otpString);
      if (data.success) {
        navigate('/change-password', { state: { email: data.email } });
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Invalid OTP');
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setErrorMessage('Error verifying OTP. Please try again.');
      toast.error('Error verifying OTP. Please try again.');
    }
  };

  const formatTimeLeft = () => `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;

  return (
    <div className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Suspense fallback={<LoadingSpinner />}>
        <motion.div className={`p-8 rounded-lg w-[90%] max-w-2xl shadow-lg ${theme === 'dark' ? 'bg-black-800' : 'bg-white'}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Enter OTP</h2>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-12 h-12 mx-1 text-center text-2xl border rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg mb-4">Verify OTP</button>

            {isTimerActive ? (
              <p className="text-center text-sm">Resend OTP in {formatTimeLeft()} seconds</p>
            ) : (
              <button type="button" onClick={handleResendOtp} className="w-full text-blue-500 hover:underline text-center text-sm">Resend OTP</button>
            )}
          </form>
        </motion.div>
      </Suspense>
    </div>
  );
};

export default ForgotOtp;
