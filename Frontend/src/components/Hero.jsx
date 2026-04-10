import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  const token = localStorage.getItem('omnicode_token');
  
  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    // CHANGED: From bg-slate-50 to bg-slate-950
    <section className="relative pt-32 pb-20 px-6 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden min-h-screen flex items-center">
      
      {/* Decorative Background Blobs - CHANGED: Richer, darker glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full" />
        {/* Added a center glow for depth */}
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center w-full">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* Animated Badge - CHANGED: Dark glass look */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 md:mb-10 text-xs md:text-sm font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-sm hover:bg-indigo-500/20 transition-colors backdrop-blur-sm">
              <Sparkles className="text-indigo-400 animate-pulse" size={16} />
              <span className="tracking-wider uppercase">v2.0: Faster Code Generation</span>
            </div>
          </motion.div>

          {/* Main Headline - CHANGED: Text to white, adjusted gradient for dark mode */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-[950] text-white tracking-tighter leading-[1.05] mb-6 md:mb-8"
          >
            Build Faster with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Omnicode AI
            </span>
          </motion.h1>

          {/* Subheadline - CHANGED: Text to slate-400 */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 md:mb-12 font-medium leading-relaxed"
          >
            The multi-language prompt-driven engine for code, documentation, and app generation. 
            One prompt. Infinite possibilities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="mb-20">
            {token ? (
              <Link to="/dashboard" className="inline-block outline-none">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg md:text-xl px-10 py-4 md:px-12 md:py-5 rounded-2xl shadow-[0_8px_30px_rgb(79,70,229,0.4)] transition-all hover:-translate-y-1 active:scale-95 outline-none focus:ring-4 focus:ring-indigo-500/50 border border-indigo-500/50">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/register" className="inline-block outline-none">
                <button className="bg-white hover:bg-slate-100 text-slate-950 font-black text-lg md:text-xl px-10 py-4 md:px-12 md:py-5 rounded-2xl shadow-[0_8px_30px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-1 active:scale-95 outline-none focus:ring-4 focus:ring-white/50">
                  Get Started for Free
                </button>
              </Link>
            )}
          </motion.div>

          {/* PRODUCT PREVIEW MOCKUP - CHANGED: Darker glass boundary */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
          >
            <motion.div 
              variants={floatVariants}
              animate="animate"
              className="bg-[#0d1117] rounded-2xl aspect-video overflow-hidden flex flex-col shadow-2xl border border-white/10"
            >
              {/* Browser Top Bar */}
              <div className="flex gap-2 p-4 bg-[#161b22] border-b border-white/5 items-center">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 text-xs font-mono text-slate-400">omnicode_controller.js</span>
              </div>
              
              {/* Code Preview */}
              <div className="p-6 text-left font-mono text-sm md:text-base leading-relaxed overflow-hidden">
                <p className="text-slate-500 mb-2">// Creating a MERN stack controller...</p>
                <p className="text-slate-300">
                  <span className="text-indigo-400">export const</span> <span className="text-amber-300">createProject</span> = <span className="text-indigo-400">async</span> (req, res) <span className="text-indigo-400">=&gt;</span> {"{"}
                </p>
                <p className="text-slate-300 ml-6">
                  <span className="text-indigo-400">const</span> {"{ title, description }"} = req.body;
                </p>
                <p className="ml-6 mt-2 italic text-slate-500">// AI is generating logic...</p>
                <p className="text-slate-300 ml-6">
                  <span className="text-indigo-400">const</span> newProject = <span className="text-indigo-400">await</span> Project.<span className="text-amber-300">create</span>({"{"} title, description {"}"});
                </p>
                <p className="text-slate-300 ml-6 mt-2">
                  <span className="text-indigo-400">return</span> res.<span className="text-amber-300">status</span>(<span className="text-emerald-400">201</span>).<span className="text-amber-300">json</span>(newProject);
                </p>
                <p className="text-slate-300">{"}"}</p>
                
                {/* Typing cursor simulation */}
                <motion.div 
                  className="w-2.5 h-5 bg-indigo-500 ml-6 mt-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}