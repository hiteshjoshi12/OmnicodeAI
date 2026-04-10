// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, forgotPassword, resetPassword,resendOTP } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/resend-otp', resendOTP);

module.exports = router;