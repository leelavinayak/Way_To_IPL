const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const Payment = require('../models/Payment');
const { generateTicketPDF } = require('../utils/generateTicket');
const { sendBookingConfirmation } = require('../utils/email');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

exports.createBooking = async (req, res) => {
  try {
    const { busId, from, to, journeyDate, passengers, seats, contactMobile, contactEmail } = req.body;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const bookedSeats = seats.filter(s => {
      const seat = bus.seats.find(se => se.seatNumber === s);
      return seat && seat.isBooked;
    });
    if (bookedSeats.length > 0) {
      return res.status(400).json({ message: `Seats already booked: ${bookedSeats.join(', ')}` });
    }

    const totalFare = bus.fare * seats.length;

    const bookingId = 'IPL' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      bus: busId,
      from,
      to,
      journeyDate,
      passengers,
      seats,
      totalFare,
      contactMobile,
      contactEmail,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId, paymentId, paymentMethod } = req.body;
    const booking = await Booking.findOne({ bookingId }).populate('bus');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.paymentId = paymentId;
    booking.paymentMethod = paymentMethod || 'razorpay';

    const qrData = JSON.stringify({
      bookingId: booking.bookingId,
      bus: booking.bus?.busName,
      from: booking.from,
      to: booking.to,
      date: booking.journeyDate,
      seats: booking.seats,
    });
    booking.qrCode = await QRCode.toDataURL(qrData);

    await booking.save();

    if (booking.bus) {
      for (const seatNum of booking.seats) {
        const seat = booking.bus.seats.find(s => s.seatNumber === seatNum);
        if (seat) {
          seat.isBooked = true;
        }
      }
      booking.bus.availableSeats = booking.bus.totalSeats - booking.bus.seats.filter(s => s.isBooked).length;
      await booking.bus.save();
    }

    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalFare,
      gateway: paymentMethod || 'razorpay',
      status: 'paid',
      gatewayPaymentId: paymentId,
    });

    sendBookingConfirmation(booking.contactEmail, booking);

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('bus', 'busName busType departureTime arrivalTime fare')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id })
      .populate('bus', 'busName busType departureTime arrivalTime fare company')
      .populate('user', 'name email mobile');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findOne({ bookingId: req.params.id }).populate('bus');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancellationReason = reason || 'No reason provided';
    await booking.save();

    if (booking.bus) {
      for (const seatNum of booking.seats) {
        const seat = booking.bus.seats.find(s => s.seatNumber === seatNum);
        if (seat) {
          seat.isBooked = false;
        }
      }
      booking.bus.availableSeats = booking.bus.totalSeats - booking.bus.seats.filter(s => s.isBooked).length;
      await booking.bus.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadTicket = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id }).populate('bus', 'busName busType departureTime arrivalTime fare');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const pdfBuffer = await generateTicketPDF(booking);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.bookingId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSeatLayout = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json({ seats: bus.seats, layout: bus.layout, busName: bus.busName, busType: bus.busType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
