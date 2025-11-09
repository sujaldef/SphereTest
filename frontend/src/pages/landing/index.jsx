import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import SphereConcept from './components/SphereConcept';
import Features from './components/Features';
import DemoPreview from './components/DemoPreview';;
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className="bg-[#FBF9F1] text-black font-sans ">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <SphereConcept />
        <Features />
        <DemoPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}