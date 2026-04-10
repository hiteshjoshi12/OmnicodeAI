import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageSquare, X, Sparkles, User, HelpCircle } from 'lucide-react';

export default function FloatingWidgets() {
  const { pathname } = useLocation();
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // --- CHAT STATE ---
  const [faqs, setFaqs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi there! 👋 Welcome to Omnicode Support. Please select a topic below:' }
  ]);
  
  const messagesEndRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // 1. ALL HOOKS MUST COME FIRST
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch FAQs from DB on load
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/support/faqs`);
        setFaqs(res.data);
      } catch (err) {
        console.error("Could not load FAQs", err);
      }
    };
    fetchFaqs();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen, isTyping, showMenu]);

  // 2. Early return for hidden routes
  const hiddenRoutes = ['/dashboard', '/profile', '/profile/view'];
  if (hiddenRoutes.includes(pathname)) return null;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // --- THE CHAT LOOP LOGIC ---
  const handleOptionClick = (faq) => {
    setShowMenu(false);
    
    // 1. Show User's Selection
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: faq.question }]);
    setIsTyping(true);

    // 2. Fake a thinking delay, then show answer
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: faq.answer }]);
      
      // 3. Loop back and ask if they need more help
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'bot', text: 'Would you like help with anything else?' }]);
        setShowMenu(true);
      }, 1200);
    }, 600);
  };

  const handleDefaultMessage = () => {
    setShowMenu(false);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: "My issue isn't listed." }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "No worries! Please email support@omnicode.ai and our human team will assist you within 24 hours." }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'bot', text: 'Can I help you with anything else today?' }]);
        setShowMenu(true);
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 w-full px-6 flex justify-between items-end z-50 pointer-events-none">
      
      {/* LEFT: Go To Top Button */}
      <div className="pointer-events-auto">
        <AnimatePresence>
          {showTopBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-white text-slate-600 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-200 transition-colors"
            >
              <ArrowUp size={20} strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: Chat Support Bot */}
      <div className="pointer-events-auto relative flex flex-col items-end">
        
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-16 right-0 w-[350px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden flex flex-col mb-4 origin-bottom-right"
            >
              {/* Chat Header */}
              <div className="bg-indigo-600 p-4 text-white flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <HelpCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Omnicode Support</h3>
                    <p className="text-[11px] text-indigo-200 font-medium">Automated Assistant</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/20 rounded-md transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Body (Dynamic Messages) */}
              <div className="h-[360px] bg-slate-50 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-indigo-600'}`}>
                      {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm max-w-[85%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shadow-sm mt-1">
                      <Sparkles size={14} className="animate-pulse" />
                    </div>
                    <div className="px-4 py-3.5 rounded-2xl bg-white border border-slate-200 rounded-tl-sm shadow-sm flex items-center gap-1.5">
                      <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                )}

                {/* --- THE INTERACTIVE MENU LOOP --- */}
                {showMenu && !isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 pl-9 pr-2 mt-2"
                  >
                    {/* Render the first 6 FAQs so it's not overwhelming */}
                    {faqs.slice(0, 6).map((faq, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(faq)}
                        className="text-left px-4 py-2.5 bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 text-[13px] font-semibold rounded-xl transition-colors shadow-sm active:scale-95"
                      >
                        {faq.question}
                      </button>
                    ))}
                    
                    {/* The fallback option */}
                    <button
                      onClick={handleDefaultMessage}
                      className="text-left px-4 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold rounded-xl transition-colors shadow-sm active:scale-95 mt-2"
                    >
                      My issue isn't listed here 
                    </button>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-[0_10px_40px_rgba(15,23,42,0.4)] flex items-center justify-center outline-none focus:ring-4 focus:ring-slate-900/30 relative"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!isChatOpen && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-slate-900 rounded-full" />}
        </motion.button>
      </div>
    </div>
  );
}