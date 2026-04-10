import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, CreditCard, Zap, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AnalyticsTab() {
  const [data, setData] = useState({ revenueData: [], userGrowthData: [], appUsageData: [], kpis: {} });
  const [loading, setLoading] = useState(true);

  // Fetch real data from the database
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('omnicode_token');
        const response = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-slate-400 text-xs font-bold mb-1">{label}</p>
          <p className="text-white font-black text-lg">
            {payload[0].name === 'revenue' ? '₹' : ''}{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pb-10"
    >
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-indigo-500" size={28} />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Platform Analytics</h2>
        </div>
     
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Revenue', value: `₹${data.kpis.totalRevenue?.toLocaleString()}`, trend: '+12%', icon: <CreditCard size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Active Users', value: data.kpis.totalUsers?.toLocaleString(), trend: '+5%', icon: <Users size={24} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { title: 'AI Generations', value: data.kpis.totalGenerations?.toLocaleString(), trend: '+24%', icon: <Zap size={24} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((kpi, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{kpi.title}</p>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{kpi.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color} transition-transform group-hover:scale-110`}>
                {kpi.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="mb-6 relative z-10">
            <h3 className="text-lg font-bold text-white">Revenue Growth</h3>
            <p className="text-xs text-slate-400 font-medium">Monthly recurring revenue (INR)</p>
          </div>
          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Microapp Usage Chart */}
        <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="mb-6 relative z-10">
            <h3 className="text-lg font-bold text-white">Generations by App</h3>
          </div>
          <div className="flex-1 w-full relative z-10 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.appUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="uses" fill="#34d399" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Line Chart */}
        <div className="lg:col-span-3 bg-slate-950 p-6 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden mt-2">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
           <div className="mb-6 relative z-10">
            <h3 className="text-lg font-bold text-white">New User Signups</h3>
          </div>
          <div className="h-[250px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </motion.div>
  );
}