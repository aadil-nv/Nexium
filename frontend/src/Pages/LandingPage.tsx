import React from "react";
import { ThemeProvider } from "../Components/landingPage/theme-provider";
import Navbar from "../Components/landingPage/Navbar";
import Home from "../Components/landingPage/Home";
import Features from "../Components/landingPage/LandingFeatures";
import Servies from "../Components/landingPage/Services";
import Contact from "../Components/landingPage/LandingContact";
import Footer from "../Components/landingPage/Footer";

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
