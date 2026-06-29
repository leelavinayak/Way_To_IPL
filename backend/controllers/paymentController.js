const razorpay = require('../config/razorpay');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const options = {
      amount: booking.totalFare * 100,
      currency: 'INR',
      receipt: bookingId,
    };
    const order = await razorpay.orders.create(options);
    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalFare,
      gateway: 'razorpay',
      status: 'created',
      gatewayOrderId: order.id,
    });
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    const expectedSig = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    const payment = await Payment.findOne({ gatewayOrderId: razorpay_order_id });
    if (payment) {
      payment.status = 'paid';
      payment.gatewayPaymentId = razorpay_payment_id;
      payment.gatewaySignature = razorpay_signature;
      await payment.save();
    }
    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPhonePeOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const merchantTransactionId = 'MT' + Date.now();
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: req.user._id.toString(),
      amount: booking.totalFare * 100,
      redirectUrl: `${process.env.CLIENT_URL}/payment-success?bookingId=${bookingId}`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.CLIENT_URL}/api/payments/phonepe-callback`,
      paymentInstrument: { type: 'PAY_PAGE' },
    };
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const checksum = require('crypto')
      .createHash('sha256')
      .update(base64Payload + '/pg/v1/pay' + process.env.PHONEPE_MERCHANT_ID)
      .digest('hex') + '###1';

    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalFare,
      gateway: 'phonepe',
      status: 'created',
    });

    res.json({
      url: `https://api.phonepe.com/apis/hermes/pg/v1/pay`,
      payload: base64Payload,
      checksum,
      merchantTransactionId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
