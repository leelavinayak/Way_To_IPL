const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment, createPhonePeOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/phonepe/create-order', protect, createPhonePeOrder);

module.exports = router;
