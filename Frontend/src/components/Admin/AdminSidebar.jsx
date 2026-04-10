import React from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  TableOfContentsIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex fixed h-full left-0 top-0 z-20 shadow-2xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-500 p-1.5 rounded-lg shadow-lg shadow-indigo-500/30">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <span className="font-black text-lg tracking-tight">Admin Portal</span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <BarChart3 size={18} /> Power BI Analytics
        </button>
        
        <button 
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Users size={18} /> User Management
        </button>

        <button 
          onClick={() => setActiveTab('CMS')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'CMS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <TableOfContentsIcon size={18} /> CMS Management
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings size={18} /> System Settings
        </button>


        <button 
          onClick={() => setActiveTab('reports')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Users size={18} /> Report
        </button>

        <button 
          onClick={() => setActiveTab('broadcast')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'broadcast' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Users size={18} /> Broadcast
        </button>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <LogOut size={18} /> Exit Admin
        </button>
      </div>
    </div>
  );
}