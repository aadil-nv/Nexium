import React from 'react'
import Navbar from '../../components/landing/landingPage/Navbar'
import NewPassword from '../../components/landing/LandingLogin/NewPassword'
import Footer from '../../components/landing/landingPage/Footer'
import ForgotPasswordPage from '../../components/landing/LandingLogin/VerifyEmail'

export default function LandingNewPasswordPage() {
  return (
    <div>
    <Navbar />
    <NewPassword />
    <Footer />
    </div>
  )
}
