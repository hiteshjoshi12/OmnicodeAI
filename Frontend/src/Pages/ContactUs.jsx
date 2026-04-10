import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

// Animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field-specific error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.length < 10) {
      newErrors.message = "Minimum 10 characters required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: "", message: "" });
    
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        // 🔴 CREATE A NEW WEBHOOK URL IN N8N FOR THIS 🔴
        const n8nContactWebhook = "https://sushib.app.n8n.cloud/webhook/contact-us";
        
        await axios.post(n8nContactWebhook, form);
        
        setSubmitStatus({ type: "success", message: "Message sent successfully! We'll be in touch soon." });
        setForm({ name: "", email: "", message: "" });
      } catch (err) {
        setSubmitStatus({ 
          type: "error", 
          message: err.response?.data?.message || "Failed to send message. Please try again later." 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f2a] relative px-6 py-20 overflow-hidden">

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HERO */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16 relative"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Contact Us <span className="text-indigo-400">.</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">
            Have questions or need help? We're here for you.
          </p>

          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT (Contact Info) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex items-center gap-5 shadow-lg">
              <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Mail className="text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Email</h3>
                <p className="text-sm font-medium text-slate-400">
                  support@omnicode.ai
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex items-center gap-5 shadow-lg">
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Phone className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Phone</h3>
                <p className="text-sm font-medium text-slate-400">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex items-center gap-5 shadow-lg">
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <MapPin className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Location</h3>
                <p className="text-sm font-medium text-slate-400">
                  India
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT (Form) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {submitStatus.type === "success" ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400">{submitStatus.message}</p>
                  <button 
                    onClick={() => setSubmitStatus({ type: "", message: "" })}
                    className="mt-8 px-6 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6" noValidate>
                  
                  {submitStatus.type === "error" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 flex gap-3 rounded-xl text-sm font-bold text-red-400">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <p>{submitStatus.message}</p>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full p-3.5 rounded-xl bg-white/5 border ${errors.name ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10 focus:ring-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full p-3.5 rounded-xl bg-white/5 border ${errors.email ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10 focus:ring-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Message</label>
                    <textarea
                      name="message"
                      rows="4"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className={`w-full p-3.5 rounded-xl bg-white/5 border ${errors.message ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10 focus:ring-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-none`}
                    ></textarea>
                    {errors.message && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex justify-center items-center gap-2 disabled:opacity-70 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0b0f2a]"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}