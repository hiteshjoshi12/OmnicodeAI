import React from "react";
import { motion } from "framer-motion";

// Enhanced Data with tags
const changelogData = [
  {
    version: "v1.2.0",
    date: "March 2026",
    changes: [
      { type: "new", text: "Smart prompt suggestions" },
      { type: "improved", text: "Improved UI responsiveness" },
      { type: "improved", text: "Better error handling system" },
      { type: "fixed", text: "Dashboard widget bugs fixed" },
    ],
    highlight: true,
  },
  {
    version: "v1.1.0",
    date: "February 2026",
    changes: [
      { type: "new", text: "User authentication system" },
      { type: "new", text: "Secure JWT-based login" },
      { type: "improved", text: "Dashboard redesign" },
      { type: "fixed", text: "Login & session issues resolved" },
    ],
  },
  {
    version: "v1.0.0",
    date: "January 2026",
    changes: [
      { type: "new", text: "Initial release of Omnicode AI 🎉" },
      { type: "new", text: "Prompt-based code generation" },
      { type: "new", text: "Basic API integration" },
      { type: "improved", text: "Core system stability improvements" },
    ],
  },
];

// Badge styles (dark adjusted)
const badgeStyles = {
  new: "bg-emerald-500/10 text-emerald-400",
  improved: "bg-blue-500/10 text-blue-400",
  fixed: "bg-rose-500/10 text-rose-400",
};

// Animation
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-[#0b0f2a] text-white py-20 px-6 relative overflow-hidden">

      {/* 🔥 Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* ✨ Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-black mb-4">
            Changelog
          </h1>
          <p className="text-slate-400 font-medium text-lg">
            Track all updates, improvements, and fixes in Omnicode AI
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative border-l-2 border-white/10 ml-4"
        >
          {changelogData.map((log, index) => (
            <motion.div
              key={index}
              variants={item}
              className="mb-12 ml-6 relative"
            >
              {/* Timeline Dot */}
              <span className="absolute -left-[34px] top-2 w-4 h-4 bg-indigo-500 rounded-full border-4 border-[#0b0f2a] shadow"></span>

              {/* Card */}
              <div
                className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:shadow-xl ${
                  log.highlight
                    ? "bg-indigo-500/10 border-indigo-500/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {/* Version + Date */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-indigo-400">
                    {log.version}
                    {log.highlight && (
                      <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                        Latest
                      </span>
                    )}
                  </h2>
                  <span className="text-sm text-slate-400 font-medium">
                    {log.date}
                  </span>
                </div>

                {/* Changes */}
                <ul className="space-y-3">
                  {log.changes.map((change, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${badgeStyles[change.type]}`}
                      >
                        {change.type}
                      </span>
                      <span className="text-sm text-slate-300 font-medium">
                        {change.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}