import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MailOpen, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp
      });

      if (response.status === 200 || response.status === 201) {
        login(response.data.user, response.data.token);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setResendMessage('');
    
    try {
      // Hits the new backend route we just created!
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      setResendMessage('A new code has been sent!');
      setTimeout(() => setResendMessage(''), 5000); // Clear message after 5s
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-[#0b0f2a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-500/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3.5 rounded-2xl shadow-lg shadow-indigo-500/20">
            <MailOpen className="text-white" size={36} strokeWidth={2} />
          </div>
        </div>
        
        <h2 className="text-3xl font-[900] text-white tracking-tight mb-3">
          Check your email
        </h2>
        <p className="text-base text-slate-400 font-medium leading-relaxed">
          We sent a 6-digit code to <br/>
          <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{email}</span>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl py-10 px-6 shadow-2xl rounded-[2rem] border border-white/10 sm:px-10">
          
          <AnimatePresence>
            {/* Error Banner */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3 rounded-xl text-sm font-bold text-red-400">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <p className="leading-tight">{error}</p>
                </div>
              </motion.div>
            )}
            
            {/* Success Banner for Resend */}
            {resendMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-emerald-400">
                  <CheckCircle2 size={18} />
                  {resendMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-4 text-center uppercase tracking-wider">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full px-4 py-4 rounded-2xl border border-white/10 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-white font-black text-center text-3xl tracking-[0.5em] sm:tracking-[1em] font-mono shadow-sm bg-white/5 focus:bg-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] bg-indigo-600 text-white text-lg font-black hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 outline-none focus:ring-4 focus:ring-indigo-500/30"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400 font-medium flex items-center justify-center gap-1.5">
              Didn't receive the email?
              <button 
                onClick={handleResend}
                disabled={resending}
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded disabled:opacity-50"
              >
                {resending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                {resending ? 'Sending...' : 'Resend'}
              </button>
            </p>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}