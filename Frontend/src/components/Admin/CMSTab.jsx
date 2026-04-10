import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, MessageSquare, Terminal, DollarSign, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function CMSTab() {
  const [prompts, setPrompts] = useState([]);
  const [editingPromptId, setEditingPromptId] = useState(null);

  const [pricingPlans, setPricingPlans] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  

  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM DB ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/settings`);
        
        // Re-attach JSX icons to the prompts after fetching from DB
        const dbPrompts = response.data.prompts.map(p => ({
          ...p,
          icon: p.id === 1 ? <Terminal size={18} /> : <MessageSquare size={18} />
        }));
        
        setPrompts(dbPrompts);
        setPricingPlans(response.data.pricingPlans);
      } catch (error) {
        console.error("Failed to fetch CMS settings", error);
        alert("Failed to load settings from database.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // --- HANDLERS ---
  const handleSavePrompt = async (id) => {
    try {
      // Strip out the React icon components before sending to MongoDB
      const cleanPrompts = prompts.map(({ icon, ...rest }) => rest);
      
      await axios.put(`${apiUrl}/api/settings`, { prompts: cleanPrompts });
      setEditingPromptId(null);
      alert('Prompt saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save prompt.');
    }
  };

  const handleSavePlan = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/settings`, { pricingPlans });
      setEditingPlanId(null);
      alert('Pricing plan saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save pricing plan.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <motion.div
      key="cms"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-8 pb-10"
    >
      {/* ========================================== */}
      {/* 1. SYSTEM PROMPTS SECTION                  */}
      {/* ========================================== */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">AI System Prompts</h2>
        <p className="text-slate-500 font-medium mb-8">
          Manage the hidden instructions injected into the Gemini API before the user's prompt. 
        </p>

        <div className="space-y-6">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-slate-900 font-bold">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    {prompt.icon}
                  </div>
                  {prompt.name}
                </div>
                
                {editingPromptId === prompt.id ? (
                  <button onClick={() => handleSavePrompt(prompt.id)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-200 transition-colors shadow-sm">
                    <Save size={14} /> Save
                  </button>
                ) : (
                  <button onClick={() => setEditingPromptId(prompt.id)} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
                    <Edit3 size={14} /> Edit
                  </button>
                )}
              </div>

              {editingPromptId === prompt.id ? (
                <textarea 
                  value={prompt.content}
                  onChange={(e) => setPrompts(prompts.map(p => p.id === prompt.id ? {...p, content: e.target.value} : p))}
                  rows="4"
                  className="w-full p-4 bg-white border border-indigo-300 rounded-xl text-[15px] font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none shadow-sm"
                />
              ) : (
                <p className="text-[15px] text-slate-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-200/60">
                  {prompt.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. PRICING PLANS SECTION                   */}
      {/* ========================================== */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="text-emerald-500" size={28} />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pricing & Tiers</h2>
        </div>
        <p className="text-slate-500 font-medium mb-8">
          Configure the public pricing page. Edit prices, descriptions, and feature lists.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.id || plan._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col h-full">
              
              {/* Header & Edit Button */}
              <div className="flex justify-between items-start mb-4">
                {editingPlanId === plan.id ? (
                  <input 
                    type="text" 
                    value={plan.name}
                    onChange={(e) => setPricingPlans(pricingPlans.map(p => p.id === plan.id ? {...p, name: e.target.value} : p))}
                    className="w-full mr-4 p-2 bg-white border border-indigo-300 rounded-lg text-lg font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                )}

                {editingPlanId === plan.id ? (
                  <button onClick={() => handleSavePlan(plan.id)} className="flex-shrink-0 p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                    <Save size={16} />
                  </button>
                ) : (
                  <button onClick={() => setEditingPlanId(plan.id)} className="flex-shrink-0 p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-indigo-600 transition-colors shadow-sm">
                    <Edit3 size={16} />
                  </button>
                )}
              </div>

              {/* Price & Description */}
              <div className="mb-6 flex-grow">
                {editingPlanId === plan.id ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={plan.price}
                        onChange={(e) => setPricingPlans(pricingPlans.map(p => p.id === plan.id ? {...p, price: e.target.value} : p))}
                        className="w-full pl-8 p-2 bg-white border border-indigo-300 rounded-lg text-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <textarea 
                      value={plan.description}
                      onChange={(e) => setPricingPlans(pricingPlans.map(p => p.id === plan.id ? {...p, description: e.target.value} : p))}
                      rows="2"
                      placeholder="Brief description..."
                      className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1 mb-2">
                      {plan.price !== 'Custom' && <span className="text-lg font-bold text-slate-500">₹</span>}
                      <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-sm font-bold text-slate-500">/mo</span>}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {plan.description}
                    </p>
                  </>
                )}
              </div>

              {/* Feature List */}
              <div className="pt-6 border-t border-slate-200/60 mt-auto">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Included Features</h4>
                
                {editingPlanId === plan.id ? (
                  <div>
                    <p className="text-xs text-indigo-500 font-medium mb-2">Put each feature on a new line:</p>
                    <textarea 
                      value={plan.features}
                      onChange={(e) => setPricingPlans(pricingPlans.map(p => p.id === plan.id ? {...p, features: e.target.value} : p))}
                      rows="6"
                      className="w-full p-3 bg-white border border-indigo-300 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none shadow-sm"
                    />
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {plan.features?.split('\n').filter(f => f.trim() !== '').map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}