const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  adminLogin,
  getDashboardStats,
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getAllUsers,
  getAllReviews,
  deleteReview,
  getAllContacts,
  deleteContact,
  exportBusBookings,
  exportAllBookings,
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} = require('../controllers/adminController');

router.post('/login', adminLogin);

router.use(protect, admin);

router.get('/dashboard/stats', getDashboardStats);

router.get('/buses', getAllBuses);
router.post('/buses', createBus);
router.get('/buses/:id', getBusById);
router.put('/buses/:id', updateBus);
router.delete('/buses/:id', deleteBus);
router.get('/buses/:busId/bookings/export', exportBusBookings);

router.get('/bookings', getAllBookings);
router.get('/bookings/export', exportAllBookings);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id/status', updateBookingStatus);

router.get('/users', getAllUsers);

router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

router.get('/contacts', getAllContacts);
router.delete('/contacts/:id', deleteContact);

router.get('/companies', getCompanies);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

router.get('/routes/list', getRoutes);
router.post('/routes', createRoute);
router.put('/routes/:id', updateRoute);
router.delete('/routes/:id', deleteRoute);

module.exports = router;
