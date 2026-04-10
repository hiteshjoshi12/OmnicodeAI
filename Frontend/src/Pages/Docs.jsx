import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, Mail, Image as ImageIcon, CreditCard, Sparkles, ChevronRight } from 'lucide-react';

const docSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Sparkles className="text-indigo-400" size={24} />,
    content: (
      // CHANGED: text-slate-600 to text-slate-400
      <div className="space-y-4 text-slate-400 leading-relaxed font-medium">
        <p>
          Welcome to Omnicode AI! Your workspace is divided into specialized "Microapps" designed to handle specific development and productivity tasks. 
        </p>
        <p>
          To get started, navigate to your <strong>Dashboard</strong> using the main menu. On the left side of your dashboard, you will find a collapsible sidebar where you can switch between the Code Generator, Email Writer, and Image Studio.
        </p>
        {/* CHANGED: Pro tip box to dark mode styling */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mt-4">
          <p className="text-indigo-300 text-sm">
            <strong className="text-indigo-200">Pro Tip:</strong> You can collapse the sidebar using the arrow icon at the top right of the menu to give yourself more screen real estate while coding!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'code-assistant',
    title: 'Using the Code Assistant',
    icon: <Terminal className="text-emerald-400" size={24} />,
    content: (
      <div className="space-y-4 text-slate-400 leading-relaxed font-medium">
        <p>
          The Code Assistant is our flagship tool, capable of generating code in React, Node.js, Python, Java, C++, and SQL.
        </p>
        <ul className="list-none space-y-3 mt-4">
          <li className="flex items-start gap-3">
            <ChevronRight size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
            <span><strong className="text-slate-200">Select a Language:</strong> Use the dropdown at the top of the chat window to set your target language before prompting.</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
            <span><strong className="text-slate-200">Live Preview:</strong> For frontend languages like React and HTML/CSS, you can click the "Preview" tab on the right pane to see your code rendered instantly.</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
            <span><strong className="text-slate-200">Copy Code:</strong> Click the "Copy" button in the top right of the editor to instantly copy the raw code to your clipboard.</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'email-writer',
    title: 'Email Writer & Gmail Integration',
    icon: <Mail className="text-blue-400" size={24} />,
    content: (
      <div className="space-y-4 text-slate-400 leading-relaxed font-medium">
        <p>
          The Email Writer microapp allows you to generate professional, context-aware emails based on simple bullet points.
        </p>
        <p>
          Simply fill out the <em className="text-slate-300">Recipient</em>, select a <em className="text-slate-300">Tone of Voice</em> (e.g., Professional, Persuasive, Apologetic), and describe your main points. 
        </p>
        <p>
          Once generated, you can copy the text directly, or click the <span className="bg-white/10 border border-white/20 text-white px-2 py-1 rounded text-xs mx-1">Open in Gmail</span> button to automatically draft the email in your Google Workspace with the subject and body pre-filled.
        </p>
      </div>
    )
  },
  {
    id: 'image-studio',
    title: 'Image Studio',
    icon: <ImageIcon className="text-purple-400" size={24} />,
    content: (
      <div className="space-y-4 text-slate-400 leading-relaxed font-medium">
        <p>
          Transform text descriptions into high-fidelity images using our AI Image Studio.
        </p>
        <ul className="list-none space-y-3 mt-4">
          <li className="flex items-start gap-3">
            <ChevronRight size={18} className="text-purple-400 mt-1 flex-shrink-0" />
            <span><strong className="text-slate-200">Aspect Ratios:</strong> Choose between Square (1:1), Widescreen (16:9), or Vertical (9:16) for social media.</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight size={18} className="text-purple-400 mt-1 flex-shrink-0" />
            <span><strong className="text-slate-200">Artistic Styles:</strong> Apply filters like Photorealistic, Anime, 3D Render, or Oil Painting before generating.</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'credits-billing',
    title: 'Credits & Billing',
    icon: <CreditCard className="text-amber-400" size={24} />,
    content: (
      <div className="space-y-4 text-slate-400 leading-relaxed font-medium">
        <p>
          Omnicode AI operates on a credit-based system. Each time you generate code, write an email, or render an image, <strong className="text-slate-200">1 credit</strong> is deducted from your balance.
        </p>
        <p>
          You can view your remaining credits at the bottom of the Dashboard sidebar or in the top navigation menu. Free users receive 50 initial credits. To unlock higher limits and premium features, visit the <a href="/pricing" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Pricing page</a> to upgrade to a Pro or Enterprise plan.
        </p>
      </div>
    )
  }
];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

export default function Docs() {
  return (
    // CHANGED: bg-slate-50 to bg-slate-950, added relative overflow-hidden for glows
    <div className="pt-32 pb-32 bg-slate-950 min-h-screen relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          {/* CHANGED: Badge styling */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-sm">
            <BookOpen size={16} className="text-indigo-400" />
            <span className="uppercase tracking-widest">Platform Manual</span>
          </div>
          {/* CHANGED: Text colors */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Documentation
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl">
            Learn how to navigate your workspace, optimize your AI prompts, and maximize your automated workflow.
          </p>
        </motion.div>
        
        {/* Docs Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {docSections.map((section) => (
            <motion.div 
              key={section.id} 
              id={section.id}
              variants={itemVariants}
              // CHANGED: From solid white to frosted glass
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-300"
            >
              {/* CHANGED: border-slate-100 to border-white/10 */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                {/* CHANGED: Icon background */}
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  {section.icon}
                </div>
                {/* CHANGED: text-slate-900 to text-white */}
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {section.title}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none">
                {section.content}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Support Footer CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 text-center"
        >
          {/* CHANGED: text-slate-500 to text-slate-400 */}
          <p className="text-slate-400 font-medium">
            Still have questions? Click the chat bubble in the bottom right corner to contact support.
          </p>
        </motion.div>

      </div>
    </div>
  );
}