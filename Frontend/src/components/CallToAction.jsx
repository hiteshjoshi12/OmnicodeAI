import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // <-- 1. Import your auth context

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

export default function CallToAction() {
  const { user } = useAuth(); // <-- 2. Get the logged-in user

  return (
    <section className="relative bg-slate-950 py-32 px-6 text-center overflow-hidden">
      
      {/* Premium Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          {/* 3. Dynamic Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-tight"
          >
            {user ? (
              <>Ready to build your next <br className="hidden md:block" /> masterpiece?</>
            ) : (
              <>Ready to join the future <br className="hidden md:block" /> of coding?</>
            )}
          </motion.h2>
          
          {/* 4. Dynamic Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl font-medium leading-relaxed"
          >
            {user 
              ? "Jump right back into your workspace and pick up where you left off."
              : "Join thousands of developers automating the boring stuff. No credit card required to start."
            }
          </motion.p>
          
          {/* 5. Dynamic Button and Link */}
          <motion.div variants={itemVariants}>
            <Link to={user ? "/dashboard" : "/register"} className="inline-block outline-none">
              <button className="group flex items-center justify-center gap-3 bg-white text-slate-950 hover:bg-indigo-50 hover:text-indigo-900 font-black text-lg md:text-xl px-10 py-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] outline-none focus:ring-4 focus:ring-white/30">
                {user ? "Go to Dashboard" : "Create Account Now"}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} strokeWidth={2.5} />
              </button>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}