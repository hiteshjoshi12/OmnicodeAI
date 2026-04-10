import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Twitter, Linkedin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export default function Footer() {
  const location = useLocation();
  
  // --- Newsletter State ---
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const apiUrl = import.meta.env.VITE_API_URL;


  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${apiUrl}/api/newsletter/subscribe`, { email });
      setStatus({ type: 'success', message: 'Thanks for subscribing!' });
      setEmail(''); // Clear input on success
      
      // Clear success message after 5 seconds
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to subscribe. Try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Hide the footer inside the App Workspaces
  const hiddenRoutes = ['/dashboard', '/profile', '/profile/view','/admin'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null; 
  }

  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16"
        >
          
          {/* Brand & Description */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-6 inline-flex outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg group">
              <div className="bg-indigo-600 p-1.5 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:bg-indigo-500 transition-colors">
                <Code2 size={20} className="text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Omnicode AI
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              The ultimate prompt-driven platform for developers. Ship faster, build better, and let AI handle the heavy lifting of boilerplate code.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/" target='_blank' rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                <Github size={20} strokeWidth={1.5} />
              </a>
              <a href="https://x.com/" target='_blank' rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                <Twitter size={20} strokeWidth={1.5} />
              </a>
              <a href="https://linkedin.com/" target='_blank' rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Product</h3>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'API Docs', 'Changelog'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors outline-none focus-visible:text-indigo-400">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants} className="lg:col-span-4 md:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">
              Subscribe to updates
            </h3>
            <p className="text-sm font-medium text-slate-400 mb-4 leading-relaxed">
              Get the latest news, articles, and resources delivered straight to your inbox every month.
            </p>
            
            {/* --- WIRED FORM --- */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="flex-1 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all"
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] sm:w-auto w-full whitespace-nowrap outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Subscribe"}
              </button>
            </form>

            {/* --- STATUS MESSAGE --- */}
            <AnimatePresence>
              {status.message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className={`mt-3 flex items-center gap-2 text-sm font-bold ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} Omnicode AI, Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-300 tracking-wide">
              All systems operational
            </span>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}