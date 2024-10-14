import React, { useState } from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function LandingLoginPage() {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:7000/api/company/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log(data);
      // Redirect to dashboard or another page on success
      navigate('/company/dashboard');
      
    } catch (error) {
      console.error('Error during login:', error);
      // Optionally, you can set an error message state here
    }
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

        {/* Login form */}
        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div className='mb-4'>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='email'>
              Email
            </label>
            <input
              className={`mt-1 p-2 border rounded w-full ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
              type='email'
              id='email'
              placeholder='Enter your email'
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password input */}
          <div className='mb-6 relative'>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='password'>
              Password
            </label>
            <input
              className={`mt-1 p-2 border rounded w-full ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
              type={showPassword ? 'text' : 'password'}
              id='password'
              placeholder='Enter your password'
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type='button'
              className="absolute right-2 pt-3"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            className={`w-full bg-blue-500 text-white p-3 rounded mb-4 hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg`}
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
          <a href='#' className={`text-sm hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
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
