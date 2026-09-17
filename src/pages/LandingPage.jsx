import React from "react";

import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Security from "../components/landing/Security";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Security />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;