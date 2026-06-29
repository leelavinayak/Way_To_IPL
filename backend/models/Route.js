const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  from: {
    type: String,
    required: [true, 'Starting location is required'],
    trim: true,
  },
  to: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
  },
  distance: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

routeSchema.index({ from: 1, to: 1 });

module.exports = mongoose.model('Route', routeSchema);
