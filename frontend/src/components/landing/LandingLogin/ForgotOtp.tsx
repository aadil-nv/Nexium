import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

interface ForgotPasswordFormProps {
  theme: 'dark' | 'light';
  forgotPasswordEmail: string;
  setForgotPasswordEmail: (email: string) => void;
  forgotPasswordError: string | null;
  loading: boolean;
  handleForgotPassword: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowForgotPassword: (show: boolean) => void;
  getInputStyle: (error?: string | null) => string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  theme,
  forgotPasswordEmail,
  setForgotPasswordEmail,
  forgotPasswordError,
  loading,
  handleForgotPassword,
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
      <div className="mb-10">
        <h2 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Forgot Password
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Enter your email to reset your password
        </p>
      </div>

      <form onSubmit={handleForgotPassword}>
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Email Address
          </label>
          <input
            type="email"
            className={getInputStyle(forgotPasswordError)}
            placeholder="Enter your email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
          {forgotPasswordError && <p className="mt-1 text-sm text-red-500">{forgotPasswordError}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 transform hover:scale-[1.02] flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={25} /> : 'Reset Password'}
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="flex items-center justify-center mx-auto text-blue-500 hover:text-blue-600"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordForm;