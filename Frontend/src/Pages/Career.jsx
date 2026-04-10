import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// Job Data
const jobs = [
  { title: "Frontend Developer", type: "Full Time", location: "Remote" },
  { title: "Backend Developer", type: "Full Time", location: "Remote" },
  { title: "UI/UX Designer", type: "Internship", location: "Remote" },
  { title: "Product Manager", type: "Full Time", location: "Remote" },
  { title: "AI Researcher", type: "Full Time", location: "Remote" },
  { title: "DevOps Engineer", type: "Full Time", location: "Remote" },
];

export default function Careers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f2a] relative overflow-hidden">

      {/* 🔥 Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* ✨ Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10">

        {/* HERO */}
        <section className="relative py-28 px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              Build Your Career With Us 🚀
            </h1>
            <p className="text-lg font-semibold text-slate-300 max-w-2xl mx-auto">
              Join a fast-growing team building the future of AI-powered development tools.
            </p>
          </motion.div>
        </section>

        {/* WHY WORK WITH US */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

            {[{
              icon: <Users size={28} />,
              title: "Collaborative Culture",
              text: "Work with passionate people who love building amazing products.",
            },
            {
              icon: <Zap size={28} />,
              title: "Fast Growth",
              text: "Level up your skills quickly in a high-impact environment.",
            },
            {
              icon: <Briefcase size={28} />,
              title: "Remote First",
              text: "Work from anywhere with full flexibility and freedom.",
            }].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-white/20 shadow-lg transition"
              >
                <div className="text-indigo-400 mb-4">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm font-semibold text-slate-400">{item.text}</p>
              </motion.div>
            ))}

          </div>
        </section>

        {/* JOB LIST */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">

            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">
                Open Positions
              </h2>
              <p className="text-slate-400 font-semibold">
                Find your role and grow with us
              </p>
            </motion.div>

            <div className="space-y-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-indigo-400/40 shadow-md transition flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-white text-lg">{job.title}</h3>
                    <p className="text-sm font-semibold text-slate-400">
                      {job.type} • {job.location}
                    </p>
                  </div>

                  <button
                    onClick={() => window.open("https://www.naukri.com", "_blank")}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    Apply
                  </button>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Didn't find your role?
            </h2>
            <p className="mb-6 font-semibold text-indigo-100">
              We're always open to talented people. Reach out anytime.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition"
            >
              Contact Us
            </button>
          </motion.div>
        </section>

      </div>
    </div>
  );
}