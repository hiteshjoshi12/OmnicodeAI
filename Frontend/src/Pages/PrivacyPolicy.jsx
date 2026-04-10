import React from "react";
import { motion } from "framer-motion";

// Animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0b0f2a] relative px-6 py-20 overflow-hidden">

      {/* 🔥 Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* ✨ Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full"></div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* HERO */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16 relative"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy 🔐
          </h1>
          <p className="text-slate-300 font-semibold max-w-2xl mx-auto">
            We value your trust. Here's how Omnicode AI protects and manages your data.
          </p>

          {/* Glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full"></div>
        </motion.div>

        {/* CONTENT CARD */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-8 md:p-10 space-y-10"
        >

          {/* Section */}
          {/* 1 */}
<div className="group">
  <h2 className="text-xl font-bold text-indigo-400 mb-2">
    1. Information We Collect
  </h2>
  <p className="text-slate-300 font-semibold leading-relaxed">
    We collect personal details such as your name, email address, and account
    activity when you register or use our platform. This also includes usage
    data like features accessed, interactions, and preferences to improve our services.
  </p>
</div>

{/* 2 */}
<div className="group">
  <h2 className="text-xl font-bold text-indigo-400 mb-2">
    2. How We Use Your Data
  </h2>
  <p className="text-slate-300 font-semibold leading-relaxed">
    Your data is used to provide, maintain, and improve our services. We use it
    to personalize your experience, enhance platform performance, and communicate
    important updates or notifications related to your account.
  </p>
</div>

{/* 3 */}
<div className="group">
  <h2 className="text-xl font-bold text-indigo-400 mb-2">
    3. Data Protection
  </h2>
  <p className="text-slate-300 font-semibold leading-relaxed">
    We implement strong security measures including encryption, secure servers,
    and authentication systems to protect your data from unauthorized access,
    misuse, or disclosure.
  </p>
</div>

{/* 4 */}
<div className="group">
  <h2 className="text-xl font-bold text-indigo-400 mb-2">
    4. Third-Party Services
  </h2>
  <p className="text-slate-300 font-semibold leading-relaxed">
    We may use trusted third-party services such as analytics tools or payment
    gateways. These services may collect limited data as required to function,
    but they are governed by their own privacy policies.
  </p>
</div>

{/* 5 */}
<div className="group">
  <h2 className="text-xl font-bold text-indigo-400 mb-2">
    5. Cookies
  </h2>
  <p className="text-slate-300 font-semibold leading-relaxed">
    Cookies are used to enhance your browsing experience by remembering your
    preferences and login sessions. You can disable cookies through your browser
    settings, though some features may not function properly.
  </p>
</div>

{/* 6 */}
<div className="group">
  <h2 className="text-xl font-bold text-indigo-400 mb-2">
    6. Policy Updates
  </h2>
  <p className="text-slate-300 font-semibold leading-relaxed">
    We may update this Privacy Policy from time to time to reflect changes in
    our practices or legal requirements. Any updates will be posted here with
    the revised date for transparency.
  </p>
</div>

          {/* CONTACT BOX */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold mb-2">Need Help?</h2>
            <p className="text-sm font-semibold text-indigo-100">
              If you have any questions regarding this policy, feel free to reach out.
            </p>
            <p className="mt-2 font-bold">support@omnicode.ai</p>
          </div>

        </motion.div>

        {/* FOOTER */}
        <p className="text-center text-xs text-slate-400 mt-10 font-medium">
          Last updated: 2026
        </p>

      </div>
    </div>
  );
}