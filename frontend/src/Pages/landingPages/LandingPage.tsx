import React from "react";
import { ThemeProvider } from "../../Components/Landing/landingPage/theme-provider";
import Navbar from "../../Components/Landing/landingPage/Navbar";
import Home from "../../Components/Landing/landingPage/Home";
import Features from "../../Components/Landing/landingPage/LandingFeatures";
import Servies from "../../Components/Landing/landingPage/Services";
import Contact from "../../Components/Landing/landingPage/LandingContact";
import Footer from "../../Components/Landing/landingPage/Footer";

export default function LandPage() {
  return (
    <>
      <Navbar />
      <Home />
      <Features />
      <Servies />
      <Contact />
      <Footer />
    </>
  );
}
