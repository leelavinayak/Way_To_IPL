const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, sendMobileOTP, resetPasswordWithOTP, forgotPassword, verifyOTP, resetPassword, sendOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/send-mobile-otp', sendMobileOTP);
router.post('/reset-password-with-otp', resetPasswordWithOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/send-otp', sendOTP);

module.exports = router;
