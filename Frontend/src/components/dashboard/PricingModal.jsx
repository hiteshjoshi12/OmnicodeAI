import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate

export default function PricingModal({ isOpen, onClose }) {
  const navigate = useNavigate(); // <-- 2. Initialize it

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose(); // Close the modal first
    navigate('/pricing'); // Then route them to the pricing page!
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Left Side: Copy */}
          <div className="flex-1 p-8 md:p-10 bg-slate-50 flex flex-col justify-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={24} className="fill-indigo-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
              You're out of credits!
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              Don't let your workflow stop here. Upgrade your plan to instantly unlock more generations, premium models, and priority support.
            </p>
            <ul className="space-y-3 mb-8">
              {['Unlimited Code Generation', 'Priority AI Processing', 'Commercial Usage Rights', 'Early Access to New Features'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Pricing Card */}
          <div className="w-full md:w-[400px] p-8 md:p-10 bg-white flex flex-col justify-center border-l border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-black uppercase tracking-widest rounded-full w-max mb-6">
              <Crown size={14} /> Pro Plan
            </div>
            
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-black text-slate-900">₹499</span>
              <span className="text-slate-500 font-bold">/month</span>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-8">Billed monthly. Cancel anytime.</p>

            <button 
              onClick={handleUpgradeClick} // <-- 3. Trigger the navigation function
              className="w-full py-4 px-6 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
            >
              View Pricing Plans
            </button>
            <p className="text-center text-xs text-slate-400 font-medium mt-4">
              Secure payment processed by Razorpay.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}