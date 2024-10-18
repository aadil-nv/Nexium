import React from 'react';
import Navbar from '../../components/landing/landingPage/Navbar';
import LandingLogin from '../../components/landing/LandingLogin/LandingLogin';
import Footer from '../../components/landing/landingPage/Footer';

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
