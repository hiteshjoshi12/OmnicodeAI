import React from "react";
import { motion } from "framer-motion";
import { Code2, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const percentage = Math.min(progress / duration, 1);

      const current = end * percentage;
      setCount(current);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

// Animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {

  const navigate = useNavigate();

  const devs = useCounter(10000);
  const lines = useCounter(1000000);
  const uptime = useCounter(99.9);

  return (
    <div className="min-h-screen bg-[#0b0f2a] text-white relative overflow-hidden">

      {/* 🔥 Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* ✨ Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

      {/* HERO */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Building the Future of Development with AI
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Omnicode AI helps developers write better code, faster using intelligent automation and modern tools.
          </p>
        </motion.div>
      </section>

      {/* MISSION */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h2 className="text-2xl font-bold mb-4">
              Our Mission
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We aim to simplify software development by eliminating repetitive work
              and enabling developers to focus on innovation.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg"
          >
            <p className="text-slate-300 leading-relaxed">
              From generating code to optimizing workflows, our platform empowers
              developers to ship faster while maintaining high quality.
            </p>
          </motion.div>

        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-y border-white/10 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          <div>
            <h3 className="text-2xl font-bold text-indigo-400">
              {Math.floor(devs).toLocaleString()}+ </h3>
            <p className="text-sm text-slate-400">Developers</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-indigo-400">
              {Math.floor(lines).toLocaleString()}+
            </h3>
            <p className="text-sm text-slate-400">Lines Generated</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-indigo-400">
              {uptime.toFixed(1)}%
            </h3>
            <p className="text-sm text-slate-400">Uptime</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-indigo-400">24/7</h3>
            <p className="text-sm text-slate-400">Support</p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">

          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">
              Why Choose Omnicode AI
            </h2>
            <p className="text-slate-400">
              Everything you need to build faster and smarter
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">

            <motion.div variants={fadeUp} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:shadow-lg transition">
              <Code2 className="text-indigo-400 mb-4" size={28} />
              <h3 className="font-bold mb-2">
                Smart Code Generation
              </h3>
              <p className="text-sm text-slate-400">
                Generate production-ready code instantly using prompts.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:shadow-lg transition">
              <Zap className="text-indigo-400 mb-4" size={28} />
              <h3 className="font-bold mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-slate-400">
                Speed up your workflow with optimized AI performance.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:shadow-lg transition">
              <Shield className="text-indigo-400 mb-4" size={28} />
              <h3 className="font-bold mb-2">
                Secure Platform
              </h3>
              <p className="text-sm text-slate-400">
                Built with modern security and reliability standards.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 relative z-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Start Building with Omnicode AI
          </h2>
          <p className="mb-6 text-indigo-100">
            Join thousands of developers already using our platform.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition"
          >
            Get Started
          </button>
        </motion.div>
      </section>

    </div>
  );
}