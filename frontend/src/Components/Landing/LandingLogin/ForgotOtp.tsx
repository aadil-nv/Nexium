import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../landingPage/theme-provider';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // Import React Hot Toast

// Define the type for the location state
type LocationState = {
  email: string;
};

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
  const location = useLocation();
  const email = (location.state as LocationState)?.email;
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (timeLeft > 0) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const previousInput = document.getElementById(`otp-${index - 1}`);
      if (previousInput) {
        previousInput.focus();
      }
    }
  };

  const handleResendOtp = async () => {
    setTimeLeft(90); // Reset timer to 90 seconds
    setIsTimerActive(true);
    setOtp(Array(6).fill('')); // Reset OTP input
    setErrorMessage(''); // Clear any previous error message

    try {
      // Call the backend to resend the OTP
      const response = await axios.post('http://localhost:7000/api/business-owner/resend-otp', {
        email,
      });

      const data = response.data;

      if (data.success) {
        toast.success('OTP has been resent successfully!'); // Show success message
      } else {
        toast.error(data.message || 'Failed to resend OTP.'); // Show error message
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Error resending OTP. Please try again.'); // Show generic error message
    }
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    try {
      const response = await axios.post('http://localhost:7000/api/business-owner/otp-validation', {
        email, 
        otp: otpString, 
      });

      const data = response.data; 
      console.log("Data from OTP validation:", data.success, data.message, data.email);
      
      if (data.success) {
        navigate('/change-password', { state: { email: data.email } }); 
        setErrorMessage(''); // Clear error message on success
      } else {
        setErrorMessage(data.message || 'Invalid OTP'); // Set error message
        toast.error(data.message || 'Invalid OTP'); // Show error toast
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('Error verifying OTP. Please try again.'); // Set a generic error message
      toast.error('Error verifying OTP. Please try again.'); // Show generic error toast
    }
  };

  return (
    <div
      className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <motion.div
          className={`p-8 rounded-lg w-[90%] max-w-2xl transition-shadow duration-300 ${
            theme === 'dark' ? 'bg-black-800 shadow-md shadow-blue-500' : 'bg-white shadow-lg shadow-blue-500'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Enter OTP
          </h2>

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

            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p> // Error message display
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg mb-4"
            >
              Verify OTP
            </button>

            {isTimerActive ? (
              <p className='text-center text-sm'>
                Resend OTP in {formatTimeLeft()} seconds
              </p>
            ) : (
              <button
                type="button" // Change to type="button" to prevent form submission
                onClick={handleResendOtp}
                className='w-full text-blue-500 hover:underline text-center text-sm'
              >
                Resend OTP
              </button>
            )}
          </form>
        </motion.div>
      </Suspense>
    </div>
  );
};

export default ForgotOtp;
