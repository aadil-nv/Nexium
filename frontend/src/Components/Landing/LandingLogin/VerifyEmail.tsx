import React, { useState } from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { FaArrowLeft } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function VerifyEmail() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        email: validationErrors.email?._errors[0],
      });
      return;
    } else {
      setErrors({});
    }

    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:7000/api/business-owner/forgott-password', {
        email,
      });
   
      const data = response.data;
      console.log("data is --", data);
      if (data.success) {
        navigate('/forgot-otp', { state: { email: data.email } });
      }
    } catch (error) {
      console.error('Error during forgot password request:', error);
      setStatusMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  const inputBorderStyle = (field: string) => {
    if (errors[field]) return 'border-red-500';
    if (email) return 'border-green-500';
    return 'border-gray-300';
  };

  return (
    <div className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <motion.div
        className={`p-8 rounded-lg w-[90%] max-w-md transition-shadow duration-300 ${theme === 'dark' ? 'bg-black shadow-lg shadow-blue-500' : 'bg-white shadow-md shadow-gray-200'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Forgot Password
        </h2>

        <form onSubmit={handleForgotPassword}>
          {/* Email input */}
          <div className='mb-4'>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='email'>
              Enter your email
            </label>
            <input
              className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${inputBorderStyle('email')} focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
              type='email'
              id='email'
              placeholder='Enter your email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Status message */}
          {statusMessage && <p className="text-blue-500 text-sm mb-4">{statusMessage}</p>}

          {/* Submit Button */}
          <button
            className={`w-full bg-blue-500 text-white p-3 rounded mb-4 hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center`}
            type='submit'
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <ClipLoader color="#ffffff" loading={loading} size={25} /> // Use ClipLoader
            ) : (
              'Reset password'
            )}
          </button>
        </form>

        <div className='text-center text-sm flex items-center justify-center'>
          <FaArrowLeft className='mr-2 text-blue-500' /> {/* Left arrow icon */}
          <a className='text-blue-500' href="/login">Back to Login</a>
        </div>
      </motion.div>
    </div>
  );
}
