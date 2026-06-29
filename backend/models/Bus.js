const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  isSleeper: { type: Boolean, default: false },
  deck: { type: String, enum: ['lower', 'upper', 'none'], default: 'none' },
  side: { type: String, enum: ['left', 'right', 'none'], default: 'none' },
  row: { type: Number, default: 0 },
  col: { type: Number, default: 0 },
});

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true,
  },
  busType: {
    type: String,
    enum: ['AC Seater', 'AC Sleeper', 'AC Semi-Sleeper', 'Non-AC Seater', 'Non-AC Sleeper', 'Double Decker', 'Volvo AC'],
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusCompany',
    required: true,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 40,
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 40,
  },
  seats: [seatSchema],
  leftSeatCount: { type: Number, default: 0 },
  rightSeatCount: { type: Number, default: 0 },
  amenities: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  layout: {
    type: String,
    enum: ['seater', 'sleeper', 'semi-sleeper', 'double-decker'],
    default: 'seater',
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
  },
  boardingPoints: [{
    location: String,
    time: String,
  }],
  droppingPoints: [{
    location: String,
    time: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bus', busSchema);
