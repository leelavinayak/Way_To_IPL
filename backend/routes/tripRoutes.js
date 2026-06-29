const express = require('express');
const router = express.Router();
const { getAllTrips, getTripById, searchTrips, getTripSeats, createTripBooking, confirmTripBooking } = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

router.get('/search', searchTrips);
router.get('/', getAllTrips);
router.get('/:tripId/seats', getTripSeats);
router.get('/:id', getTripById);
router.post('/:tripId/book', protect, createTripBooking);
router.post('/:tripId/confirm', protect, confirmTripBooking);

module.exports = router;
