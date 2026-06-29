const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['created', 'attempted', 'paid', 'failed', 'refunded'],
    default: 'created',
  },
  gateway: {
    type: String,
    enum: ['razorpay', 'phonepe'],
    required: true,
  },
  gatewayOrderId: {
    type: String,
  },
  gatewayPaymentId: {
    type: String,
  },
  gatewaySignature: {
    type: String,
  },
  refundId: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
