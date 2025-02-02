import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../landingPage/theme-provider';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signUpResendOtp, SignUpValidateOtp } from '../../../api/authApi';
import  signupbackground  from "../../../assets/landingPageAssets/signupbackground.png"

const LandingOtp = () => {
  const { theme } = useTheme();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email;

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.6
    }
  }
};

// Animation variants for individual items
const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

// Fixed floating animation
const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 0, -10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut"
    }
  }
};

// Fixed pulse animation
const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut"
    }
  }
};



  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) {
      setIsTimerActive(false);
      return;
    }
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
      setIsLoading(true);
      setTimeLeft(90);
      setIsTimerActive(true);
      setOtp(Array(6).fill(''));
      setErrorMessage('');
  
      const data = await signUpResendOtp(email);
      if (data.success) {
        toast.success('OTP has been resent successfully!');
      } else {
        toast.error(data.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Error resending OTP.');
      } else {
        toast.error('Error resending OTP.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = await SignUpValidateOtp(email, otp.join(''));
      if (data.success) {
        // Success animation before navigation
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/plans', { state: { email: data.email } });
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Invalid OTP');
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeLeft = () => `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div 
      className={`min-h-screen flex ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left side - Image */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        variants={itemVariants}
      >
        <motion.img 
          src={signupbackground}
          alt="OTP Verification"
          className="object-cover w-full h-full"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div 
          className="absolute inset-0 bg-blue-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="text-white text-center p-8"
            variants={floatingVariants}
            animate="animate"
          >
            <h1 className="text-4xl font-bold mb-4">Verify Your Account</h1>
            <p className="text-xl">Please enter the OTP sent to your email</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - OTP Form */}
      <motion.div 
        className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
        variants={itemVariants}
      >
        <motion.div
          className="w-full max-w-md"
          variants={pulseVariants}
          animate="animate"
        >
          <motion.div 
            className="mb-10 text-center"
            variants={itemVariants}
          >
            <h2 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Enter OTP
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We've sent a verification code to your email
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Verification Code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileFocus={{ scale: 1.05 }}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-12 h-12 text-center text-xl rounded-lg border transition duration-200 outline-none ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500'
                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500`}
                    maxLength={1}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </motion.div>

            <AnimatePresence>
              {errorMessage && (
                <motion.div 
                  className="p-3 rounded-lg bg-red-100 text-red-700 text-sm"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ⟳
                </motion.span>
              ) : (
                'Verify OTP'
              )}
            </motion.button>

            <motion.div 
              className="text-center mt-6"
              variants={itemVariants}
            >
              {isTimerActive ? (
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Resend code in {formatTimeLeft()}
                </p>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleResendOtp}
                  className={`text-sm font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  Resend verification code
                </motion.button>
              )}
            </motion.div>

            <motion.div 
              className="text-center space-y-4 mt-8"
              variants={itemVariants}
            >
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Didn't receive the email?{' '}
                <motion.button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className={`font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try another email
                </motion.button>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LandingOtp;