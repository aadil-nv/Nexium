import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import image from "../../images/images";

const EmployeeLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/authentication/api/employee/employee-login",
        { email, password }
      );
      // Handle the response after successful login
      console.log("Login successful:", response.data);
      // Redirect or update the UI as needed
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Show the error message from the backend
        setError(err.response.data.message || "An error occurred.");
      } else {
        // Show a general error message if the error is not from the backend
        setError("An error occurred while logging in.");
      }
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
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-500">Employee Login</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 mb-4"></div>
            <form onSubmit={handleLogin} className="flex flex-col items-center w-full max-w-xs mx-auto">
              <div className="bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 border-gray-300">
                <FaEnvelope className="text-gray-400 m-2" />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-100 outline-none text-sm text-black flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="bg-gray-100 w-full p-2 flex items-center mb-3 rounded-md border-2 border-gray-300 relative">
                <FaLock className="text-gray-400 m-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-gray-100 outline-none text-sm text-black flex-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2"
                >
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </div>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              <button
                type="submit"
                className="w-full pt-2 border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 font-semibold"
              >
                Login
              </button>
            </form>
          </div>
        </div>
        <div className="w-full md:w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-16 sm:py-36 px-12 flex flex-col justify-center items-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Hello,👋Employee</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="mb-4 text-center text-sm sm:text-base">Welcome back, please log in to your account</p>
          <a href="/" className="border-2 border-white rounded-full px-12 py-2 font-semibold hover:bg-white hover:text-blue-500 transition-colors">
            Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;