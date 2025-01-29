import React, { useState } from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { signUpSchema } from '../../../config/validationSchema';
import { signUpBusinessOwner } from '../../../api/authApi';
import images from "../../../images/images"

interface FormErrors {
  [key: string]: string;
}


const Spinner: React.FC = () => (
  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

const SignUp: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    confirm_password: '',
    phone: '',
  });

  const [error, setError] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = signUpSchema.safeParse({
      ...formData,
      registrationNumber: "NOT_REQUIRED", // Add default value since we removed the field
    });

    if (!validation.success) {
      const formErrors = validation.error.errors.reduce(
        (acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }),
        {}
      );
      setError(formErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await signUpBusinessOwner(
        formData.companyName,
        "NOT_REQUIRED", // Removed registration number
        formData.email,
        formData.password,
        formData.phone
      );
      
      if (data.success === true) {
        navigate('/otp', { state: { email: data.email } });
      } else {
        setError({ form: data.message });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setError({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (fieldError?: string): string => {
    const baseStyle = `w-full px-4 py-3 rounded-lg transition duration-200 outline-none ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
    }`;

    if (fieldError) {
      return `${baseStyle} border-2 border-red-500 focus:border-red-500`;
    }

    return `${baseStyle} border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500`;
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={images.homePicture}
          alt="Signup"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-blue-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
            <p className="text-xl">Join us to manage your business efficiently</p>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 text-center">
            <h2 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Create Account
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign up to get started with our services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                className={getInputStyle(error.companyName)}
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
              />
              {error.companyName && <p className="mt-1 text-sm text-red-500">{error.companyName}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className={getInputStyle(error.email)}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {error.email && <p className="mt-1 text-sm text-red-500">{error.email}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                className={getInputStyle(error.phone)}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
              {error.phone && <p className="mt-0 text-sm text-red-500">{error.phone}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={getInputStyle(error.password)}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {error.password && <p className="mt-1 text-sm text-red-500">{error.password}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  className={getInputStyle(error.confirm_password)}
                  placeholder="Confirm your password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {error.confirm_password && <p className="mt-1 text-sm text-red-500">{error.confirm_password}</p>}
            </div>

            {error.form && (
              <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                {error.form}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 transform hover:scale-[1.02] flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Create Account'}
            </button>

            <div className="text-center mt-6">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className={`font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;