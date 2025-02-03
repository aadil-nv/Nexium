import React, { useState } from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { signUpSchema } from '../../../config/validationSchema';
import { signUpBusinessOwner } from '../../../api/authApi';
import signupbackground from "../../../assets/landingPageAssets/signupbackground.png";

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = signUpSchema.safeParse({
      ...formData,
      registrationNumber: "NOT_REQUIRED",
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
        "NOT_REQUIRED",
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

  const getInputStyle = (fieldName: string, fieldError?: string): string => {
    const isDark = theme === 'dark';
    const isFocused = focusedField === fieldName;
    
    const baseStyle = `
      w-full px-4 py-3 rounded-lg transition-all duration-300
      ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}
      ${isFocused ? (isDark ? 'ring-2 ring-blue-400' : 'ring-2 ring-blue-500') : ''}
      ${fieldError ? 'border-red-500' : (isDark ? 'border-gray-700' : 'border-gray-300')}
      placeholder:text-gray-400
      outline-none
    `;

    return baseStyle;
  };

  const inputVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    focus: { scale: 1.02 },
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={signupbackground} alt="Signup" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-blue-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-center p-8"
          >
            <h1 className="text-5xl font-bold mb-4">Welcome!</h1>
            <p className="text-xl font-light">Join us to manage your business efficiently</p>
          </motion.div>
        </div>
      </div>

      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Create Account
            </h2>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {['companyName', 'email', 'phone', 'password', 'confirm_password'].map((field, index) => (
              <motion.div
                key={field}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                variants={inputVariants}
              >
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                </label>
                <div className="relative">
                  <motion.input
                    type={
                      field === 'password' ? (showPassword ? 'text' : 'password') :
                      field === 'confirm_password' ? (showConfirmPassword ? 'text' : 'password') :
                      field === 'email' ? 'email' : 'text'
                    }
                    name={field}
                    className={getInputStyle(field, error[field])}
                    placeholder={`Enter your ${field.replace('_', ' ').toLowerCase()}`}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField(null)}
                    whileFocus="focus"
                  />
                  {(field === 'password' || field === 'confirm_password') && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => field === 'password' ? 
                        setShowPassword(prev => !prev) : 
                        setShowConfirmPassword(prev => !prev)
                      }
                    >
                      {(field === 'password' ? showPassword : showConfirmPassword) ? 
                        <FaEyeSlash size={20} /> : 
                        <FaEye size={20} />
                      }
                    </button>
                  )}
                </div>
                {error[field] && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {error[field]}
                  </motion.p>
                )}
              </motion.div>
            ))}

            {error.form && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-100 text-red-700 text-sm"
              >
                {error.form}
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium
                transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50
                disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? <Spinner /> : 'Create Account'}
            </motion.button>

            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className={`font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  Sign in
                </a>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;