import React from 'react';
import Navbar from '../../Components/Landing/landingPage/Navbar';
import LandingLogin from '../../Components/Landing/LandingLogin/LandingLogin';
import Footer from '../../Components/Landing/landingPage/Footer';

const LandingLoginPage: React.FC = () => {
  return (
   
     <>
     <Navbar />
     <LandingLogin />
     <Footer />
     </>
      
 
  );
}

export default LandingLoginPage;
