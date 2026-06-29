const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const razorpay = require('../config/razorpay');

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ status: { $ne: 'cancelled' } }).sort({ departureDate: 1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchTrips = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    const filter = { status: { $ne: 'cancelled' } };
    if (origin) {
      filter.origin = new RegExp(origin, 'i');
    }
    if (destination) {
      filter.destination = new RegExp(destination, 'i');
    }
    const trips = await Trip.find(filter).sort({ departureDate: 1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTripSeats = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const seats = [];
    let seatNum = 1;

    const booked = trip.bookedSeats || [];
    const rows = trip.rows || 10;
    const leftSeatsPerRow = trip.seatsLeft || 2;
    const rightSeatsPerRow = trip.seatsRight || 2;
    const lastRowTotal = trip.lastRowSeats || (leftSeatsPerRow + rightSeatsPerRow);

    for (let r = 1; r <= rows; r++) {
      const isLastRow = r === rows;
      const leftCount = isLastRow
        ? Math.ceil(lastRowTotal / 2)
        : leftSeatsPerRow;
      const rightCount = isLastRow
        ? Math.floor(lastRowTotal / 2)
        : rightSeatsPerRow;

      for (let c = 0; c < leftCount; c++) {
        const sn = String(seatNum++);
        seats.push({
          seatNumber: sn,
          side: 'left',
          row: r,
          isBooked: booked.includes(sn),
        });
      }

      for (let c = 0; c < rightCount; c++) {
        const sn = String(seatNum++);
        seats.push({
          seatNumber: sn,
          side: 'right',
          row: r,
          isBooked: booked.includes(sn),
        });
      }
    }

    res.json({
      seats,
      rows,
      seatsLeft: leftSeatsPerRow,
      seatsRight: rightSeatsPerRow,
      lastRowSeats: lastRowTotal,
      totalSeats: trip.totalSeats || (rows * (leftSeatsPerRow + rightSeatsPerRow)),
      availableSeats: (trip.totalSeats || (rows * (leftSeatsPerRow + rightSeatsPerRow))) - booked.length,
      busType: trip.busType,
      isDoubleDecker: trip.isDoubleDecker,
      pricePerSeat: trip.pricePerSeat,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTripBooking = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { seats, passengers, contactMobile, contactEmail } = req.body;

    if (!seats || !seats.length || !passengers || !passengers.length) {
      return res.status(400).json({ message: 'Seats and passengers are required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const booked = trip.bookedSeats || [];
    const alreadyBooked = seats.filter(s => booked.includes(s));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({ message: `Seats already booked: ${alreadyBooked.join(', ')}` });
    }

    const totalFare = trip.pricePerSeat * seats.length;
    const bookingId = 'IPL' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      from: trip.origin,
      to: trip.destination,
      journeyDate: trip.departureDate,
      passengers,
      seats,
      totalFare,
      contactMobile,
      contactEmail,
    });

    const options = {
      amount: totalFare * 100,
      currency: 'INR',
      receipt: bookingId,
    };
    const order = await razorpay.orders.create(options);

    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: totalFare,
      gateway: 'razorpay',
      status: 'created',
      gatewayOrderId: order.id,
    });

    res.json({
      bookingId: booking.bookingId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmTripBooking = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSig = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payment = await Payment.findOne({ gatewayOrderId: razorpay_order_id });
    if (payment) {
      payment.status = 'paid';
      payment.gatewayPaymentId = razorpay_payment_id;
      payment.gatewaySignature = razorpay_signature;
      await payment.save();
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.paymentId = razorpay_payment_id;
    booking.paymentMethod = 'razorpay';

    const QRCode = require('qrcode');
    const qrData = JSON.stringify({
      bookingId: booking.bookingId,
      trip: tripId,
      from: booking.from,
      to: booking.to,
      date: booking.journeyDate,
      seats: booking.seats,
    });
    booking.qrCode = await QRCode.toDataURL(qrData);
    await booking.save();

    const trip = await Trip.findById(tripId);
    if (trip) {
      if (!trip.bookedSeats) trip.bookedSeats = [];
      for (const seatNum of booking.seats) {
        if (!trip.bookedSeats.includes(seatNum)) {
          trip.bookedSeats.push(seatNum);
        }
      }
      trip.availableSeats = trip.totalSeats - trip.bookedSeats.length;
      await trip.save();
    }

    try {
      const { sendBookingConfirmation } = require('../utils/email');
      if (booking.contactEmail) {
        sendBookingConfirmation(booking.contactEmail, booking);
      }
    } catch (_) {}

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
