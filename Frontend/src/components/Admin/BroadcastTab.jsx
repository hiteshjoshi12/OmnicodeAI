import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Megaphone, Send, Loader2, Users, Sparkles } from 'lucide-react';

export default function BroadcastTab() {
  const [prompt, setPrompt] = useState('');
  
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('omnicode_token');
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users || response.data); 
      } catch (error) {
        console.error("Failed to load users for broadcast", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    
    if (users.length === 0) {
      alert("No users found to send the broadcast to.");
      return;
    }

    const confirmSend = window.confirm(`Gemini will generate and send this email to all ${users.length} users immediately. Continue?`);
    if (!confirmSend) return;

    setSending(true);

    try {
      const emailList = users.map(u => u.email);

      const n8nWebhookUrl = 'https://sushib.app.n8n.cloud/webhook/broadcast';

      // We now only send the prompt and the emails
      await axios.post(n8nWebhookUrl, {
        prompt: prompt,
        emails: emailList
      });

      alert("Prompt sent! Gemini is writing and broadcasting the emails now.");
      setPrompt('');
    } catch (error) {
      console.error("Broadcast failed", error);
      alert("Failed to send broadcast. Check the console and n8n logs.");
    } finally {
      setSending(false);
    }
  };

  if (loadingUsers) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;
  }

  return (
    <motion.div
      key="broadcast"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-indigo-500" size={28} />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Broadcast Agent</h2>
            </div>
            <p className="text-slate-500 font-medium">
              Give Gemini a topic, and it will auto-write and send a professional email to your users.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
            <Users size={18} className="text-indigo-600" />
            <span className="font-bold text-indigo-900">{users.length} Eligible Users</span>
          </div>
        </div>

        <form onSubmit={handleSendBroadcast} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Instructions for Gemini</label>
            <textarea 
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="6"
              placeholder="e.g., Write a short, exciting email announcing that we just added image generation to the Pro plan. Tell them to log in and try it today."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all shadow-sm resize-y"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit"
              disabled={sending || users.length === 0}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-[15px] font-black rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all active:scale-95 outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70 disabled:active:scale-100"
            >
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} 
              {sending ? 'Generating & Sending...' : 'Generate & Broadcast'}
            </button>
          </div>
        </form>

      </div>
    </motion.div>
  );
}