// models/History.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  appType: { 
    type: String, 
    enum: ['code', 'email', 'image'], 
    required: true 
  },
  provider: {
    type: String,
    enum: ['gemini', 'openai', 'claude'],
    default: 'gemini' // Tracks which LLM powered this request
  },
  title: { 
    type: String, 
    required: true 
  },
  prompt: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true // The generated code, email text, or image URL
  },
  creditsUsed: {
    type: Number,
    required: true,
    default: 1 // 1 for text/code, 2 for images
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, 
    default: {} // Flexible field for: { language: 'react' } or { style: 'Anime', ratio: '16:9' }
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('History', historySchema);