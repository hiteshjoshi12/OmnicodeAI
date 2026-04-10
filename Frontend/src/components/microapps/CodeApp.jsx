import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Terminal,
  User,
  Send,
  Play,
  Code2,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

import LanguageDropdown from "../ui/LanguageDropdown";


// --- CONFIGURATION ---
const SUPPORTED_LANGUAGES = [
  { id: "react", name: "React (Tailwind)", hasPreview: true },
  { id: "nextjs", name: "Next.js", hasPreview: true },
  { id: "node", name: "Node.js (Express)", hasPreview: false },
  { id: "python", name: "Python", hasPreview: false },
  { id: "html", name: "HTML / CSS / JS", hasPreview: true },
  { id: "java", name: "Java", hasPreview: false },
  { id: "cpp", name: "C++", hasPreview: false },
  { id: "nosql", name: "MongoDB / NoSQL", hasPreview: false },
  { id: "sql", name: "SQL", hasPreview: false },
];

const SUPPORTED_MODELS = [
  { id: "gemini", name: "Gemini 2.5 Flash" },
  { id: "openai", name: "OpenAI GPT-4o" },
  { id: "claude", name: "Claude 3.5 Sonnet" },
];

const CODE_PROMPTS = {
  react: [
    "Responsive navbar with a mobile hamburger menu",
    "Pricing table with 3 tiers and a monthly/yearly toggle",
    "Sleek login form with social authentication buttons",
  ],
  nextjs: [
    "Server-side rendered blog post layout",
    "API route for user authentication",
    "Image gallery with next/image optimization",
  ],
  node: [
    "Express REST API CRUD for a Todo app",
    "Middleware for JWT authentication",
    "Mongoose schema for a User profile",
  ],
  python: [
    "Flask API endpoint for user login",
    "Script to scrape a website using BeautifulSoup",
    "Pandas data analysis script for reading a CSV",
  ],
  html: [
    "Landing page hero section with CSS animations",
    "Responsive CSS grid layout for a portfolio",
    "Interactive JavaScript calculator",
  ],
  java: [
    "Spring Boot REST controller for users",
    "Multithreaded web scraper implementation",
    "Basic binary search tree implementation",
  ],
  cpp: [
    "Custom linked list data structure",
    "Simple TCP client-server chat application",
    "Optimized algorithm to reverse a string in place",
  ],
  nosql: [
    "MongoDB aggregation pipeline for sales data",
    "Mongoose schema with virtuals and pre-save hooks",
    "Redis caching layer for user sessions",
  ],
  sql: [
    "Complex JOIN query for orders and customers",
    "PostgreSQL trigger to automatically update timestamps",
    "SQL script to create a normalized e-commerce database",
  ],
};

