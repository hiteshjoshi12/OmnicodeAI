import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Save, Globe, CreditCard, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

export default function SettingsTab() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [defaultCredits, setDefaultCredits] = useState(15);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('omnicode_token');
        // CHANGED: Point to the unified /api/settings route
        const response = await axios.get('http://localhost:5000/api/settings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // CHANGED: Read directly from response.data
        const settings = response.data;
        setMaintenanceMode(settings.maintenanceMode);
        setSignupEnabled(settings.signupEnabled);
        setDefaultCredits(settings.defaultCredits);
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('omnicode_token');
      // CHANGED: Point to the unified /api/settings route
      await axios.put('http://localhost:5000/api/settings', {
        maintenanceMode,
        signupEnabled,
        defaultCredits: Number(defaultCredits)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;
  }

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Platform Settings */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Globe className="text-indigo-500" size={20} />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Global Platform</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-[15px]">Maintenance Mode</h4>
              <p className="text-sm text-slate-500 font-medium">Temporarily disable access to the workspace for updates.</p>
            </div>
            <button onClick={() => setMaintenanceMode(!maintenanceMode)} className="outline-none">
              {maintenanceMode ? <ToggleRight size={40} className="text-indigo-600" /> : <ToggleLeft size={40} className="text-slate-300" />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-[15px]">Allow New Signups</h4>
              <p className="text-sm text-slate-500 font-medium">Enable or disable new user registration.</p>
            </div>
            <button onClick={() => setSignupEnabled(!signupEnabled)} className="outline-none">
              {signupEnabled ? <ToggleRight size={40} className="text-emerald-500" /> : <ToggleLeft size={40} className="text-slate-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Billing & Credits */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <CreditCard className="text-amber-500" size={20} />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Billing & Credits</h2>
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Default Signup Credits</label>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              value={defaultCredits}
              onChange={(e) => setDefaultCredits(e.target.value)}
              className="w-32 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-500 font-medium">Credits awarded to new 'Free' tier users.</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-[15px] font-black rounded-xl shadow-md hover:bg-indigo-700 transition-all active:scale-95 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
          {saving ? 'Saving...' : 'Save Configurations'}
        </button>
      </div>
    </motion.div>
  );
}