import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = ({
  theme,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errors,
  credentialError,
  handleLogin,
  setShowForgotPassword,
  getInputStyle
}) => {
  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-10 text-center">
        <h2 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Sign In
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Please enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Email Address
          </label>
          <input
            type="email"
            className={getInputStyle(errors.email)}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={getInputStyle(errors.password)}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        {credentialError && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {credentialError}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 transform hover:scale-[1.02]"
        >
          Sign In
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${theme === 'dark' ? 'bg-black text-gray-400' : 'bg-white text-gray-500'}`}>
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg border transition duration-200 ${
              theme === 'dark' 
                ? 'border-gray-700 hover:bg-gray-800' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Continue with Google</span>
          </button>

          <button
            type="button"
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg border transition duration-200 ${
              theme === 'dark' 
                ? 'border-gray-700 hover:bg-gray-800' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <img src="https://img.icons8.com/material-outlined/24/000000/github.png" alt="GitHub" className="w-5 h-5 mr-2" />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Continue with GitHub</span>
          </button>
        </div>

        <div className="text-center space-y-4 mt-8">
          <button 
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className={`text-sm hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
          >
            Forgot your password?
          </button>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <a 
              href="/signup" 
              className={`font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
            >
              Sign up for free
            </a>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;