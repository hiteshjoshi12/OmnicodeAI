// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Core Identity
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  
  // ---> NEW: Role-Based Access Control <---
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  
  // Profile Additions
  profileImage: { type: String, default: '' },
  bio: { type: String, trim: true, maxLength: 300, default: '' },
  company: { type: String, trim: true, default: '' },
  location: { type: String, trim: true, default: '' },

  // Developer & Social Links
  githubUrl: { type: String, trim: true, default: '' },
  linkedinUrl: { type: String, trim: true, default: '' },
  portfolioUrl: { type: String, trim: true, default: '' },
  
  // OTP Verification
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },

  // ---> ADD THESE TWO LINES <---
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

  // SaaS Billing & Platform Logic
  plan: { 
    type: String, 
    enum: ['Free', 'Pro', 'Enterprise'], 
    default: 'Free' 
  },
  credits: { type: Number, default: 15 },
  
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);