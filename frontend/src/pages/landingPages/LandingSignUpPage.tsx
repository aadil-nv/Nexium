import React from "react";
import Navbar from "../../components/landing/landingPage/Navbar";
import Footer from "../../components/landing/landingPage/Footer";
import SignUp from "../../components/landing/landingSignup/SignUp";


export default function LandingSignUpPage() {
  return (
    <>
      <Navbar />
      <SignUp/>
      <Footer />
    </>
  );
}
