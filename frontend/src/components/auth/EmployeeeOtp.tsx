import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { setTimer, decrementTimer } from "../../redux/slices/otpSlice";
import image from "../../images/images";
import { login } from "../../redux/slices/employeeSlice";
import axios from "axios";
//fskaduhiusdagfjgsdjkayfgj sdajhfg ds
const EmployeeOtp: React.FC = () => {
  const [otp, setOtp] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false); // Loading state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = (useLocation().state as { email: string })?.email;
  const timer = useSelector((state: RootState) => state.otp.timer);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const otpArray = otp.split("");
      otpArray[index] = value;
      setOtp(otpArray.join(""));

      if (index < 5 && value !== "") {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpDelete = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const otpArray = otp.split("");
      otpArray[index] = "";
      setOtp(otpArray.join(""));
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, dispatch]);

  const handleResendOtp = async () => {
    if (timer === 0) {
      console.log("Resending OTP...");
      dispatch(setTimer(90)); // Reset timer to 90 seconds

      try {
        setLoading(true); // Start loading
        const response = await axios.post("https://backend.aadil.online/authentication-service/api/employee/employee-resendotp", {
          email,
        });
        setLoading(false); // Stop loading

        if (response.data.success) {
          setSuccessMessage("OTP resent successfully.");
        } else {
          setErrorMessage(response.data.message || "Failed to resend OTP.");
        }
      } catch (error) {
        setLoading(false); // Stop loading
        console.error("Error resending OTP:", error);
        setErrorMessage("An error occurred while resending OTP.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP.");
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await axios.post("https://backend.aadil.online/authentication-service/api/employee/employee-validateotp", 
        {email,otp},{ withCredentials: true });
      setLoading(false); // Stop loading
      console.log("Response data:", response.data);
      if (response.data.success) {
        setSuccessMessage(response.data.message || "OTP validated successfully.");
        dispatch(login({ role: "employee", isAuthenticated: true , position: response.data.position, workTime: response.data.workTime,workTimer: response.data.workTimer }));
        dispatch(setTimer(0)); // Clear the timer from Redux
        navigate("/employee/dashboard");
      } else {
        setErrorMessage(response.data.message || "Failed to validate OTP. Please try again.");
      }
    } catch (error) {
      setLoading(false); // Stop loading
      console.error("Error validating OTP:", error);
      setErrorMessage("An error occurred while validating OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <div className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl">
        <div className="w-full md:w-3/5 p-5 md:px-16 sm:px-8">
          <div className="text-left font-bold mb-8">
            <img src={image.navBarLogo} alt="Logo" className="w-20 h-auto" />
          </div>
          <div className="py-6 text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-500">Verify OTP</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 mb-4"></div>
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-xs mx-auto">
              <div className="flex space-x-2 mb-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md text-black"
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpDelete(e, index)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-full font-semibold"
                disabled={loading} // Disable button when loading
              >
                {loading ? "Loading..." : "Validate OTP"}
              </button>
              <div className="text-center mt-4">
                <span
                  onClick={handleResendOtp}
                  className={`text-sm ${timer > 0 ? "text-gray-500" : "text-blue-500 cursor-pointer hover:underline"}`}
                >
                  {loading ? "Loading..." : `Resend OTP ${timer > 0 ? `(Available in ${timer}s)` : ""}`}
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full md:w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-16 sm:py-36 px-12 flex flex-col justify-center items-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Hello,👋Employee</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="mb-4 text-center text-sm sm:text-base">Enter the OTP sent to your email to proceed.</p>
          <a
            href="/"
            className="border-2 border-white rounded-full px-12 py-2 font-semibold hover:bg-white hover:text-blue-500 transition-colors"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOtp;
