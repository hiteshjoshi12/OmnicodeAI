import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Maximize, 
  Palette, 
  ChevronDown, 
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // <-- 1. Import AuthContext

const STYLE_OPTIONS = [
  'Photorealistic',
  'Digital Art',
  '3D Render (Blender)',
  'Anime',
  'Oil Painting',
  'Cinematic Lighting'
];

// --- CUSTOM ANIMATED DROPDOWN COMPONENT ---
const StyleDropdown = ({ selected, onChange }) => {
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
        <span className="text-sm font-bold text-slate-700">{selected}</span>
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
              {STYLE_OPTIONS.map((option) => (
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


const IMAGE_PROMPTS = [
  "A cyberpunk city at sunset, neon lights",
  "A cozy snowy mountain cabin, golden hour",
  "A minimal geometric abstract background",
  "A cute robot holding a glowing crystal"
];
// --- MAIN IMAGE APP COMPONENT ---
export default function ImageApp({ currentTask }) { // <-- 2. Receive currentTask
  const { user, updateUser } = useAuth(); // <-- 3. Get User and Update Context
  
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('Photorealistic');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);

  // --- 4. Listen for History Sidebar Clicks ---
 // Listen for History Sidebar Clicks
  useEffect(() => {
    if (currentTask) {
      if (currentTask.isNew) {
        setPrompt('');
        setStyle('Photorealistic');
        setAspectRatio('1:1');
        setError('');
        // Optional: clear images array here if you want a totally blank slate on "New"
      } else if (currentTask.appType === 'image') {
        
        // 1. CLEAN THE PROMPT FOR THE UI
        // We appended the style and ratio like: "Prompt, Anime style, formatted in 16:9 aspect ratio"
        // Let's strip that out so the text box looks clean.
        let displayPrompt = currentTask.prompt || '';
        displayPrompt = displayPrompt.split(',')[0].trim();

        // 2. RESTORE UI
        setPrompt(displayPrompt);
        
        // 3. POPULATE GALLERY
        // We inject the saved Base64 image directly into the gallery grid
        setImages((prev) => {
          // Prevent duplicates if they click the same history item twice
          if (prev.find(img => img.id === currentTask._id)) return prev;
          
          return [{ 
            id: currentTask._id, 
            url: currentTask.content, 
            prompt: displayPrompt, 
            style: "From History" 
          }, ...prev];
        });
      }
    }
  }, [currentTask]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    // OPTIMIZATION: Trim the prompt and remove double spaces to save bytes
    const cleanPrompt = prompt.replace(/\s+/g, ' ').trim();
    
    if (!cleanPrompt || isGenerating) return;
    
    setIsGenerating(true);
    setError('');

    try {
      const token = localStorage.getItem('omnicode_token');
      
      const response = await axios.post(
        'http://localhost:5000/api/ai/generate-image', 
        { 
          prompt: cleanPrompt, // Send the cleaned prompt
          aspectRatio, 
          style 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // --- LOG USAGE TO CONSOLE TO TRACK COSTS ---
      console.log('🖼️ Image Generation Successful!');
      console.log('💰 Usage Data:', response.data.usage);
      console.log(`Remaining Credits: ${response.data.newCreditBalance}`);
      // -------------------------------------------

      // Add the new image to the top of the gallery
      const newImage = { 
        id: response.data.taskId, // <-- Use the actual MongoDB ID here!
        url: response.data.imageUrl, 
        prompt: cleanPrompt, 
        style: style 
      };
      setImages((prev) => [newImage, ...prev]);

      // Instantly sync credits
      updateUser({ credits: response.data.newCreditBalance });

    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.response?.data?.message || "Failed to generate image. The AI might be overloaded.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to trigger a browser download of the base64 image
  const handleDownload = (imgUrl, imgPrompt) => {
    const link = document.createElement('a');
    link.href = imgUrl;
    // Create a safe filename from the first few words of the prompt
    const safeName = imgPrompt.split(' ').slice(0, 4).join('_').replace(/[^a-z0-9_]/gi, '');
    link.download = `Omnicode_${safeName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex w-full h-[calc(100vh-5rem)] overflow-hidden bg-white">
      
      {/* LEFT PANE: Image Settings */}
      <div className="w-[380px] flex flex-col border-r border-slate-200 flex-shrink-0 bg-slate-50/50 relative z-20">
        <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
              <ImageIcon size={18} />
            </div>
            Image Studio
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1.5">Transform your ideas into stunning visuals.</p>
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Prompt</label>
              <textarea
                required value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="4"
                placeholder="A futuristic city with flying cars at sunset, cyberpunk style, highly detailed..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Maximize size={16} className="text-slate-400" /> Aspect Ratio
              </label>
              <div className="flex bg-slate-200/50 p-1 rounded-xl relative">
                {['1:1', '16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio} type="button" onClick={() => setAspectRatio(ratio)}
                    className={`relative flex-1 py-2 text-sm font-bold transition-colors z-10 ${
                      aspectRatio === ratio ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {aspectRatio === ratio && (
                      <motion.div 
                        layoutId="aspectRatioPill" 
                        className="absolute inset-0 bg-white border border-slate-200 shadow-sm rounded-lg -z-10" 
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    {ratio}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Palette size={16} className="text-slate-400" /> Artistic Style
              </label>
              <StyleDropdown 
                selected={style} 
                onChange={setStyle} 
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Suggestions</label>
              
              {/* --- NEW: PROMPT SUGGESTIONS --- */}
              <div className="mb-3 flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                {IMAGE_PROMPTS.map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(text)}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                  >
                    <Sparkles size={12} className="inline mr-1.5 -mt-0.5 text-indigo-400" />
                    {text}
                  </button>
                ))}
              </div>

              <textarea
                required value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="4"
                placeholder="A futuristic city with flying cars at sunset, cyberpunk style, highly detailed..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-4 pb-4">
              <button 
                type="submit" 
                disabled={!prompt.trim() || isGenerating || user?.credits < 2}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:active:scale-100 active:scale-95 shadow-md shadow-indigo-100"
              >
                {isGenerating ? (
                  <><Sparkles size={18} className="animate-spin-slow" /> Rendering Image...</>
                ) : (
                  <><Sparkles size={18} /> Generate Image (2 Credits)</>
                )}
              </button>
              {user?.credits < 2 && (
                <p className="text-center text-xs font-bold text-red-500 mt-3">You need at least 2 credits to generate an image. Upgrade to continue.</p>
              )}
            </motion.div>

          </form>
        </div>
      </div>

      {/* RIGHT PANE: Image Gallery */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50/50 custom-scrollbar">
        
        {images.length === 0 && !isGenerating ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
            className="w-full h-full flex flex-col items-center justify-center text-slate-400"
          >
            <div className="w-20 h-20 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ImageIcon size={32} className="text-indigo-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Your blank canvas awaits</h3>
            <p className="font-medium text-sm text-center max-w-sm leading-relaxed">Describe what you want to see in the prompt box, select a style, and let AI do the rest.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            
            <AnimatePresence>
              {/* Loading Skeleton */}
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="aspect-square bg-slate-200/50 rounded-2xl animate-pulse flex items-center justify-center border-2 border-dashed border-slate-300"
                >
                  <Sparkles className="text-indigo-400 animate-spin-slow" size={32} />
                </motion.div>
              )}

              {/* Generated Images */}
              {images.map((img, index) => (
                <motion.div 
                  key={img.id} 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  className={`relative group rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 ${
                    // Adjust grid styling based on aspect ratio if we parsed it from the prompt
                    img.prompt.includes('16:9') ? 'aspect-video md:col-span-2' : 
                    img.prompt.includes('9:16') ? 'aspect-[9/16]' : 'aspect-square'
                  }`}
                >
                  <img src={img.url} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Beautiful Glassmorphism Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-widest mb-2">
                            {img.style}
                          </span>
                          <p className="text-white font-medium text-sm line-clamp-2 leading-relaxed">{img.prompt}</p>
                        </div>
                        <button 
                          onClick={() => handleDownload(img.url, img.prompt)}
                          title="Download Image"
                          className="flex-shrink-0 p-3 bg-white hover:bg-indigo-50 text-slate-900 hover:text-indigo-600 rounded-xl shadow-lg transition-all active:scale-95 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <Download size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>
        )}
      </div>
    </div>
  );
}