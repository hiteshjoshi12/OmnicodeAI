import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL; // <-- Get API URL from environment variable

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
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
      await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { 
        password: formData.password 
      });
      
      setSuccess(true);
      // Automatically redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token. Please try requesting a new link.');
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
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <Link to="/" className="flex justify-center mb-8 group outline-none">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
            <Code2 className="text-white" size={32} />
          </div>
        </Link>
        
        <h2 className="text-center text-3xl font-black text-white mb-2 tracking-tight">
          Create new password
        </h2>
        <p className="text-center text-sm text-slate-400">
          Your new password must be different from previous used passwords.
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
                <h3 className="text-xl font-bold text-white mb-3">Password Reset!</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Your password has been successfully updated. Redirecting you to login...
                </p>
                <Loader2 className="animate-spin text-indigo-500" size={24} />
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                
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
                  
                  {/* New Password */}
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">New Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white/10"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-70 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {loading ? <><Loader2 className="animate-spin" size={18} /> Updating...</> : "Reset Password"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}