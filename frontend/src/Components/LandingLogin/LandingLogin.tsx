import React from 'react';
import { useTheme } from '../landingPage/theme-provider'; // Adjust the path as necessary

export default function LandingLoginPage() {
  const { theme } = useTheme(); // Get the current theme from the provider

  return (
    <div className={`w-full h-screen flex ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Left side with light blue background */}
      <div className={`w-1/2 h-full ${theme === 'dark' ? 'bg-black' : 'bg-blue-200'} flex items-center justify-center`}>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
          Welcome to Our Platform
        </h1>
      </div>

      {/* Right side with login form */}
      <div className={`w-1/2 h-full flex items-center justify-center`}>
        <div
          className={`p-8 rounded-lg w-[90%] max-w-md transition-shadow duration-300 ${
            theme === 'dark' ? 'bg-black shadow-2xl shadow-white' : 'bg-white shadow-md shadow-gray-400'
          }`}
        >
          <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Login
          </h2>

          {/* Single login form */}
          <form>
            {/* Username input */}
            <div className='mb-4'>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='username'>
                Username
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' ? 'border-white bg-black text-white focus:ring-blue-500' : 'border-gray-300 text-gray-800 focus:ring-blue-400'
                }`}
                type='text'
                id='username'
                placeholder='Enter your username'
              />
            </div>

            {/* Password input */}
            <div className='mb-6'>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor='password'>
                Password
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' ? 'border-white bg-black text-white focus:ring-blue-500' : 'border-gray-300 text-gray-800 focus:ring-blue-400'
                }`}
                type='password'
                id='password'
                placeholder='Enter your password'
              />
            </div>

            {/* Login Button */}
            <button
              className={`w-full font-bold py-2 px-4 rounded-md mb-4 focus:outline-none focus:ring-2 ${
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400' : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'
              }`}
              type='submit'
            >
              Login
            </button>

            {/* Google Login Button */}
            <button
              className={`w-full font-bold py-2 px-4 rounded-md flex items-center justify-center mb-6 focus:outline-none focus:ring-2 ${
                theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400' : 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
              }`}
              type='button'
            >
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google Logo" className="mr-2" />
              Login with Google
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
              <a href='#' className={`text-sm hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
