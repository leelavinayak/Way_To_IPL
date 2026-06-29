const User = require('../models/User');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const BusCompany = require('../models/BusCompany');
const Route = require('../models/Route');
const generateToken = require('../utils/generateToken');
const ExcelJS = require('exceljs');

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const isEmail = email.includes('@');
    const user = isEmail
      ? await User.findOne({ email }).select('+password')
      : await User.findOne({ mobile: email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        mobile: user.mobile, role: user.role,
        profileImage: user.profileImage, createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalReviews, totalContacts, totalBookings] = await Promise.all([
      User.countDocuments(),
      Review.countDocuments(),
      Contact.countDocuments(),
      Booking.countDocuments(),
    ]);
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 }).limit(5)
      .populate('user', 'name email mobile')
      .populate('bus', 'busName busNumber');
    res.json({
      stats: { totalUsers, totalReviews, totalContacts, totalBookings },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBus = async (req, res) => {
  try {
    const {
      busName, busType, company, route, departureTime, arrivalTime,
      duration, fare, amenities, layout, seatType, seatMap,
      totalSeats, leftSeatCount, rightSeatCount,
      boardingPoints, droppingPoints, busNumber,
    } = req.body;

    const seats = (seatMap || []).map(s => ({
      seatNumber: s.seatNumber,
      isBooked: false,
      isSleeper: seatType === 'sleeper',
      deck: s.deck || 'none',
      side: s.side || 'none',
      row: s.row || 0,
      col: s.col || 0,
    }));

    const bus = await Bus.create({
      busName,
      busType,
      company,
      route,
      departureTime,
      arrivalTime,
      duration,
      fare,
      totalSeats: totalSeats || seats.length,
      availableSeats: totalSeats || seats.length,
      seats,
      leftSeatCount: leftSeatCount || 0,
      rightSeatCount: rightSeatCount || 0,
      amenities: amenities || [],
      layout: layout || 'seater',
      boardingPoints: boardingPoints || [],
      droppingPoints: droppingPoints || [],
    });

    const populated = await Bus.findById(bus._id)
      .populate('company', 'name')
      .populate('route', 'from to');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({})
      .populate('company', 'name')
      .populate('route', 'from to')
      .sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate('company', 'name')
      .populate('route', 'from to');
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const {
      busName, busType, company, route, departureTime, arrivalTime,
      duration, fare, amenities, layout, seatType, seatMap,
      totalSeats, leftSeatCount, rightSeatCount, isActive,
      boardingPoints, droppingPoints, busNumber,
    } = req.body;

    const updateData = {};
    if (busName !== undefined) updateData.busName = busName;
    if (busType !== undefined) updateData.busType = busType;
    if (company !== undefined) updateData.company = company;
    if (route !== undefined) updateData.route = route;
    if (departureTime !== undefined) updateData.departureTime = departureTime;
    if (arrivalTime !== undefined) updateData.arrivalTime = arrivalTime;
    if (duration !== undefined) updateData.duration = duration;
    if (fare !== undefined) updateData.fare = fare;
    if (amenities !== undefined) updateData.amenities = amenities;
    if (layout !== undefined) updateData.layout = layout;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (leftSeatCount !== undefined) updateData.leftSeatCount = leftSeatCount;
    if (rightSeatCount !== undefined) updateData.rightSeatCount = rightSeatCount;
    if (boardingPoints !== undefined) updateData.boardingPoints = boardingPoints;
    if (droppingPoints !== undefined) updateData.droppingPoints = droppingPoints;

    if (seatMap) {
      updateData.seats = seatMap.map(s => ({
        seatNumber: s.seatNumber,
        isBooked: s.isBooked || false,
        isSleeper: seatType === 'sleeper',
        deck: s.deck || 'none',
        side: s.side || 'none',
        row: s.row || 0,
        col: s.col || 0,
      }));
      updateData.totalSeats = totalSeats || seatMap.length;
      updateData.availableSeats = totalSeats || seatMap.length;
    }

    const bus = await Bus.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('company', 'name')
      .populate('route', 'from to');
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    await Booking.updateMany({ bus: req.params.id }, { status: 'cancelled' });
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { bus: busId, status, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = {};
    if (busId) query.bus = busId;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.journeyDate = {};
      if (startDate) query.journeyDate.$gte = new Date(startDate);
      if (endDate) query.journeyDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'name email mobile')
        .populate('bus', 'busName busNumber busType'),
      Booking.countDocuments(query),
    ]);

    res.json({
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email mobile')
      .populate('bus', 'busName busNumber busType');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email mobile')
     .populate('bus', 'busName busNumber busType');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments({}),
    ]);
    res.json({
      users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reviews, total] = await Promise.all([
      Review.find({})
        .sort({ createdAt: -1 })
        .skip(skip).limit(parseInt(limit))
        .populate('user', 'name email')
        .populate('bus', 'busName busNumber'),
      Review.countDocuments({}),
    ]);
    res.json({
      reviews,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [contacts, total] = await Promise.all([
      Contact.find({}).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Contact.countDocuments({}),
    ]);
    res.json({
      contacts,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportBusBookings = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId).populate('company', 'name');
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    const bookings = await Booking.find({ bus: req.params.busId, status: { $ne: 'pending' } })
      .populate('user', 'name email mobile')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bookings');

    worksheet.columns = [
      { header: 'Booking ID', key: 'bookingId', width: 20 },
      { header: 'Passenger Name', key: 'passengerName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Seat Numbers', key: 'seats', width: 20 },
      { header: 'Seat Type', key: 'seatType', width: 12 },
      { header: 'Amount Paid', key: 'amount', width: 14 },
      { header: 'Booking Date', key: 'bookingDate', width: 20 },
      { header: 'Journey Date', key: 'journeyDate', width: 20 },
      { header: 'Booking Status', key: 'status', width: 16 },
      { header: 'Payment Status', key: 'paymentStatus', width: 16 },
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0057B8' } };

    bookings.forEach(booking => {
      const passengerNames = booking.passengers.map(p => p.name).join(', ');
      const seatNumbers = booking.seats.join(', ');
      worksheet.addRow({
        bookingId: booking.bookingId,
        passengerName: passengerNames || booking.contactMobile,
        email: booking.contactEmail,
        phone: booking.contactMobile,
        seats: seatNumbers,
        seatType: bus.layout || 'Seater',
        amount: booking.totalFare,
        bookingDate: new Date(booking.createdAt).toLocaleDateString('en-IN'),
        journeyDate: new Date(booking.journeyDate).toLocaleDateString('en-IN'),
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      });
    });

    const fileName = `${bus.busName.replace(/\s+/g, '_')}_bookings.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportAllBookings = async (req, res) => {
  try {
    const { bus: busId, status, startDate, endDate } = req.query;
    const query = {};
    if (busId) query.bus = busId;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.journeyDate = {};
      if (startDate) query.journeyDate.$gte = new Date(startDate);
      if (endDate) query.journeyDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email mobile')
      .populate('bus', 'busName busNumber layout')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Bookings');

    worksheet.columns = [
      { header: 'Booking ID', key: 'bookingId', width: 20 },
      { header: 'Bus Name', key: 'busName', width: 25 },
      { header: 'Passenger Name', key: 'passengerName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Seat Numbers', key: 'seats', width: 20 },
      { header: 'Seat Type', key: 'seatType', width: 12 },
      { header: 'Amount Paid', key: 'amount', width: 14 },
      { header: 'Booking Date', key: 'bookingDate', width: 20 },
      { header: 'Journey Date', key: 'journeyDate', width: 20 },
      { header: 'Booking Status', key: 'status', width: 16 },
      { header: 'Payment Status', key: 'paymentStatus', width: 16 },
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0057B8' } };

    bookings.forEach(booking => {
      const passengerNames = booking.passengers.map(p => p.name).join(', ');
      const seatNumbers = booking.seats.join(', ');
      worksheet.addRow({
        bookingId: booking.bookingId,
        busName: booking.bus?.busName || 'N/A',
        passengerName: passengerNames || booking.contactMobile,
        email: booking.contactEmail,
        phone: booking.contactMobile,
        seats: seatNumbers,
        seatType: booking.bus?.layout || 'Seater',
        amount: booking.totalFare,
        bookingDate: new Date(booking.createdAt).toLocaleDateString('en-IN'),
        journeyDate: new Date(booking.journeyDate).toLocaleDateString('en-IN'),
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      });
    });

    const fileName = `all_bookings_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await BusCompany.find({}).sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const { name, description } = req.body;
    const company = await BusCompany.create({ name, description });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (isActive !== undefined) update.isActive = isActive;
    const company = await BusCompany.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await BusCompany.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({}).sort({ from: 1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const { from, to, distance, duration } = req.body;
    const route = await Route.create({ from, to, distance, duration });
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { from, to, distance, duration, isActive } = req.body;
    const update = {};
    if (from !== undefined) update.from = from;
    if (to !== undefined) update.to = to;
    if (distance !== undefined) update.distance = distance;
    if (duration !== undefined) update.duration = duration;
    if (isActive !== undefined) update.isActive = isActive;
    const route = await Route.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
