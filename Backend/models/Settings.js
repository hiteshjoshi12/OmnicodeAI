const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // --- PLATFORM SETTINGS (From SettingsTab) ---
  maintenanceMode: { type: Boolean, default: false },
  signupEnabled: { type: Boolean, default: true },
  defaultCredits: { type: Number, default: 15 },

  // --- AI SYSTEM PROMPTS (From CMSTab) ---
  prompts: [{
    id: { type: Number },
    name: { type: String },
    content: { type: String }
  }],
  
  // --- PRICING CONFIGURATION (From CMSTab) ---
  pricingPlans: [{
    id: { type: String },
    name: { type: String },
    price: { type: String },
    description: { type: String },
    features: { type: String },
    buttonText: { type: String },
    premium: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('Settings', settingsSchema);