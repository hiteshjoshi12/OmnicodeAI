import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  User, 
  Mail, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Github, 
  Linkedin, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

export default function Profile() {
  // Grab the NEW updateUser function we added to the context
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    company: user?.company || '',
    location: user?.location || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
  });
  
  // States for Image Handling
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  // Helper to apply ImageKit Face Crop transformation
  const getTransformedImage = (url) => {
    if (!url) return null;
    if (url.includes('ik.imagekit.io') && !url.includes('tr=')) {
      return `${url}?tr=w-256,h-256,fo-face`;
    }
    return url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const token = localStorage.getItem('omnicode_token');
      const submitData = new FormData();
      
      Object.keys(formData).forEach((key) => {
        if (key !== 'email') {
          submitData.append(key, formData[key]);
        }
      });

      if (imageFile) {
        submitData.append('profileImage', imageFile);
      }

      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.status === 200) {
        // Use the new updateUser function so the Header updates instantly!
        updateUser(response.data.user); 
        
        setSuccess('Profile updated successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const userInitial = user?.fullName?.charAt(0).toUpperCase() || 'U';

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pt-32 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-10 flex items-center gap-5">
          <Link to="/dashboard" className="p-3 bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-[900] text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 font-medium mt-1.5 text-[15px]">Manage your personal profile and subscription details.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Quick Info & Billing */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10" />
              
              <div className="flex items-center gap-3 mb-6 text-indigo-600">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Award size={20} />
                </div>
                <h3 className="font-bold text-slate-900 tracking-wide">Current Plan</h3>
              </div>
              
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900 tracking-tight">{user?.plan || 'Free'}</span>
              </div>
              
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Credits Left</span>
                </div>
                <span className="text-3xl font-black text-indigo-600">{user?.credits || 0}</span>
              </div>
              
              <button className="w-full mt-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-[15px] shadow-lg shadow-slate-200 active:scale-[0.98] outline-none focus-visible:ring-4 focus-visible:ring-slate-900/30">
                Upgrade Plan
              </button>
            </div>
          </motion.div>

          {/* Right Column: Edit Profile Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Personal Information</h2>
              
              {/* Animated Success Banner */}
              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-3 shadow-sm">
                      <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                      {success}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Avatar Upload UI */}
                <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                  <div 
                    className="relative group cursor-pointer" 
                    onClick={() => fileInputRef.current.click()}
                    title="Change Profile Picture"
                  >
                    <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-3xl font-black text-indigo-500 transition-transform group-hover:scale-105">
                      {previewImage || user?.profileImage ? (
                        <img 
                          src={previewImage || getTransformedImage(user?.profileImage)} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <div className="absolute inset-0 bg-slate-900/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">Profile Picture</h3>
                    <p className="text-[13px] text-slate-500 mb-3 mt-1 font-medium">JPG, GIF or PNG. Max size of 2MB.</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                    />
                    <button type="button" onClick={() => fileInputRef.current.click()} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                      Upload new image
                    </button>
                  </div>
                </div>

                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <User size={16} className="text-slate-400" /> Full Name
                    </label>
                    <input
                      type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium bg-slate-50 focus:bg-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <Mail size={16} className="text-slate-400" /> Email Address
                    </label>
                    <input
                      type="email" name="email" value={formData.email} disabled
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none text-slate-500 font-medium bg-slate-100 cursor-not-allowed shadow-sm"
                      title="Email cannot be changed"
                    />
                  </div>
                </div>

                {/* Section 2: Bio */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <FileText size={16} className="text-slate-400" /> Bio
                  </label>
                  <textarea
                    name="bio" value={formData.bio} onChange={handleChange} rows="3"
                    placeholder="Tell us a little about yourself and what you build..."
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium bg-slate-50 focus:bg-white resize-none shadow-sm"
                  />
                </div>

                {/* Section 3: Professional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <Building2 size={16} className="text-slate-400" /> Company
                    </label>
                    <input
                      type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Acme Corp"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium bg-slate-50 focus:bg-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <MapPin size={16} className="text-slate-400" /> Location
                    </label>
                    <input
                      type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. San Francisco, CA"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium bg-slate-50 focus:bg-white shadow-sm"
                    />
                  </div>
                </div>

                {/* Section 4: Social Links */}
                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Developer Links</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        <Github size={16} className="text-slate-400" /> GitHub URL
                      </label>
                      <input
                        type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/username"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium bg-slate-50 focus:bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        <Linkedin size={16} className="text-slate-400" /> LinkedIn URL
                      </label>
                      <input
                        type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium bg-slate-50 focus:bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        <LinkIcon size={16} className="text-slate-400" /> Portfolio Website
                      </label>
                      <input
                        type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium bg-slate-50 focus:bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 py-4 px-8 rounded-xl shadow-lg shadow-indigo-200 bg-indigo-600 text-white text-[15px] font-black hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 outline-none focus:ring-4 focus:ring-indigo-500/30"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Saving...</>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}