const express = require('express');
const router = express.Router();
const { searchBuses, getBusById, getAllBuses, getBusCompanies, getRoutes } = require('../controllers/busController');

router.get('/search', searchBuses);
router.get('/companies', getBusCompanies);
router.get('/routes', getRoutes);
router.get('/', getAllBuses);
router.get('/:id', getBusById);

module.exports = router;
