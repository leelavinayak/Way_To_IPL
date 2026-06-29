const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"IPL Travels" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
};

const sendOTPEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'IPL Travels - OTP Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #FAEDCD; color: #5D4037; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="font-size: 28px; font-weight: bold; color: #D4A373;">IPL TRAVELS</span><br />
          <span style="font-size: 11px; color: #CCD5AE;">Royal Challengers Bangalore</span>
        </div>
        <p style="text-align: center;">Your OTP for verification is:</p>
        <div style="text-align: center; font-size: 36px; font-weight: bold; color: #D4A373; letter-spacing: 8px; margin: 20px 0;">${otp}</div>
        <p style="text-align: center;">This OTP expires in 10 minutes.</p>
        <hr style="border-color: #D4A373; opacity: 0.3;" />
        <p style="text-align: center; font-size: 12px; color: #8c7252;">IPL Travels - Book your bus tickets with ease!</p>
      </div>
    `,
  });
};

const sendBookingConfirmation = async (email, booking) => {
  return sendEmail({
    to: email,
    subject: `Booking Confirmed - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #FAEDCD; color: #5D4037; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="font-size: 28px; font-weight: bold; color: #D4A373;">IPL TRAVELS</span><br />
          <span style="font-size: 11px; color: #CCD5AE;">Royal Challengers Bangalore</span>
        </div>
        <p style="text-align: center;">Your booking has been confirmed!</p>
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(212, 163, 115, 0.3);">
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>From:</strong> ${booking.from} → <strong>To:</strong> ${booking.to}</p>
          <p><strong>Date:</strong> ${new Date(booking.journeyDate).toLocaleDateString()}</p>
          <p><strong>Seats:</strong> ${booking.seats?.join(', ')}</p>
          <p><strong>Total:</strong> ₹${booking.totalFare}</p>
        </div>
        <p style="text-align: center; color: #8c7252;">Thank you for choosing IPL Travels!</p>
      </div>
    `,
  });
};

module.exports = { sendOTPEmail, sendBookingConfirmation, sendEmail };
