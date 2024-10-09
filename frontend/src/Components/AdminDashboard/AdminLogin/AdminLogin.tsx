import React from 'react'
import { FaEnvelope, FaLock } from 'react-icons/fa' // Import icons

export default function AdminLogin() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200'>
      <div className='bg-white shadow-md rounded-2xl flex w-2/3 max-w-4xl'>
        {/* Sign in Section */}
        <div className='w-3/5 p-5'>
          <div className='text-left font-bold'>
            <span className='text-blue-500'>Company</span>Name
          </div>
          <div className='py-10'>
            <div className='text-center'>
              <h2 className='text-4xl font-bold text-blue-500'>Login to your account</h2>
              {/* Proper centered underline with gap */}
              <div className='w-24 h-1 bg-blue-500 mx-auto mt-4 mb-4'></div> {/* Added mt-4 for gap */}
            </div>

            <div className='flex flex-col items-center'>
              {/* Email Input */}
              <div className='bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-md'>
                <FaEnvelope className='text-gray-400 m-2' /> {/* Email icon */}
                <input
                  type='email'
                  placeholder='Email'
                  className='bg-gray-100 outline-none text-sm flex-1'
                />
              </div>

              {/* Password Input */}
              <div className='bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-md'>
                <FaLock className='text-gray-400 m-2' /> {/* Password icon */}
                <input
                  type='password'
                  placeholder='Password'
                  className='bg-gray-100 outline-none text-sm flex-1'
                />
              </div>

              {/* Login Button */}
              <button className='border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-500 hover:text-white'>
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Sign up Section */}
        <div className='w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold mb-2'>Hello,👋Admin</h2>
            {/* Proper centered underline */}
            <div className='w-24 h-1 bg-white mx-auto mb-4'></div> {/* Thicker and longer underline */}
          </div>
          <p className='mb-2'>Welcome back Admin, show your skill</p>
          {/* Centering the Home button */}
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
    </div>
  )
}
