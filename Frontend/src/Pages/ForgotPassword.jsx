import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Ensure you have this route set up on your backend!
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      
      // Show the success state animation
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f2a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex justify-center mb-8 group outline-none">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
            <Code2 className="text-white" size={32} />
          </div>
        </Link>
        
        <h2 className="text-center text-3xl font-black text-white mb-2 tracking-tight">
          Reset your password
        </h2>
        <p className="text-center text-sm text-slate-400">
          We'll send you an email with instructions to reset it.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl py-10 px-6 sm:px-10 rounded-[2.5rem] border border-white/10 shadow-2xl">

          <AnimatePresence mode="wait">
            {/* SUCCESS STATE */}
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Check your inbox</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  We've sent a password reset link to <strong className="text-slate-200">{email}</strong>. Please check your spam folder if you don't see it within a few minutes.
                </p>
                <Link to="/login" className="w-full">
                  <button className="w-full flex justify-center items-center gap-2 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/5 outline-none focus:ring-2 focus:ring-indigo-500">
                    <ArrowLeft size={18} />
                    Back to login
                  </button>
                </Link>
              </motion.div>
            ) : (
              /* FORM STATE */
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3 rounded-xl text-sm font-bold text-red-400">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  
                  {/* Email */}
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white/10"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-70 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0b0f2a]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending Link...
                      </>
                    ) : "Send Reset Link"}
                  </button>

                  {/* Back to Login */}
                  <div className="text-center mt-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 font-bold hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1">
                      <ArrowLeft size={16} />
                      Back to login
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}