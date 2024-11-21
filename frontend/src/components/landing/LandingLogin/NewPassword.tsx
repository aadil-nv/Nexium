import React, { useState } from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { z } from 'zod';
import { FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changePasswordAPI } from '../../../api/authApi'; // Import the API function

const passwordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
});

type LocationState = {
    email: string;
};

export default function NewPassword() {
    const { theme } = useTheme();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Fix here: use `as` to type assert `location.state`
    const email = (location.state as LocationState)?.email;

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = passwordSchema.safeParse({ password, confirmPassword });
        if (!result.success) {
            const validationErrors = result.error.format();
            setErrors({
                password: validationErrors.password?._errors[0],
                confirmPassword: validationErrors.confirmPassword?._errors[0],
            });
            return;
        } else {
            setErrors({});
        }

        try {
            const response = await changePasswordAPI(password, email);

            if (response.success) {
                setShowSuccessModal(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                toast.error('Failed to change password. Please try again.');
            }
        } catch (error) {
            console.error('Error during password change request:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const inputBorderStyle = (field: string) => {
        if (errors[field]) return 'border-red-500';
        if (field === 'password' && password) return 'border-green-500';
        if (field === 'confirmPassword' && confirmPassword) return 'border-green-500';
        return 'border-gray-300';
    };

    return (
        <div className={`w-full h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <ToastContainer />

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className={`p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-out scale-100 animate-fade-in ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <div className="flex flex-col items-center">
                            <FaCheckCircle className="text-green-500 text-5xl mb-4 animate-pulse" />
                            <h2 className="text-2xl font-semibold mb-2">Success!</h2>
                            <p className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Your password has been updated.</p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>You will be redirected shortly.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className={`p-8 rounded-lg w-[90%] max-w-md transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 shadow-lg shadow-blue-500' : 'bg-white shadow-md shadow-gray-200'}`}>
                <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Change Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4 relative">
                        <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor="password">New Password</label>
                        <input
                            className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} ${inputBorderStyle('password')} focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter new password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="mb-4 relative">
                        <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            className={`mt-1 p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} ${inputBorderStyle('confirmPassword')} focus:ring focus:ring-blue-200 transition-shadow duration-200 hover:shadow-md`}
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center">
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button className="w-full bg-blue-500 text-white p-3 rounded mb-4 hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg" type="submit">Change Password</button>
                </form>

                <div className="text-center text-sm flex items-center justify-center">
                    <FaArrowLeft className="mr-2 text-blue-500" />
                    <a className="text-blue-500" href="/login">Back to Login</a>
                </div>
            </div>
        </div>
    );
}
