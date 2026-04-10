import React, { useState } from "react";
import { motion } from "framer-motion";

// Animation
const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ApiDocsModern() {
  const [activeTab, setActiveTab] = useState("intro");

  const tabs = [
    { id: "intro", label: "Introduction" },
    { id: "auth", label: "Authentication" },
    { id: "endpoints", label: "Endpoints" },
    { id: "example", label: "Example" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f2a] text-white relative overflow-hidden pt-24">

      {/* 🔥 Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* ✨ Glow */}
      <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mb-10">
        <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
        <p className="text-slate-400">
          Simple and powerful APIs to integrate Omnicode AI into your apps.
        </p>
      </div>

      {/* TABS */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">

        {/* INTRO */}
        {activeTab === "intro" && (
          <motion.div variants={fade} initial="hidden" animate="visible">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-3">Introduction</h2>
              <p className="text-slate-400">
                Build faster with AI — integrate Omnicode to automate coding and streamline your workflow.
              </p>
            </div>
          </motion.div>
        )}

        {/* AUTH */}
        {activeTab === "auth" && (
          <motion.div variants={fade} initial="hidden" animate="visible">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-3">Authentication</h2>
              <p className="text-slate-400 mb-4">
                Use your API key in the Authorization header.
              </p>

              <div className="bg-black/40 p-4 rounded-lg font-mono text-green-400 text-sm">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>
          </motion.div>
        )}

        {/* ENDPOINTS */}
        {activeTab === "endpoints" && (
          <motion.div variants={fade} initial="hidden" animate="visible" className="space-y-6">

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-indigo-400 font-bold mb-2">
                POST /api/auth/login
              </h3>
              <p className="text-slate-400 mb-3">
                Login user and receive a token.
              </p>

              <pre className="bg-black/40 p-4 rounded-lg text-sm text-slate-300">
{`{
  "email": "user@example.com",
  "password": "12345678"
}`}
              </pre>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-indigo-400 font-bold mb-2">
                POST /api/auth/register
              </h3>
              <p className="text-slate-400 mb-3">
                Create a new account.
              </p>

              <pre className="bg-black/40 p-4 rounded-lg text-sm text-slate-300">
{`{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "12345678"
}`}
              </pre>
            </div>

          </motion.div>
        )}

        {/* EXAMPLE */}
        {activeTab === "example" && (
          <motion.div variants={fade} initial="hidden" animate="visible">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-3">Example Request</h2>

              <pre className="bg-black/40 p-4 rounded-lg text-green-400 text-sm">
{`curl -X POST http://localhost:5000/api/auth/login \\
-H "Content-Type: application/json" \\
-d '{"email":"user@example.com","password":"12345678"}'`}
              </pre>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}