// src/Components/SignUp.tsx
import React from 'react';
import { useTheme } from '../landingPage/theme-provider';
// Correct import for Lamp component

const SignUp: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`w-full h-screen flex ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Left side with signup form */}
      <div className={`w-1/2 h-full flex items-center justify-center`}>
        <div className={`p-8 rounded-lg w-[90%] max-w-md transition-shadow duration-300 ${
            theme === 'dark' ? 'bg-black shadow-2xl shadow-white' : 'bg-white shadow-md shadow-gray-400'
          }`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Sign Up
          </h2>

          {/* Signup form */}
          <form>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
          </form>
        </div>
      </div>

      {/* Right side with lamp effect */}
      <div className={`w-1/2 h-full flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-blue-200'}`}>
       
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-900'} lamp-effect`}>
          Join Our Company Management Platform
        </h1>
      </div>
    </div>
  );
};

export default SignUp;
