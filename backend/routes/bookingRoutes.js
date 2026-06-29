const express = require('express');
const router = express.Router();
const { createBooking, confirmBooking, getUserBookings, getBookingById, cancelBooking, downloadTicket, getSeatLayout } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.get('/bus/:busId/seats', getSeatLayout);

router.use(protect);
router.post('/', createBooking);
router.post('/confirm', confirmBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);
router.get('/:id/ticket', downloadTicket);

module.exports = router;