// --- MAIN CODE APP COMPONENT ---
export default function CodeApp({ currentTask, setShowPricingModal }) {
  const { user, updateUser } = useAuth();

  const [input, setInput] = useState("");
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [selectedModel, setSelectedModel] = useState(SUPPORTED_MODELS[0]);
  const [activeTab, setActiveTab] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content:
        "Hi! Select your language above, describe what you want to build, and I will generate the code for you.",
    },
  ]);

  const [generatedCode, setGeneratedCode] = useState(
    "// Your generated code will appear here.",
  );
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Force tab switch if language doesn't support preview
  useEffect(() => {
    if (!selectedLang.hasPreview && activeTab === "preview") {
      setActiveTab("code");
    }
  }, [selectedLang, activeTab]);

  // History listener
  useEffect(() => {
    if (currentTask) {
      if (currentTask.isNew) {
        setInput("");
        setGeneratedCode("// Your generated code will appear here.");
        setMessages([
          {
            id: Date.now(),
            role: "ai",
            content:
              "Ready for a new task! Select your language and tell me what to build.",
          },
        ]);
        setActiveTab("preview");
      } else if (currentTask.appType === "code") {
        let matchedLang = SUPPORTED_LANGUAGES[0];
        for (const lang of SUPPORTED_LANGUAGES) {
          if (
            currentTask.prompt &&
            currentTask.prompt.includes(`Write in ${lang.name}:`)
          ) {
            matchedLang = lang;
            break;
          }
        }
        setSelectedLang(matchedLang);

        let rawCode = currentTask.content || "";
        const cleanCode = rawCode
          .replace(/```[a-zA-Z]*\n/g, "")
          .replace(/```/g, "")
          .replace(/\u00A0/g, " ")
          .trim();

        setGeneratedCode(cleanCode);

        let displayPrompt = currentTask.prompt || "";
        displayPrompt = displayPrompt.replace(
          `Write in ${matchedLang.name}: `,
          "",
        );
        displayPrompt = displayPrompt
          .split("\n\nCRITICAL INSTRUCTIONS")[0]
          .trim();

        setMessages([
          { id: Date.now(), role: "user", content: displayPrompt },
          {
            id: Date.now() + 1,
            role: "ai",
            content: `Here is the ${matchedLang.name} code you requested from your history.`,
          },
        ]);

        if (matchedLang.hasPreview) setActiveTab("preview");
        else setActiveTab("code");
      }
    }
  }, [currentTask]);

  const handleSend = async (e) => {
    e.preventDefault();

    // 1. Check Credits First
    if (user?.credits <= 0) {
      setShowPricingModal(true);
      return;
    }

    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    const messageId = Date.now();

    setMessages((prev) => [
      ...prev,
      { id: messageId, role: "user", content: userMessage },
    ]);
    setInput("");
    setIsGenerating(true);

    try {
      const token = localStorage.getItem("omnicode_token");

      let finalPrompt = `Write in ${selectedLang.name}: ${userMessage}`;

      // --- UPDATED STRICT TAILWIND PROMPT ---
      if (selectedLang.id === "react" || selectedLang.id === "nextjs") {
        finalPrompt += `\n\nCRITICAL INSTRUCTIONS: You MUST use Tailwind CSS utility classes exclusively for ALL styling. Do NOT output any custom CSS or inline styles. You must provide a single, fully working file. Do NOT use prop-types. You MUST include a default exported 'App' component at the bottom that renders and demonstrates the component you just built.`;
      } else if (selectedLang.id === "html") {
        finalPrompt += `\n\nCRITICAL INSTRUCTIONS: You MUST provide a SINGLE, self-contained HTML file. ALL CSS MUST be placed inside <style> tags within the <head>. ALL JavaScript MUST be placed inside <script> tags at the bottom of the <body>. Do NOT output separate CSS or JS markdown blocks.`;
      }

      const response = await axios.post(
        `${apiUrl}/api/ai/generate-code`,
        {
          prompt: finalPrompt,
          provider: selectedModel.id, // Send the selected model to backend
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Regex vacuum to clean output
      let rawCode = response.data.code;
      const cleanCode = rawCode
        .replace(/```[a-zA-Z]*\n/g, "")
        .replace(/```/g, "")
        .replace(/\u00A0/g, " ")
        .trim();

      const aiResponse = `I've generated the ${selectedLang.name} code for you using ${selectedModel.name}. Check the editor pane to review it!`;

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", content: aiResponse },
      ]);
      setGeneratedCode(cleanCode);

      updateUser({ credits: response.data.newCreditBalance });

      if (selectedLang.hasPreview) setActiveTab("preview");
      else setActiveTab("code");
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "I'm sorry, something went wrong communicating with the AI. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", content: `Error: ${errorMessage}` },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex w-full h-[calc(100vh-5rem)] overflow-hidden bg-white">
      {/* LEFT PANE: Chat Interface */}
      <div className="w-[400px] flex flex-col border-r border-slate-200 flex-shrink-0 bg-slate-50/50 relative">
        <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 tracking-tight">
            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
              <Sparkles
                size={18}
                className={isGenerating ? "animate-pulse" : ""}
              />
            </div>
            Code Assistant
          </h2>

          <div className="space-y-3">
            <LanguageDropdown
              options={SUPPORTED_LANGUAGES}
              selected={selectedLang}
              onChange={setSelectedLang}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-indigo-600"}`}
                >
                  {msg.role === "user" ? (
                    <User size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] text-[15px] font-medium leading-relaxed shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm whitespace-pre-wrap"}`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shadow-sm">
                  <Sparkles size={16} className="animate-spin-slow" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 text-sm font-medium rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>

        <div className="p-4 bg-white border-t border-slate-200 z-10">
          {/* Dynamic Prompt Suggestions */}
          <div className="mb-3 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLang.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2 overflow-x-auto custom-scrollbar pb-1"
              >
                {(CODE_PROMPTS[selectedLang.id] || CODE_PROMPTS["react"]).map(
                  (text, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInput(text)}
                      className="flex-shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                    >
                      <Sparkles
                        size={12}
                        className="inline mr-1.5 -mt-0.5 text-indigo-400"
                      />
                      {text}
                    </button>
                  ),
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <form onSubmit={handleSend} className="relative flex items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask Omnicode to build in ${selectedLang.name}...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3.5 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all resize-none min-h-[52px] max-h-[200px] shadow-sm"
              rows="1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute right-2 bottom-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:bg-slate-300 active:scale-95 flex items-center justify-center shadow-md shadow-indigo-200"
            >
              <Send
                size={16}
                className={
                  input.trim() && !isGenerating
                    ? "translate-x-0.5 -translate-y-0.5 transition-transform"
                    : ""
                }
              />
            </button>
          </form>
          <p className="text-[11px] text-center text-slate-400 mt-3 font-medium">
            AI can make mistakes. Always review code before deploying.
          </p>
        </div>
      </div>

      {/* RIGHT PANE: Code & Preview Editor */}
      <div className="flex-1 flex flex-col bg-slate-50/50 min-w-0">
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 z-10">
          <div className="flex bg-slate-100 p-1 rounded-xl relative">
            {selectedLang.hasPreview && (
              <button
                onClick={() => setActiveTab("preview")}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold z-10 transition-colors ${activeTab === "preview" ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
              >
                {activeTab === "preview" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                  />
                )}
                <Play
                  size={16}
                  className={
                    activeTab === "preview"
                      ? "text-indigo-600"
                      : "text-slate-400"
                  }
                />{" "}
                Preview
              </button>
            )}
            <button
              onClick={() => setActiveTab("code")}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold z-10 transition-colors ${activeTab === "code" ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              {activeTab === "code" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                />
              )}
              <Code2
                size={16}
                className={
                  activeTab === "code" ? "text-indigo-600" : "text-slate-400"
                }
              />{" "}
              Code
            </button>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            {isCopied ? (
              <Check size={16} className="text-emerald-500" />
            ) : (
              <Copy size={16} />
            )}
            {isCopied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        <div className="flex-1 overflow-auto relative p-6 md:p-8 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {activeTab === "preview" && selectedLang.hasPreview ? (
              <motion.div
                key="preview-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden"
              >
                {generatedCode.includes("// Your generated code") ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                      <Play size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">
                      {selectedLang.name} Preview
                    </h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                      Describe a component on the left, and watch the live
                      preview render here instantly.
                    </p>
                  </div>
                ) : selectedLang.id === "react" ||
                  selectedLang.id === "nextjs" ? (
                  <SandpackProvider
                    template="react"
                    theme="light"
                    files={{
                      "/App.js": generatedCode.includes('export default') 
                        ? generatedCode 
                        : `export default function App() {\n  return (\n    <div className="p-8 text-center text-slate-500">\n      Generate a React component to see it here!\n    </div>\n  );\n}\n\n${generatedCode}`,
                      
                      // --- THE NEW BULLETPROOF INJECTION ---
                      "/index.js": `
                        import React, { StrictMode } from "react";
                        import { createRoot } from "react-dom/client";
                        import App from "./App";

                        // Force inject Tailwind CSS into the DOM before React renders
                        const tailwindScript = document.createElement("script");
                        tailwindScript.src = "https://cdn.tailwindcss.com";
                        document.head.appendChild(tailwindScript);

                        const root = createRoot(document.getElementById("root"));
                        root.render(
                          <StrictMode>
                            <App />
                          </StrictMode>
                        );
                      `
                    }}
                    customSetup={{
                      dependencies: {
                        "lucide-react": "latest",
                        "framer-motion": "latest",
                        "axios": "latest"
                      }
                    }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
                  >
                    <SandpackLayout
                      style={{
                        border: "none",
                        borderRadius: 0,
                        flex: 1,
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <SandpackPreview
                        showNavigator={false}
                        showOpenInCodeSandbox={false}
                        style={{ width: "100%", height: "100%", flex: 1 }}
                      />
                    </SandpackLayout>
                  </SandpackProvider>
                ) : selectedLang.id === "html" ? (
                  <iframe
                    srcDoc={generatedCode}
                    title="Live HTML Preview"
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full bg-white border-0"
                  />
                ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center justify-center p-10 w-full h-full">
                    <Code2 size={48} className="mb-4 text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">
                      Backend Runtime Required
                    </h3>
                    <p className="text-sm font-medium max-w-md leading-relaxed">
                      Live preview is currently only supported for React,
                      Next.js, and HTML.
                    </p>
                    <p className="text-sm font-medium mt-4">
                      Please copy your <strong>{selectedLang.name}</strong> code
                      and run it in your local IDE!
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="code-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col bg-[#0d1117] rounded-2xl shadow-xl border border-slate-800 overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-slate-800/80">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-3 text-[13px] font-mono text-slate-500">
                    generated_output.
                    {selectedLang.id === "react" || selectedLang.id === "nextjs"
                      ? "jsx"
                      : selectedLang.id}
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <pre className="text-[13px] font-mono text-slate-300 leading-relaxed tracking-wide">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
