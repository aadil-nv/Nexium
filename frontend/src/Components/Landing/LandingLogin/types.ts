export interface CommonProps {
    theme: any
  }
  
  export interface ForgotPasswordFormProps extends CommonProps {
    forgotPasswordEmail: string;
    setForgotPasswordEmail: (email: string) => void;
    forgotPasswordError: string;
    loading: boolean;
    handleForgotPassword: (e: React.FormEvent) => Promise<void>;
    setShowForgotPassword: (show: boolean) => void;
    getInputStyle: (fieldError?: string) => string;
  }
  
  export interface OtpVerificationProps extends CommonProps {
    forgotPasswordEmail: string;
    otp: string[];
    handleOtpChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    handleOtpKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
    otpError: string;
    handleOtpSubmit: (e: React.FormEvent) => Promise<void>;
    isTimerActive: boolean;
    formatTimeLeft: () => string;
    handleResendOtp: () => Promise<void>;
    setShowOtpVerification: (show: boolean) => void;
    setShowForgotPassword: (show: boolean) => void;
  }
  
  export interface NewPasswordFormProps extends CommonProps {
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (show: boolean) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (password: string) => void;
    errors: {
      password?: string;
      confirmPassword?: string;
    };
    handleNewPassword: (e: React.FormEvent) => Promise<void>;
    showSuccessModal: boolean;
    setShowNewPassword: (show: boolean) => void;
    getInputStyle: (fieldError?: string) => string;
  }