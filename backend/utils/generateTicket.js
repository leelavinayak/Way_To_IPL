const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const generateTicketPDF = async (booking) => {
  const qrData = `Booking ID: ${booking.bookingId}\nBus: ${booking.bus?.busName || 'N/A'}\nFrom: ${booking.from}\nTo: ${booking.to}\nDate: ${new Date(booking.journeyDate).toLocaleDateString()}`;
  const qrImage = await QRCode.toDataURL(qrData);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers = [];

    doc.on('data', buffer => buffers.push(buffer));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const bgColor = '#FAEDCD';
    const accent = '#D4A373';
    const textColor = '#5D4037';

    doc.rect(0, 0, doc.page.width, doc.page.height).fill(bgColor);

    doc.fontSize(32).font('Helvetica-Bold').fillColor('#D4A373')
      .text('IPL TRAVELS', { align: 'center' });
    doc.moveDown(0.1);
    doc.fontSize(12).font('Helvetica').fillColor('#CCD5AE')
      .text('Royal Challengers Bangalore', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica').fillColor(textColor)
      .text('Bus Booking Ticket', { align: 'center' });
    doc.moveDown(0.5);

    doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor(accent).stroke();
    doc.moveDown(0.5);

    const leftX = 50;
    const rightX = 320;
    const col1 = (text, value, x, y) => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(accent).text(text, x, y);
      doc.fontSize(11).font('Helvetica').fillColor(textColor).text(value, x, y + 15);
    };

    let y = doc.y;
    col1('Booking ID', booking.bookingId, leftX, y);
    col1('Journey Date', new Date(booking.journeyDate).toLocaleDateString(), rightX, y);
    y += 50;
    col1('From', booking.from, leftX, y);
    col1('To', booking.to, rightX, y);
    y += 50;
    col1('Bus Name', booking.bus?.busName || 'N/A', leftX, y);
    col1('Bus Type', booking.bus?.busType || 'N/A', rightX, y);
    y += 50;
    col1('Departure', booking.bus?.departureTime || 'N/A', leftX, y);
    col1('Arrival', booking.bus?.arrivalTime || 'N/A', rightX, y);
    y += 50;
    col1('Seats', booking.seats?.join(', ') || 'N/A', leftX, y);
    col1('Total Fare', `₹${booking.totalFare}`, rightX, y);

    y += 70;

    doc.moveTo(40, y).lineTo(550, y).strokeColor(accent).stroke();
    y += 15;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(accent).text('Passenger Details', leftX, y);
    y += 25;

    if (booking.passengers && booking.passengers.length > 0) {
      booking.passengers.forEach((p, i) => {
        doc.fontSize(10).font('Helvetica').fillColor(textColor)
          .text(`${i + 1}. ${p.name} | Age: ${p.age} | Gender: ${p.gender} | Seat: ${p.seatNumber}`, leftX, y);
        y += 20;
      });
    }

    y += 20;
    doc.moveTo(40, y).lineTo(550, y).strokeColor(accent).stroke();
    y += 20;

    doc.fontSize(8).font('Helvetica').fillColor('#888888')
      .text('Thank you for choosing IPL Travels!', leftX, y, { align: 'center' });

    const imgBuffer = Buffer.from(qrImage.split(',')[1], 'base64');
    doc.image(imgBuffer, doc.page.width - 130, 40, { width: 80, height: 80 });

    doc.end();
  });
};

module.exports = { generateTicketPDF };
