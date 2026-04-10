const express = require('express');
const router = express.Router();

// Import the controller functions we just created
const { createOrder, verifyPayment } = require('../controllers/paymentController');
// 👇 Check this import! Ensure it points to your actual auth middleware file
const { protect } = require('../middlewares/auth');




// POST /api/payment/create-order
router.post('/create-order', protect, createOrder);

// POST /api/payment/verify-payment
router.post('/verify-payment', protect, verifyPayment);

module.exports = router;





module.exports = router;