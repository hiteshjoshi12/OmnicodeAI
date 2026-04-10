import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, FileText, Wand2, Code2 } from 'lucide-react';

const features = [
  { 
    title: 'Multi-Language Code', 
    desc: 'Generate clean, commented code in Python, JS, C++, and more. Optimized for modern syntax and performance.', 
    icon: <Terminal size={40} strokeWidth={1.5} />, 
    grid: 'md:col-span-8',
    bg: 'bg-white/5 backdrop-blur-xl', // Frosted glass effect
    textColor: 'text-white',
    descColor: 'text-slate-400',
    iconColor: 'text-indigo-400',
    border: 'border-white/10'
  },
  { 
    title: 'AI Summary', 
    desc: 'Turn walls of documentation into concise technical summaries.', 
    icon: <FileText size={40} strokeWidth={1.5} />, 
    grid: 'md:col-span-4',
    bg: 'bg-indigo-600', // Keeps the pop of brand color
    textColor: 'text-white',
    descColor: 'text-indigo-100',
    iconColor: 'text-white',
    border: 'border-indigo-500/50'
  },
  { 
    title: 'Project Scaffolding', 
    desc: 'Instantly scaffold full MERN stacks or micro-apps. We handle the folders, you handle the logic.', 
    icon: <Wand2 size={40} strokeWidth={1.5} />, 
    grid: 'md:col-span-5',
    bg: 'bg-slate-900/80 backdrop-blur-xl',
    textColor: 'text-white',
    descColor: 'text-slate-400',
    iconColor: 'text-violet-400',
    border: 'border-white/10'
  },
  { 
    title: 'Live Preview', 
    desc: 'See your HTML/CSS/JS code come to life in a real-time sandboxed browser environment.', 
    icon: <Code2 size={40} strokeWidth={1.5} />, 
    grid: 'md:col-span-7',
    bg: 'bg-white/5 backdrop-blur-xl', // Frosted glass effect
    textColor: 'text-white',
    descColor: 'text-slate-400',
    iconColor: 'text-emerald-400',
    border: 'border-white/10'
  }
];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      
      {/* Modern Developer Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Subtle Glows to separate sections */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Master Your Workflow
          </h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Omnicode AI isn't just a generator; it's a full-stack productivity suite 
            designed to eliminate the "blank screen" phase of development.
          </p>
        </motion.div>

        {/* Bento Box Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={cardVariants}
              className={`${f.grid} ${f.bg} ${f.border} border p-10 rounded-[2.5rem] flex flex-col justify-between shadow-lg hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div>
                <div className={`${f.iconColor} mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 origin-left`}>
                  {f.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 tracking-tight ${f.textColor}`}>
                  {f.title}
                </h3>
                <p className={`text-lg leading-relaxed font-medium ${f.descColor}`}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}