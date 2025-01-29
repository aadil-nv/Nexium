
import Navbar from "../../components/landing/landingPage/Navbar";
import Home from "../../components/landing/landingPage/Home";
import Features from "../../components/landing/landingPage/LandingFeatures";
import Servies from "../../components/landing/landingPage/Services";
import Contact from "../../components/landing/landingPage/LandingContact";
import Footer from "../../components/landing/landingPage/Footer";

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
