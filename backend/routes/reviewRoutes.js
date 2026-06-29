const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createReview,
  getBusReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

router.get('/bus/:busId', getBusReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
