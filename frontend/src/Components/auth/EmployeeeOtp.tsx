import React, { useState, useRef } from "react";
import { FaEnvelope } from "react-icons/fa";
import image from "../../images/images";

const EmployeeOtp: React.FC = () => {
  const [otp, setOtp] = useState<string>("");  // OTP state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);  // Reference for input fields

  // Handle OTP change and move focus
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    // Allow only one digit and ensure it's a number
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const otpArray = otp.split("");
      otpArray[index] = value;  // Update OTP value at the correct index
      setOtp(otpArray.join(""));

      // Move focus to the next input if digit is entered and index is not the last one
      if (index < 5 && value !== "") {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle OTP input when deleting
  const handleOtpDelete = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        // If the current input is empty, move focus to the previous input
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // If the current input has a value, clear it and update OTP state
        const otpArray = otp.split("");
        otpArray[index] = "";  // Clear current input
        setOtp(otpArray.join(""));  // Update the OTP state

        // Move focus to the previous input after clearing the current one
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate OTP logic here
    console.log("OTP submitted:", otp);
  };

  // Resend OTP
  const handleResendOtp = () => {
    // Logic to resend OTP
    console.log("Resending OTP...");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <div className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left side: OTP Section */}
        <div className="w-full md:w-3/5 p-5 md:px-16 sm:px-8">
          <div className="text-left font-bold mb-8">
            <img src={image.navBarLogo} alt="Logo" className="w-20 h-auto" />
          </div>
          <div className="py-6 text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-500">Verify OTP</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 mb-4"></div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-xs mx-auto">
              <div className="flex space-x-2 mb-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)} // Assigning ref to each input
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md text-black"
                    value={otp[index] || ""}  // Set the value of the input based on OTP state
                    onChange={(e) => handleOtpChange(e, index)}  // Handle OTP change
                    onKeyDown={(e) => handleOtpDelete(e, index)}  // Handle backspace and clearing
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-full font-semibold"
              >
                Validate OTP
              </button>
              <div className="text-center mt-4">
                <span
                  onClick={handleResendOtp}
                  className="text-sm text-blue-500 cursor-pointer hover:underline"
                >
                  Resend OTP
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Right side: Information Section */}
        <div className="w-full md:w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-16 sm:py-36 px-12 flex flex-col justify-center items-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Hello,👋Employee</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="mb-4 text-center text-sm sm:text-base">Enter the OTP sent to your email to proceed.</p>
          <a href="/" className="border-2 border-white rounded-full px-12 py-2 font-semibold hover:bg-white hover:text-blue-500 transition-colors">
            Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOtp;
