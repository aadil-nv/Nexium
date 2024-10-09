import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Correct the logo import statement
import logo from "../../../assets/landingPageAssets/nnn logo 1000[1].png";

export default function AdminLogin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 

    try {
      const response = await fetch('http://localhost:7000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }

      toast.success('Login successful!');
      navigate('/super-admin/dashboard');

    } catch (err: any) {
      console.error('Login failed:', err.message);
      setError('Login failed. Please check your credentials.');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200'>
      <div className='bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl'>
        <div className='w-full md:w-3/5 p-5'>
          <div className='text-left font-bold'>
            {/* Set logo width properly */}
            <img src={logo} alt="Logo" className='w-20 h-auto' />
          </div>
          <div className='py-10'>
            <div className='text-center'>
              <h2 className='text-4xl font-bold text-blue-500'>Login to your account</h2>
              <div className='w-24 h-1 bg-blue-500 mx-auto mt-4 mb-4'></div>
            </div>

            <div className='flex flex-col items-center'>
              <form onSubmit={handleLogin} className="flex flex-col items-center">
                <div className='bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-md'>
                  <FaEnvelope className='text-gray-400 m-2' />
                  <input
                    type='email'
                    placeholder='Email'
                    className='bg-gray-100 outline-none text-sm text-black flex-1' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>

                <div className='bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-md relative'>
                  <FaLock className='text-gray-400 m-2' />
                  <input
                    type={showPassword ? 'text' : 'password'} 
                    placeholder='Password'
                    className='bg-gray-100 outline-none text-sm text-black flex-1' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className='absolute right-2'
                  >
                    {showPassword ? <FaEyeSlash className='text-gray-400' /> : <FaEye className='text-gray-400' />}
                  </button>
                </div>

                <button
                  type='submit'
                  className={`border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-500 hover:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading} 
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              
              {error && <p className='text-red-500 mt-2'>{error}</p>} 
            </div>
          </div>
        </div>

        <div className='w-full md:w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold mb-2'>Hello,👋Admin</h2>
            <div className='w-24 h-1 bg-white mx-auto mb-4'></div>
          </div>
          <p className='mb-2'>Welcome back Admin, show your skill</p>
          
          <div className='flex justify-center'>
            <a
              href='#'
              className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-500'
            >
              Home
            </a>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
