// src/Components/SignUp.tsx
import React from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { motion } from 'framer-motion';

const SignUp: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
    >
      {/* Signup form container */}
      <motion.div
        className={`p-8 rounded-lg w-[90%] max-w-2xl transition-shadow duration-300 shadow-lg ${
          theme === 'dark' ? 'bg-black-800 shadow-blue-500' : 'bg-white shadow-md'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Sign Up
        </h2>

        {/* Signup form */}
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor="company_name">
                Company Name
              </label>
              <input
                type="text"
                id="company_name"
                className={`mt-1 p-2 border rounded w-full ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 ${
                  theme === 'dark' ? '' : 'hover:shadow-md'
                }`}
                placeholder="Enter your company name"
                required
              />
            </div>
            <div>
              <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`mt-1 p-2 border rounded w-full ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 ${
                  theme === 'dark' ? '' : 'hover:shadow-md'
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`mt-1 p-2 border rounded w-full ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 ${
                  theme === 'dark' ? '' : 'hover:shadow-md'
                }`}
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor="confirm_password">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                className={`mt-1 p-2 border rounded w-full ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 ${
                  theme === 'dark' ? '' : 'hover:shadow-md'
                }`}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div>
              <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor="phone">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                className={`mt-1 p-2 border rounded w-full ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 ${
                  theme === 'dark' ? '' : 'hover:shadow-md'
                }`}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor="registration_number">
                Registration Number
              </label>
              <input
                type="text"
                id="registration_number"
                className={`mt-1 p-2 border rounded w-full ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-200 ${
                  theme === 'dark' ? '' : 'hover:shadow-md'
                }`}
                placeholder="Enter your registration number"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>

        {/* Already have an account section */}
        <div className='mt-4 text-center'>
          <p className='text-sm'>
            Already have an account?{' '}
            <a href='/login' className={`text-sm hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
              Log In
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
