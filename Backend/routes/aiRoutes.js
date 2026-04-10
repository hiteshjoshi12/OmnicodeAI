// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { generateCode,generateImage,generateEmail } = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

// Apply the 'protect' middleware to ensure the user is logged in
router.post('/generate-code', protect, generateCode);
router.post('/generate-image', protect, generateImage);
router.post('/generate-email', protect, generateEmail); // <-- Add the route

module.exports = router;