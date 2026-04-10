import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// Lucide Icons
import { 
  Github, 
  Linkedin, 
  Link as LinkIcon, 
  Building2, 
  MapPin, 
  Edit3, 
  Mail, 
  Loader2,
  ArrowLeft
} from 'lucide-react';

export default function ProfileView() {
  const { user: contextUser, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(contextUser);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL; // <-- Get API URL from environment variable

  // Helper to apply ImageKit Face Crop transformation
  const getTransformedImage = (url) => {
    if (!url) return null;
    if (url.includes('ik.imagekit.io') && !url.includes('tr=')) {
      return `${url}?tr=w-256,h-256,fo-face`;
    }
    return url;
  };

  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const token = localStorage.getItem('omnicode_token');
        const response = await axios.get(`${apiUrl}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          setProfileData(response.data);
          // Silently update the global context so the Header stays in sync
          updateUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch fresh profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshProfile();
  }, []);

  const userInitial = profileData?.fullName?.charAt(0).toUpperCase() || 'U';

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-bold">
        <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 font-sans sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mt-6">
        
        {/* Navigation / Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg py-1 pr-2">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
        >
          
          {/* Header/Cover Area */}
          <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 relative overflow-hidden">
            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay" />
          </div>
          
          <div className="px-8 pb-10">
            {/* Avatar */}
            <motion.div variants={itemVariants} className="relative -mt-20 mb-6 flex justify-between items-end">
              <div className="w-36 h-36 rounded-full border-[6px] border-white bg-indigo-100 flex items-center justify-center text-5xl font-black text-indigo-500 shadow-md overflow-hidden bg-white">
                {profileData?.profileImage ? (
                  <img src={getTransformedImage(profileData.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              
              <Link to="/profile/edit" className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 mb-2 active:scale-95 shadow-sm border border-slate-200/60">
                <Edit3 size={16} /> <span className="hidden sm:inline">Edit Profile</span>
              </Link>
            </motion.div>

            {/* Title & Email */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-3xl md:text-4xl font-[950] text-slate-900 tracking-tight">{profileData?.fullName}</h1>
              <div className="flex items-center gap-2 text-slate-500 font-medium mt-2">
                <Mail size={16} /> {profileData?.email}
              </div>
            </motion.div>

            {/* Bio */}
            <motion.p variants={itemVariants} className="text-[17px] text-slate-600 mb-8 leading-relaxed font-medium">
              {profileData?.bio || <span className="italic text-slate-400">No bio yet. Add one in your settings to show off your expertise!</span>}
            </motion.p>

            {/* Company & Location Tags */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 text-slate-600 mb-10">
              {profileData?.company && (
                <div className="flex items-center gap-2 text-sm font-bold bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                  <Building2 size={18} className="text-indigo-500" /> {profileData.company}
                </div>
              )}
              {profileData?.location && (
                <div className="flex items-center gap-2 text-sm font-bold bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                  <MapPin size={18} className="text-rose-500" /> {profileData.location}
                </div>
              )}
            </motion.div>

            {/* Social & Portfolio Links */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 border-t border-slate-100 pt-8">
              {profileData?.githubUrl && (
                <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
                  <Github size={18} /> GitHub
                </a>
              )}
              
              {profileData?.linkedinUrl && (
                <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-[#0a66c2] text-white rounded-xl font-bold text-sm hover:bg-[#084e96] transition-all shadow-md active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2] focus-visible:ring-offset-2">
                  <Linkedin size={18} /> LinkedIn
                </a>
              )}
              
              {profileData?.portfolioUrl && (
                <a href={profileData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                  <LinkIcon size={18} /> Portfolio
                </a>
              )}

              {/* Prompt to add links if none exist */}
              {!profileData?.githubUrl && !profileData?.linkedinUrl && !profileData?.portfolioUrl && (
                <p className="text-sm text-slate-400 font-medium italic w-full">No developer links added yet.</p>
              )}
            </motion.div>

          </div>
        </motion.div>
        
      </div>
    </div>
  );
}