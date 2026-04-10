import React from "react";
import { motion } from "framer-motion";

// Animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0b0f2a] text-white px-6 py-20 relative overflow-hidden">

      {/* 🔥 Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* ✨ Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* HERO */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service 📜
          </h1>
          <p className="text-slate-300 font-semibold max-w-2xl mx-auto">
            Please read these terms carefully before using Omnicode AI.
          </p>
        </motion.div>

        {/* CONTENT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-8 md:p-10 space-y-10"
        >

          {/* Section */}
          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing and using Omnicode AI, you agree to comply with and
              be bound by these terms and conditions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-2">
              2. Use of the Platform
            </h2>
            <p className="text-slate-300 leading-relaxed">
              You agree to use the platform only for lawful purposes and not
              misuse or attempt to disrupt our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-2">
              3. User Accounts
            </h2>
            <p className="text-slate-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account credentials and all activities under your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-2">
              4. Intellectual Property
            </h2>
            <p className="text-slate-300 leading-relaxed">
              All content, features, and functionality are the property of
              Omnicode AI and are protected by applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-2">
              5. Limitation of Liability
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We are not liable for any damages or losses resulting from the use
              or inability to use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-2">
              6. Termination
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate
              our terms without prior notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-2">
              7. Changes to Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We may update these terms from time to time. Continued use of the
              platform means you accept the updated terms.
            </p>
          </div>

          {/* CONTACT BOX */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold mb-2">Questions?</h2>
            <p className="text-sm text-indigo-100">
              Contact us if you need clarification about our terms.
            </p>
            <p className="mt-2 font-bold">support@omnicode.ai</p>
          </div>

        </motion.div>

        {/* FOOTER NOTE */}
        <p className="text-center text-xs text-slate-400 mt-10">
          Last updated: 2026
        </p>

      </div>
    </div>
  );
}