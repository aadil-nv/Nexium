import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../components/landing/landingPage/theme-provider';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signUpResendOtp,SignUpValidateOtp } from '../../../api/authApi'; // Import the API functions

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
);

const LandingOtp: React.FC = () => {
  const { theme } = useTheme();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email;

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

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
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      setTimeLeft(90);
      setIsTimerActive(true);
      setOtp(Array(6).fill(''));
      setErrorMessage('');

      const data = await signUpResendOtp(email);
      data.success ? toast.success('OTP has been resent successfully!') : toast.error(data.message || 'Failed to resend OTP.');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await SignUpValidateOtp(email, otp.join(''));
      if (data.success) {
        navigate('/plans', { state: { email: data.email } });
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Invalid OTP');
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  const formatTimeLeft = () => `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  return (
    <div className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Suspense fallback={<LoadingSpinner />}>
        <motion.div
          className={`p-8 rounded-lg w-[90%] max-w-2xl transition-shadow duration-300 ${
            theme === 'dark' ? 'bg-black-800 shadow-md shadow-blue-500' : 'bg-white shadow-lg shadow-blue-500'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
                  className={`w-12 h-12 mx-1 text-center text-2xl border rounded ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                  }`}
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg mb-4">
              Verify OTP
            </button>

            {isTimerActive ? (
              <p className="text-center text-sm">Resend OTP in {formatTimeLeft()} seconds</p>
            ) : (
              <button type="button" onClick={handleResendOtp} className="w-full text-blue-500 hover:underline text-center text-sm">
                Resend OTP
              </button>
            )}
          </form>
        </motion.div>
      </Suspense>
    </div>
  );
};

export default LandingOtp;
