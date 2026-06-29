const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  seatNumber: { type: String, required: true },
});

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  journeyDate: {
    type: Date,
    required: true,
  },
  passengers: [passengerSchema],
  seats: [String],
  totalFare: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'phonepe', 'cod'],
    default: 'razorpay',
  },
  paymentId: {
    type: String,
    default: '',
  },
  qrCode: {
    type: String,
    default: '',
  },
  contactMobile: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  cancellationReason: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

bookingSchema.index({ user: 1, journeyDate: -1 });
bookingSchema.index({ bookingId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
