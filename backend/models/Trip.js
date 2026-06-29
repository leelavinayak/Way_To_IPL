const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  matchName: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: Number, default: 0 },
  isRecurring: { type: Boolean, default: false },
  endDate: { type: Date, default: null },
  cancelledDates: [{ type: String }],
  busOperator: { type: String, default: '' },
  busNumber: { type: String, default: '' },
  busMobile: { type: String, default: '' },
  busDetails: { type: String, default: '' },
  busLogo: { type: String, default: '' },
  busImage: { type: String, default: '' },
  busType: { type: String, default: 'ac_seater' },
  isDoubleDecker: { type: Boolean, default: false },
  seatsLeft: { type: Number, default: 0 },
  seatsRight: { type: Number, default: 0 },
  rows: { type: Number, default: 10 },
  lastRowSeats: { type: Number, default: 5 },
  totalSeats: { type: Number, default: 40 },
  availableSeats: { type: Number, default: 40 },
  pricePerSeat: { type: Number, required: true },
  bookedSeats: { type: [String], default: [] },
  status: { type: String, enum: ['upcoming', 'active', 'completed', 'cancelled'], default: 'upcoming' },
  bookingsCloseBefore: { type: Number, default: 2 },
  returnTripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
}, {
  timestamps: true,
  collection: 'trips',
});

module.exports = mongoose.model('Trip', tripSchema);
