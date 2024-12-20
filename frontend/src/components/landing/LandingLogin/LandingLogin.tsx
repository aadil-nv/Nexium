// LandingLoginPage.js
import React, { useState } from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { login ,setBusinessOwnerData } from '../../../redux/slices/businessOwnerSlice';
import { loginBusinessOwnerAPI } from '../../../api/authApi'; // Import the loginUser function

// Zod schema for validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export default function LandingLoginPage() {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [credentialError, setCredentialError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Validate form inputs
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.format();
      setErrors({
        email: errors.email?._errors[0],
        password: errors.password?._errors[0],
      });
      return;
    }
  
    setErrors({});
    setCredentialError('');
  
    try {
      const data = await loginBusinessOwnerAPI(email, password);
      console.log("Login response data:-------------", data);
  
      if (data.success) {
        // Successful login
        dispatch(login({ role: 'businessOwner', isAuthenticated: true }));
        dispatch(setBusinessOwnerData({
          companyName: data.companyName,
          businessOwnerProfilePicture: data.profilePicture,
          companyLogo: data.companyLogo,
       

        }));
       
      
        navigate('/business-owner/dashboard');
      } else {
        // Handle specific cases for blocked or unverified accounts
        if (data.message === "Account is blocked. Please contact admin") {
          setCredentialError(data.message); // Display block message
        } else if (data.isVerified === false && data.email) {
          // Navigate to OTP page if account is unverified
          navigate('/otp', { state: { email: data.email } });
        } else {
          // General error message
          setCredentialError(data.message || 'Invalid email or password');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Something went wrong during login';
      console.error("Error during login:", error);
  
      if (error.response?.data?.email && error.response?.data?.isVerified === false) {
        // Navigate to OTP page if unverified and email is provided
        navigate('/otp', { state: { email: error.response.data.email } });
      } else {
        setCredentialError(errorMessage); // Display any other server error message
      }
    }
  };
  

  const inputBorderStyle = (field: string) => {
    if (errors[field]) return 'border-red-500';
    if (email || password) return 'border-green-500';
    return 'border-gray-300';
  };

  return (
    <div className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <motion.div
        className={`p-8 rounded-lg w-[90%] max-w-2xl transition-shadow duration-300 ${
          theme === 'dark' ? 'bg-black shadow-lg shadow-blue-500' : 'bg-white shadow-md shadow-gray-200'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div className='mb-4'>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='email'>
              Email
            </label>
            <input
              className={`mt-1 p-2 border rounded w-full ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } ${inputBorderStyle('email')} focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
              type='email'
              id='email'
              placeholder='Enter your email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password input */}
          <div className='mb-6 relative'>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='password'>
              Password
            </label>
            <input
              className={`mt-1 p-2 border rounded w-full ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } ${inputBorderStyle('password')} focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
              type={showPassword ? 'text' : 'password'}
              id='password'
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              type='button'
              className="absolute right-2 pt-3"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Credential error */}
          {credentialError && <p className="text-red-500 text-sm mb-4">{credentialError}</p>}

          {/* Login Button */}
          <button
            className="w-full bg-blue-500 text-white p-3 rounded mb-4 hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
            type='submit'
          >
            Login
          </button>

          {/* Google Login Button */}
          <button
            className={`w-full font-bold py-2 px-4 rounded-md flex items-center justify-center mb-2 focus:outline-none focus:ring-2 ${
              theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400' : 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
            }`}
            type='button'
          >
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google Logo" className="mr-2" />
            Login with Google
          </button>

          {/* GitHub Login Button */}
          <button
            className={`w-full font-bold py-2 px-4 rounded-md flex items-center justify-center mb-6 focus:outline-none focus:ring-2 ${
              theme === 'dark' ? 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-400' : 'bg-gray-700 hover:bg-gray-800 text-white focus:ring-gray-400'
            }`}
            type='button'
          >
            <img src="https://img.icons8.com/material-outlined/24/000000/github.png" alt="GitHub Logo" className="mr-2" />
            Login with GitHub
          </button>
        </form>

        {/* Forgot Password and Sign Up Links */}
        <div className='mt-4 text-center'>
          <a href='/verify-email' className={`text-sm hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
            Forgot Password?
          </a>
        </div>

        <div className='mt-4 text-center'>
          <p className='text-sm'>
            Don't have an account?{' '}
            <a href='/signup' className={`text-sm hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
              Sign Up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
