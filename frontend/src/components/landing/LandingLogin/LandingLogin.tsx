import React, { useState, useEffect } from 'react';
import { useTheme } from '../landingPage/theme-provider';
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, setBusinessOwnerData } from '../../../redux/slices/businessOwnerSlice';
import { loginBusinessOwnerAPI, forgotPassword, changePasswordAPI, validateOtp, resendOtp } from '../../../api/authApi';
import { toast } from 'react-hot-toast';
import ForgotPasswordForm from '../LandingLogin/ForgotOtp';
import OtpVerification from '../LandingLogin/VerifyEmail';
import NewPasswordForm from '../LandingLogin/NewPassword';
import  LoginForm from "../LandingLogin/LoginForm";
import { z } from 'zod';

interface LoginFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}
interface LoginResponse {
  success: boolean;
  message?: string;
  companyName?: string |undefined;
  profilePicture?: string | undefined;
  companyLogo?: string | undefined;
  isVerified?: boolean;
  email?: string;
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

const LandingLoginPage = () => {
  
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [credentialError, setCredentialError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [otpError, setOtpError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    setIsTimerActive(false);
  }, [isTimerActive, timeLeft]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOtpChange = (e: { target: { value: any }; }, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: { key: string; }, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleResendOtp = async () => {
    setTimeLeft(90);
    setIsTimerActive(true);
    setOtp(Array(6).fill(''));
    setOtpError('');

    try {
      const data = await resendOtp(forgotPasswordEmail);
      if (data.success) {
        toast.success('OTP resent successfully');
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.log("Error resending OTP:", error);
      
      toast.error('Error resending OTP');
    }
  };
  const handleOtpSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setOtpError('Please enter a complete 6-digit OTP');
      return;
    }

    try {
      
      const data = await validateOtp(forgotPasswordEmail, otpString);
      if (data.success) {
        setShowOtpVerification(false);
        setShowNewPassword(true);
        setOtpError('');
        toast.success('OTP verified successfully');
      } else {
        setOtpError(data.message || 'Invalid OTP');
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
      setOtpError('Error verifying OTP');
      toast.error('Error verifying OTP');
    }
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        email: formattedErrors.email?._errors[0],
        password: formattedErrors.password?._errors[0],
      });
      return;
    }
  
    setErrors({});
    setCredentialError('');
  
    try {
      const data: LoginResponse = await loginBusinessOwnerAPI(email, password);
      
      if (data.success) {
        dispatch(login({ role: 'businessOwner', isAuthenticated: true }));
        dispatch(setBusinessOwnerData({
          companyName: data.companyName || '',
          businessOwnerProfilePicture: data.profilePicture || '',
          companyLogo: data.companyLogo || '',
        }));
        navigate('/business-owner/dashboard');
      } else {
        if (data.message === "Account is blocked. Please contact admin") {
          setCredentialError(data.message);
        } else if (data.isVerified === false && data.email) {
          navigate('/otp', { state: { email: data.email } });
        } else {
          setCredentialError(data.message || 'Invalid email or password');
        }
      }
    } catch (error) {
     console.log("Error logging in:", error);
     
      if (error instanceof Error) {
        // This handles errors that are instances of Error
        const errorMessage = error.message || 'Something went wrong during login';
        setCredentialError(errorMessage);
      } else if (error && (error as { response?: { data?: { message: string, email: string, isVerified: boolean } } }).response) {
        // This handles errors that contain response data
        const errorMessage = (error as { response: { data: { message: string } } }).response.data.message || 'Something went wrong during login';
        
        if ((error as { response: { data: { email: string, isVerified: boolean } } }).response.data.email &&
            (error as { response: { data: { isVerified: boolean } } }).response.data.isVerified === false) {
          navigate('/otp', { state: { email: (error as { response: { data: { email: string } } }).response.data.email } });
        } else {
          setCredentialError(errorMessage);
        }
      } else {
        // Fallback for any other unknown error
        setCredentialError('Something went wrong during login');
      }
    }
  };
  

  const handleForgotPassword = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    const result = forgotPasswordSchema.safeParse({ email: forgotPasswordEmail });
    if (!result.success) {
      setForgotPasswordError(result.error.format().email?._errors[0] || 'Invalid email');
      return;
    }
    
    setForgotPasswordError('');
    setLoading(true);

    try {
      const data = await forgotPassword(forgotPasswordEmail);
      if (data.success) {
        setShowForgotPassword(false);
        setShowOtpVerification(true);
        setTimeLeft(90);
        setIsTimerActive(true);
        setOtp(Array(6).fill('')); // Reset OTP input
        toast.success('OTP sent successfully to your email');
      } else {
        setForgotPasswordError(data.message || 'Failed to send OTP');
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
      setForgotPasswordError('An error occurred while sending OTP');
      toast.error('An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = newPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        password: validationErrors.password?._errors[0],
        confirmPassword: validationErrors.confirmPassword?._errors[0],
      });
      return;
    }

    try {
      const response = await changePasswordAPI(password, forgotPasswordEmail);
      console.log("Password change response:", response);
      
      if (response.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowNewPassword(false);
          navigate('/login');
        }, 3000);
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Error during password change:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const getInputStyle = (fieldError?: string | null): string => {
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
          src="/api/placeholder/800/600" 
          alt="Login"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-blue-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-xl">Login to access your business dashboard</p>
          </div>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        {showOtpVerification ? (
          <OtpVerification
            otp={otp}
            handleOtpChange={handleOtpChange}
            handleOtpKeyDown={handleOtpKeyDown}
            otpError={otpError}
            handleOtpSubmit={handleOtpSubmit}
            isTimerActive={isTimerActive}
            formatTimeLeft={formatTimeLeft}
            handleResendOtp={handleResendOtp}
            setShowOtpVerification={setShowOtpVerification}
            setShowForgotPassword={setShowForgotPassword}
            forgotPasswordEmail={forgotPasswordEmail}
          />
        ) : showNewPassword ? (
          <NewPasswordForm
             theme={theme === 'system' ? 'light' : theme}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errors={errors}
            handleNewPassword={handleNewPassword}
            setShowNewPassword={setShowNewPassword}
            showSuccessModal={showSuccessModal}
            getInputStyle={getInputStyle}
          />
        ) : showForgotPassword ? (
          <ForgotPasswordForm
            theme={theme === 'system' ? 'light' : theme}
            forgotPasswordEmail={forgotPasswordEmail}
            setForgotPasswordEmail={setForgotPasswordEmail}
            forgotPasswordError={forgotPasswordError}
            loading={loading}
            handleForgotPassword={handleForgotPassword}
            setShowForgotPassword={setShowForgotPassword}
            getInputStyle={getInputStyle}
          />
        ) : (
          <LoginForm
            theme={theme === 'system' ? 'light' : theme}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            errors={errors}
            credentialError={credentialError}
            handleLogin={handleLogin}
            setShowForgotPassword={setShowForgotPassword}
            getInputStyle={getInputStyle}
          />
        )}
      </div>
    </div>
  );
};

export default LandingLoginPage;