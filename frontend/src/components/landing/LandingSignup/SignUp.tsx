import React, { useState } from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signUpSchema } from '../../../config/validationSchema';
import axios from 'axios';

// Spinner component
const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

const SignUp: React.FC = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [userMail, setUserMail] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const validation = signUpSchema.safeParse({
      companyName,
      email,
      password,
      confirm_password,
      phone,
      registrationNumber,
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
      const response = await axios.post('http://localhost:7000/api/business-owner/register', {
        companyName,
        registrationNumber,
        email,
        password,
        phone,
        address: 'local',
        website: '',
        documents: [],
      });
  
      const data = response.data;
  
      if (data.message === 'true') {
        console.log("MESSAge fron cont to frn",data);
        
        setUserMail(data.email);  
        navigate('/otp', { state: { email: data.email } }); 
      } else {
        setError({ form: data.message });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError({ form: 'An error occurred during signup. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const getInputClass = (field: string) =>
    error[field]
      ? 'border-red-500'
      : 'border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200';

  return (
    <div className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Company Name</label>
              <input
                type="text"
                className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${getInputClass(
                  'companyName'
                )}`}
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              {error.companyName && <p className="text-red-500 text-sm">{error.companyName}</p>}
            </div>

            <div>
              <label className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Email</label>
              <input
                type="email"
                className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${getInputClass(
                  'email'
                )}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
            </div>

            <div className="relative">
              <label className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${getInputClass(
                  'password'
                )}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </div>

            <div className="relative">
              <label className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${getInputClass(
                  'confirm_password'
                )}`}
                placeholder="Confirm your password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-600"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
              {error.confirm_password && <p className="text-red-500 text-sm">{error.confirm_password}</p>}
            </div>

            <div>
              <label className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Phone</label>
              <input
                type="tel"
                className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${getInputClass(
                  'phone'
                )}`}
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {error.phone && <p className="text-red-500 text-sm">{error.phone}</p>}
            </div>

            <div>
              <label className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Registration Number</label>
              <input
                type="text"
                className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${getInputClass(
                  'registrationNumber'
                )}`}
                placeholder="Enter your registration number"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
              {error.registrationNumber && <p className="text-red-500 text-sm">{error.registrationNumber}</p>}
            </div>
          </div>

          {error.form && <p className="text-red-500 text-sm text-center mb-4">{error.form}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 text-white font-bold rounded ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700'
            }`}
          >
            {loading ? <Spinner /> : 'Sign Up'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
