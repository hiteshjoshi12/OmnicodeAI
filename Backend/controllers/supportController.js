const FAQ = require('../models/FAQ');

exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) return res.status(400).json({ reply: "Please ask a question." });

    // Search the database for the best matching FAQ
    const match = await FAQ.findOne(
      { $text: { $search: message } },
      { score: { $meta: "textScore" } } // Get the match score
    ).sort({ score: { $meta: "textScore" } }); // Sort by highest score

    // If we found a good match, return the answer
    if (match) {
      return res.status(200).json({ reply: match.answer });
    } else {
      // Fallback response if the DB doesn't know the answer
      return res.status(200).json({ 
        reply: "I'm sorry, I don't have an exact answer for that right now. Please email support@omnicode.ai and our human team will help you out!" 
      });
    }
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ reply: "Connection error. Please try again later." });
  }
};

// Fetch all FAQs for the menu
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find().select('question answer');
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Failed to load FAQs" });
  }
};