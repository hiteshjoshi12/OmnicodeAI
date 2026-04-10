// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middlewares/auth');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Configure Multer to store files in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit to prevent server overload
  }
});

// GET profile (View) 
// PUT profile (Update) - Now with Multer middleware
router.route('/profile')
  .get(protect, getUserProfile)
  // 'profileImage' must match the key name we used in formData.append('profileImage', imageFile) on the frontend
  .put(protect, upload.single('profileImage'), updateUserProfile); 

module.exports = router;