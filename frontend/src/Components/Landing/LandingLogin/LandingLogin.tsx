import React from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { motion } from 'framer-motion';

export default function LandingLoginPage() {
  const { theme } = useTheme(); // Get the current theme from the provider

  return (
    <div className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Right side with login form */}
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

        {/* Single login form */}
        <form>
          {/* Username input */}
          <div className='mb-4'>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='username'>
              Username
            </label>
            <input
              className={`mt-1 p-2 border rounded w-full ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
              type='text'
              id='username'
              placeholder='Enter your username or email'
              required
            />
          </div>

          {/* Password input */}
          <div className='mb-6'>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='password'>
              Password
            </label>
            <input
              className={`mt-1 p-2 border rounded w-full ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
              type='password'
              id='password'
              placeholder='Enter your password'
              required
            />
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
