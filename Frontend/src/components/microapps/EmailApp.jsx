import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Mail, 
  User, 
  ChevronDown, 
  Check, 
  Copy, 
  Sparkles, 
  Send,
  AlignLeft,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // <-- 1. Import AuthContext


const SUPPORTED_MODELS = [
  { id: 'gemini', name: 'Gemini 2.5 Flash' },
  { id: 'openai', name: 'OpenAI GPT-4o' },
  { id: 'claude', name: 'Claude 3.5 Sonnet' }
];

const TONE_OPTIONS = [
  'Professional',
  'Friendly & Casual',
  'Persuasive (Sales)',
  'Urgent',
  'Apologetic',
  'Direct & Concise'
];

// --- CUSTOM ANIMATED DROPDOWN COMPONENT ---
const ToneDropdown = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl shadow-sm transition-all focus:outline-none ${
          isOpen 
            ? 'border-indigo-500 ring-4 ring-indigo-500/10' 
            : 'border-slate-200 hover:border-indigo-300'
        }`}
      >
        <div className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
          {selected}
        </div>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-50 py-1.5"
          >
            <div className="max-h-[240px] overflow-y-auto scrollbar-hide">
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold transition-colors ${
                    selected === option 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {option}
                  {selected === option && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <Check size={16} className="text-indigo-600" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EMAIL_PROMPTS = [
  "Follow up on a recent job interview",
  "Announce a new product launch to customers",
  "Request a meeting to discuss a partnership",
  "Apologize for a delayed shipment"
];

// --- MAIN EMAIL APP COMPONENT ---
export default function EmailApp({ currentTask }) { // <-- 2. Receive currentTask
  const { user, updateUser } = useAuth(); // <-- 3. Get User and Update Context
  const [selectedModel, setSelectedModel] = useState(SUPPORTED_MODELS[0]);
  
  const [formData, setFormData] = useState({
    recipient: '',
    tone: 'Professional',
    purpose: '',
    keyPoints: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const [generatedEmail, setGeneratedEmail] = useState({
    subject: 'Welcome to Omnicode AI - Your Next-Gen Workspace',
    body: 'Hi there,\n\nWelcome to Omnicode AI! We are thrilled to have you on board.\n\nOur platform is designed to supercharge your development workflow by instantly generating high-quality React components, professional emails, and stunning images directly from your prompts.\n\nTo get started, simply navigate to your Dashboard and try out the Code Generator.\n\nBest regards,\n\nThe Omnicode Team'
  });

  // --- 4. Listen for History Sidebar Clicks ---
  useEffect(() => {
    if (currentTask) {
      if (currentTask.isNew) {
        setFormData({ recipient: '', tone: 'Professional', purpose: '', keyPoints: '' });
        setGeneratedEmail({ subject: 'Ready for a new draft', body: 'Fill out the form on the left to generate your next email.' });
        setError('');
      } else if (currentTask.appType === 'email') {
        
        // 1. CLEAN THE DB CONTENT
        const rawText = currentTask.content || '';
        const parts = rawText.split(/BODY:/i);
        
        // Safely extract the subject and body
        const savedSubject = parts[0] ? parts[0].replace(/SUBJECT:/i, '').trim() : 'History Email';
        const savedBody = parts[1] ? parts[1].trim() : rawText;

        // 2. CLEAN THE PROMPT FOR THE UI
        // Strip out our hidden CRITICAL INSTRUCTIONS so the user only sees what they typed
        let displayPrompt = currentTask.prompt || '';
        displayPrompt = displayPrompt.split('CRITICAL INSTRUCTIONS:')[0].trim();
        
        // Try to clean up the "Main Purpose" field for the UI
        const purposeMatch = displayPrompt.match(/Main Purpose: (.*?)\n/);
        const cleanPurpose = purposeMatch ? purposeMatch[1] : displayPrompt;

        // 3. RESTORE UI
        setFormData(prev => ({ ...prev, purpose: cleanPurpose }));
        setGeneratedEmail({ subject: savedSubject, body: savedBody });
      }
    }
  }, [currentTask]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.purpose.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setError('');

    try {
      const token = localStorage.getItem('omnicode_token');
      
      // Construct a highly specific prompt to guarantee formatting
      const finalPrompt = `
        Write an email based on these parameters:
        Recipient: ${formData.recipient || 'Not specified'}
        Tone: ${formData.tone}
        Main Purpose: ${formData.purpose}
        Key Points to Cover: ${formData.keyPoints || 'None'}

        CRITICAL INSTRUCTIONS: You MUST format your response exactly like this, with nothing else:
        SUBJECT: [Your generated subject line]
        BODY:
        [Your generated email body]
      `;

      // We use the existing API endpoint, but tell it we are using the 'email' appType for history
      // Inside handleGenerate in EmailApp.jsx
      const response = await axios.post(
        'http://localhost:5000/api/ai/generate-email', 
        { 
          prompt: finalPrompt,
          provider: selectedModel.id // <-- ADD THIS
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Parse the response to separate Subject and Body
      const rawText = response.data.code;
      const parts = rawText.split(/BODY:/i);
      
      const parsedSubject = parts[0].replace(/SUBJECT:/i, '').trim();
      const parsedBody = parts[1] ? parts[1].trim() : rawText;

      setGeneratedEmail({
        subject: parsedSubject || "Generated Email",
        body: parsedBody
      });

      // Instantly sync credits
      updateUser({ credits: response.data.newCreditBalance });

    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.response?.data?.message || "Failed to generate email. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'subject') {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(generatedEmail.body)}`;

  return (
    <div className="flex w-full h-[calc(100vh-5rem)] overflow-hidden bg-white">
      
      {/* LEFT PANE: Email Parameters */}
      <div className="w-[400px] flex flex-col border-r border-slate-200 flex-shrink-0 bg-slate-50/50 relative z-20">
        <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
              <Mail size={18} />
            </div>
            Email Writer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1.5">Generate high-converting emails in seconds.</p>
        </div>


        <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight mb-3">
            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
              <Mail size={18} />
            </div>
            Email Writer
          </h2>
          
         
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleGenerate} className="p-5 space-y-6">
            
            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="p-4 bg-red-50 border border-red-100 flex items-start gap-3 rounded-xl text-sm font-bold text-red-600 mb-2">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <p className="leading-tight">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recipient (Optional)</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text" name="recipient" value={formData.recipient} onChange={handleChange} placeholder="e.g. John Doe, Investors"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tone of Voice</label>
              <ToneDropdown selected={formData.tone} onChange={(val) => setFormData({...formData, tone: val})} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">What is the main purpose?</label>
              <textarea
                required name="purpose" value={formData.purpose} onChange={handleChange} rows="2"
                placeholder="e.g. Announce our new AI feature launch..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Points to Cover</label>
              <textarea
                name="keyPoints" value={formData.keyPoints} onChange={handleChange} rows="4"
                placeholder="- Built on Next.js&#10;- 10x faster generation&#10;- Special discount code: OMNI20"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Suggestions</label>
              
              {/* --- NEW: PROMPT SUGGESTIONS --- */}
              <div className="mb-3 flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                {EMAIL_PROMPTS.map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({...formData, purpose: text})}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                  >
                    <Sparkles size={12} className="inline mr-1.5 -mt-0.5 text-indigo-400" />
                    {text}
                  </button>
                ))}
              </div>

              <textarea
                required name="purpose" value={formData.purpose} onChange={handleChange} rows="2"
                placeholder="e.g. Announce our new AI feature launch..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-2 pb-4">
              <button 
                type="submit" 
                disabled={!formData.purpose.trim() || isGenerating || user?.credits <= 0}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:active:scale-100 active:scale-95 shadow-md shadow-indigo-100"
              >
                {isGenerating ? (
                  <><Sparkles size={18} className="animate-spin-slow" /> Drafting Email...</>
                ) : (
                  <><Sparkles size={18} /> Generate Draft</>
                )}
              </button>
              {user?.credits <= 0 && (
                <p className="text-center text-xs font-bold text-red-500 mt-3">You are out of credits! Upgrade to continue.</p>
              )}
            </motion.div>

          </form>
        </div>
      </div>

      {/* RIGHT PANE: Output Editor */}
      <div className="flex-1 bg-slate-50/50 p-6 md:p-10 flex flex-col items-center overflow-y-auto relative z-10">
        
        <div className="w-full max-w-3xl flex flex-col h-full">
          
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full flex flex-col items-center justify-center text-slate-400"
              >
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <Mail size={32} className="text-indigo-500 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Drafting your email...</h3>
                <p className="text-sm font-medium">Applying the '{formData.tone}' tone</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex-1 flex flex-col shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden border border-slate-200"
              >
                {/* Subject Line Header */}
                <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Subject</span>
                    <input 
                      type="text" 
                      value={generatedEmail.subject} 
                      onChange={(e) => setGeneratedEmail({...generatedEmail, subject: e.target.value})}
                      className="flex-1 text-slate-900 font-bold text-[15px] outline-none bg-transparent"
                    />
                  </div>
                  <button 
                    onClick={() => handleCopy(generatedEmail.subject, 'subject')} 
                    className="flex-shrink-0 ml-2 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-indigo-500"
                    title="Copy Subject"
                  >
                    {copiedSubject ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>

                {/* Email Body */}
                <div className="bg-white flex-1 p-6 relative group flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-100 pb-4">
                    <AlignLeft size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Message Body</span>
                  </div>
                  
                  <textarea 
                    value={generatedEmail.body}
                    onChange={(e) => setGeneratedEmail({...generatedEmail, body: e.target.value})}
                    className="w-full flex-1 outline-none resize-none text-[15px] text-slate-700 leading-relaxed custom-scrollbar"
                  />
                  
                  {/* Floating Action Buttons inside the text area */}
                  <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleCopy(generatedEmail.body, 'body')} 
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm active:scale-95 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {copiedBody ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />} 
                      {copiedBody ? 'Copied' : 'Copy'}
                    </button>
                    
                    <a 
                      href={gmailLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 no-underline"
                    >
                      <Send size={16} className="translate-x-[-1px] translate-y-[1px]" /> 
                      Open in Gmail
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}