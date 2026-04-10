import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { 
  Code2, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Sparkles, 
  User, 
  Settings 
} from "lucide-react";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { pathname } = useLocation();

  const timeoutRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  // --- Hover Menu Logic ---
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150); // 150ms delay to bridge the gap
  };

  const handleProfileClose = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    handleProfileClose();
    logout();
    navigate("/");
  };

  const navItems = ["Features", "Pricing", "Docs"];
  const userInitial = user?.fullName?.charAt(0).toUpperCase() || "U";

  const getTransformedImage = (url) => {
    if (!url) return null;
    if (url.includes('ik.imagekit.io') && !url.includes('tr=')) {
      return `${url}?tr=w-128,h-128,fo-face`;
    }
    return url;
  };

  if (pathname === '/admin') return null;

  return (
    <>
      {/* Desktop & Mobile Header Shell */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-sm"
            : "bg-transparent border-b-transparent"
        }`}
      >
        <div className={`w-full px-6 lg:px-12 mx-auto transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
          <div className="flex justify-between items-center w-full">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2.5 outline-none group">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-500 p-1.5 rounded-xl group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-300 group-hover:-translate-y-0.5">
                <Code2 size={22} className="text-white" />
              </div>
              <span className="text-xl font-[900] text-white tracking-tighter group-hover:text-indigo-400 transition-colors duration-300">
                Omnicode AI
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className={({ isActive }) => `
                    relative group text-[15px] font-bold transition-all outline-none py-1
                    ${isActive ? "text-indigo-400" : "text-slate-300 hover:text-white"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item}
                      <span
                        className={`
                          absolute -bottom-1 left-0 h-[3px] rounded-full bg-indigo-500 transition-all duration-300 ease-out
                          ${isActive ? "w-full" : "w-0 group-hover:w-full opacity-50 group-hover:opacity-100"}
                        `}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden lg:flex items-center px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm font-bold text-indigo-300 backdrop-blur-sm cursor-default">
                    <Sparkles size={16} className="text-indigo-400 mr-1.5" />
                    {user?.credits || 0} Credits
                  </div>

                  {/* Custom Dropdown Wrapper */}
                  <div 
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                    className="relative flex items-center h-full ml-1"
                  >
                    <button 
                      onClick={handleMouseEnter} 
                      className="outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-full transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden border-2 border-transparent hover:border-indigo-400 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                        {user?.profileImage ? (
                          <img src={getTransformedImage(user.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          userInitial
                        )}
                      </div>
                    </button>

                    {/* Framer Motion Dropdown */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute right-0 top-[calc(100%+0.5rem)] w-56 bg-slate-900 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
                          // Invisible bridge to keep hover active between avatar and menu
                          style={{ paddingTop: '10px', marginTop: '-10px' }}
                        >
                          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
                            <div className="px-5 py-4 border-b border-white/10 bg-white/5">
                              <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
                              <p className="text-[13px] font-medium text-slate-400 truncate">{user?.email}</p>
                            </div>

                            <div className="p-2 space-y-1">
                              <button onClick={() => { handleProfileClose(); navigate("/profile/view"); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                                <User size={16} className="text-indigo-400" /> View Profile
                              </button>
                              <button onClick={() => { handleProfileClose(); navigate("/profile/edit"); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                                <Settings size={16} className="text-indigo-400" /> Settings
                              </button>
                              <button onClick={() => { handleProfileClose(); navigate("/dashboard"); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                                <LayoutDashboard size={16} className="text-indigo-400" /> Dashboard
                              </button>
                            </div>
                            
                            <div className="p-2 border-t border-white/10">
                              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                                <LogOut size={16} /> Log out
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="outline-none">
                    <button className="text-slate-300 font-bold text-sm px-4 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-all outline-none focus:ring-2 focus:ring-indigo-500">
                      Log in
                    </button>
                  </Link>
                  <Link to="/register" className="outline-none">
                    <button className="relative overflow-hidden group bg-white text-slate-950 font-bold py-2.5 px-6 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-white">
                      <span className="relative z-10 flex items-center gap-2">Get Started</span>
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-100 to-violet-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Icon */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileOpen(true)} 
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Framer Motion) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50"
            />
            
            {/* Sliding Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full sm:w-[360px] h-full bg-slate-950 border-l border-white/10 z-50 shadow-2xl flex flex-col overflow-y-auto"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Mobile Drawer Header */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-[900] text-white tracking-tighter">Menu</span>
                  <button 
                    onClick={() => setMobileOpen(false)} 
                    className="p-2 text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-colors outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    <NavLink
                      key={item}
                      to={`/${item.toLowerCase()}`}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => `
                        text-2xl font-black transition-colors outline-none tracking-tight
                        ${isActive ? "text-indigo-400" : "text-slate-300 hover:text-white"}
                      `}
                    >
                      {item}
                    </NavLink>
                  ))}
                </div>

                {/* Mobile Auth / Footer Section */}
                <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4">
                  {isAuthenticated ? (
                    <>
                      {/* Mobile User Card */}
                      <div className="flex items-center gap-4 mb-2 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-sm backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                          {user?.profileImage ? (
                            <img src={getTransformedImage(user.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            userInitial
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-white leading-tight truncate">{user?.fullName}</p>
                          <p className="text-[13px] font-medium text-slate-400 truncate">{user?.email}</p>
                          <p className="text-xs font-bold text-indigo-400 mt-1 flex items-center gap-1">
                            <Sparkles size={12} /> {user?.credits} Credits
                          </p>
                        </div>
                      </div>

                      {/* Mobile Action Buttons */}
                      <div className="flex flex-col gap-2 mb-2">
                        <Link to="/profile/view" onClick={() => setMobileOpen(false)} className="outline-none">
                          <button className="w-full flex items-center gap-3 py-3 px-4 text-slate-300 font-bold bg-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-colors text-[15px] border border-white/5">
                            <User size={18} className="text-indigo-400" /> View Profile
                          </button>
                        </Link>
                        <Link to="/profile/edit" onClick={() => setMobileOpen(false)} className="outline-none">
                          <button className="w-full flex items-center gap-3 py-3 px-4 text-slate-300 font-bold bg-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-colors text-[15px] border border-white/5">
                            <Settings size={18} className="text-indigo-400" /> Settings
                          </button>
                        </Link>
                      </div>

                      <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="outline-none">
                        <button className="w-full flex items-center justify-center gap-2 py-4 text-white font-bold bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors text-lg shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                          <LayoutDashboard size={20} /> Go to Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                        className="w-full flex items-center justify-center gap-2 py-4 text-red-400 font-bold bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors text-lg outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <LogOut size={20} /> Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="outline-none">
                        <button className="w-full py-4 text-slate-300 font-bold bg-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-colors text-lg border border-white/5">
                          Log In
                        </button>
                      </Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)} className="outline-none">
                        <button className="w-full py-4 text-slate-950 font-bold bg-white rounded-xl hover:bg-slate-200 transition-colors text-lg shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                          Get Started
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}