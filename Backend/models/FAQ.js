const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  keywords: [{ type: String }] // e.g., ["pricing", "cost", "money"]
});

// Enable text searching on the question and keywords
faqSchema.index({ question: 'text', keywords: 'text' });

module.exports = mongoose.model('FAQ', faqSchema);