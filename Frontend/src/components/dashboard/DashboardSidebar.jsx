import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, Mail, Image as ImageIcon, MessageSquare, 
  Plus, ChevronsLeft, ChevronsRight, Sparkles, Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardSidebar({ activeApp, setActiveApp, isCollapsed, setIsCollapsed, setCurrentTask }) {
  const { user, token } = useAuth();
  const navigate = useNavigate(); 
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const microapps = [
    { id: 'code', name: 'Code Generator', icon: <Code2 size={18} /> },
    { id: 'email', name: 'Email Writer', icon: <Mail size={18} /> },
    { id: 'image', name: 'Image Studio', icon: <ImageIcon size={18} /> },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${apiUrl}/api/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(response.data.history);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [token, user?.credits]);

  const textVariants = {
    hidden: { opacity: 0, width: 0, display: "none", transition: { duration: 0.1 } },
    visible: { opacity: 1, width: "auto", display: "block", transition: { duration: 0.2, delay: 0.1 } }
  };

  const handleNewGeneration = () => {
    setCurrentTask({ isNew: true, timestamp: Date.now() }); 
  };

  const handleHistoryClick = (item) => {
    setActiveApp(item.appType || 'code');
    setCurrentTask(item); 
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      // CHANGED: Solid white to dark frosted glass, border to white/10
      className="h-full bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 flex flex-col pt-24 pb-6 fixed left-0 top-0 overflow-y-auto z-10 whitespace-nowrap shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
    >
      <div className="px-4 flex flex-col h-full">
        
        {/* Collapse Toggle Button */}
        <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-6`}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            // CHANGED: Hover states for dark mode
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>

        {/* New Generation Button */}
        <button 
          onClick={handleNewGeneration}
          // CHANGED: Added deep shadow and adjusted hover color
          className={`flex items-center justify-center bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all mb-8 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            isCollapsed ? 'px-0' : 'px-4 gap-2'
          }`}
          title="New Generation"
        >
          <Plus size={20} strokeWidth={2.5} className="flex-shrink-0" /> 
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span variants={textVariants} initial="hidden" animate="visible" exit="hidden">
                New Generation
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Microapp Suite Switcher */}
        <div className="mb-8">
          <AnimatePresence>
            {!isCollapsed && (
              // CHANGED: Header color
              <motion.p variants={textVariants} initial="hidden" animate="visible" exit="hidden" className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 px-2">
                Microapps
              </motion.p>
            )}
          </AnimatePresence>
          <div className="flex flex-col gap-1">
            {microapps.map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                title={app.name}
                // CHANGED: Active/Inactive states optimized for dark mode
                className={`flex items-center py-2.5 rounded-lg text-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-3'
                } ${
                  activeApp === app.id 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex-shrink-0">{app.icon}</div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span variants={textVariants} initial="hidden" animate="visible" exit="hidden">
                      {app.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>

        {/* Recent History */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <AnimatePresence>
            {!isCollapsed && (
              // CHANGED: Header color
              <motion.p variants={textVariants} initial="hidden" animate="visible" exit="hidden" className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 px-2">
                Recent History
              </motion.p>
            )}
          </AnimatePresence>
          
          <div className="flex flex-col gap-1">
            {loadingHistory ? (
              <div className="flex justify-center py-4">
                <Loader2 size={20} className="animate-spin text-slate-500" />
              </div>
            ) : history.length === 0 ? (
              <p className={`text-xs text-slate-500 font-medium px-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                No history yet. Start building!
              </p>
            ) : (
              history.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleHistoryClick(item)}
                  title={item.title}
                  // CHANGED: Hover states and text colors
                  className={`flex items-center py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-3'
                  }`}
                >
                  <MessageSquare size={16} className="text-slate-500 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span variants={textVariants} initial="hidden" animate="visible" exit="hidden" className="truncate">
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Credit Counter & Upgrade */}
        {/* CHANGED: border color */}
        <div className="mt-6 pt-6 border-t border-white/10 shrink-0">
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.div 
                key="collapsed-credits"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}
                onClick={() => navigate('/pricing')}
                // CHANGED: Card background and text
                className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-lg flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-500/50 hover:bg-white/10 transition-colors backdrop-blur-sm" 
                title={`${user?.credits || 0} Credits remaining`}
              >
                 <Sparkles size={18} className="text-indigo-400 mb-1" />
                 <span className="text-sm font-black text-white">{user?.credits || 0}</span>
              </motion.div>
            ) : (
              <motion.div 
                key="expanded-credits"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                // CHANGED: Card background and text
                className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-lg flex flex-col items-center text-center backdrop-blur-sm"
              >
                <span className="text-xs font-bold text-slate-400 mb-1">Remaining Credits</span>
                <span className="text-2xl font-black text-white">{user?.credits || 0}</span>
                <button 
                  onClick={() => navigate('/pricing')}
                  // CHANGED: Link color
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline mt-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  Upgrade Plan
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </motion.div>
  );
}