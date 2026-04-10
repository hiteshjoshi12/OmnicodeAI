import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import CallToAction from '../components/CallToAction';

export default function LandingPage() {
  return (
  
    <div className="w-full bg-slate-950 font-sans text-slate-50 overflow-x-hidden selection:bg-indigo-500/30">
      
      <Hero />

      <Features />
      
      <Pricing />
      
      <FAQ /> 
      
      <CallToAction />
      
    </div>
  );
}