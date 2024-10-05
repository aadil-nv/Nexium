import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import LandingLoginPage from './Pages/LandingPage/LandingLoginPage';
import SignUp from './Pages/LandingPage/LandingSignUpPage';
import AdminDashBoard from './Pages/AdminDashBoard/AdminDashBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingLoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/super-admin" element={<AdminDashBoard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
