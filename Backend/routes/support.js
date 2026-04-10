const express = require('express');
const router = express.Router();
const { handleChat, getFaqs } = require('../controllers/supportController'); 

// The old route (you can keep it in case you want text search later)
router.post('/chat', handleChat);

// --- NEW ROUTE ---
router.get('/faqs', getFaqs); 

module.exports = router;