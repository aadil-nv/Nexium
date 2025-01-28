import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

interface NewPasswordFormProps {
  theme: 'dark' | 'light';
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  errors: {
    password?: string;
    confirmPassword?: string;
  };
  handleNewPassword: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessModal: boolean;
  getInputStyle: (error?: string) => string;
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  theme,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  handleNewPassword,
  setShowNewPassword,
  showSuccessModal,
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
          Change Password
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Enter your new password
        </p>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-out scale-100 animate-fade-in ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-green-500 text-5xl mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-2">Success!</h2>
              <p className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Your password has been updated.
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                You will be redirected shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleNewPassword}>
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={getInputStyle(errors.password)}
              placeholder="Enter new password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev: boolean) => !prev)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={getInputStyle(errors.confirmPassword)}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword((prev: boolean) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 transform hover:scale-[1.02]"
        >
          Change Password
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowNewPassword(false)}
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

export default NewPasswordForm;