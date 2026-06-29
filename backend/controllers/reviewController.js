const Review = require('../models/Review');
const Booking = require('../models/Booking');

const createReview = async (req, res) => {
  try {
    const { bus, booking, rating, comment } = req.body;

    const existing = await Review.findOne({ user: req.user._id, bus });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this bus' });
    }

    if (booking) {
      const bookingDoc = await Booking.findOne({ _id: booking, user: req.user._id, bus });
      if (!bookingDoc) {
        return res.status(400).json({ message: 'Invalid booking for this bus' });
      }
    }

    const review = await Review.create({
      user: req.user._id,
      bus,
      booking,
      rating,
      comment,
    });

    const populated = await Review.findById(review._id)
      .populate('user', 'name profileImage');

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this bus' });
    }
    res.status(500).json({ message: error.message });
  }
};

const getBusReviews = async (req, res) => {
  try {
    const { busId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ bus: busId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ bus: busId });

    const stats = await Review.aggregate([
      { $match: { bus: require('mongoose').Types.ObjectId.createFromHexString(busId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating',
          },
        },
      },
    ]);

    let averageRating = 0;
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (stats.length > 0) {
      averageRating = Math.round(stats[0].averageRating * 10) / 10;
      stats[0].ratingDistribution.forEach((r) => {
        if (ratingDistribution[r] !== undefined) {
          ratingDistribution[r]++;
        }
      });
    }

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        averageRating,
        totalReviews: total,
        ratingDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({ _id: id, user: req.user._id });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    const populated = await Review.findById(review._id)
      .populate('user', 'name profileImage');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({ _id: id, user: req.user._id });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getBusReviews, updateReview, deleteReview };
