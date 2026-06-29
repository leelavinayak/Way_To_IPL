require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const BusCompany = require('../models/BusCompany');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const User = require('../models/User');

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await BusCompany.deleteMany({});
  await Route.deleteMany({});
  await Bus.deleteMany({});

  await User.create({
    name: 'Admin User',
    email: 'admin@ipltravels.com',
    password: 'admin123',
    mobile: '9999999999',
    role: 'admin',
    isVerified: true,
  });

  const companies = await BusCompany.insertMany([
    { name: 'APSRTC', logo: '', description: 'Andhra Pradesh State Road Transport Corporation' },
    { name: 'Orange Travels', logo: '', description: 'Premium bus services across South India' },
    { name: 'Kaveri Travels', logo: '', description: 'Reliable intercity bus services' },
    { name: 'VRL Travels', logo: '', description: 'Vijayanand Roadlines - India\'s largest bus fleet' },
    { name: 'SRS Travels', logo: '', description: 'SRS Travels - Comfortable journeys' },
    { name: 'Morning Star Travels', logo: '', description: 'Morning Star - Your travel partner' },
    { name: 'IntrCity SmartBus', logo: '', description: 'SmartBus - Smart travel solutions' },
  ]);

  const routes = await Route.insertMany([
    { from: 'Hyderabad', to: 'Bangalore', distance: 570, duration: '8h 30m' },
    { from: 'Hyderabad', to: 'Chennai', distance: 630, duration: '9h 15m' },
    { from: 'Hyderabad', to: 'Mumbai', distance: 710, duration: '10h 30m' },
    { from: 'Hyderabad', to: 'Vijayawada', distance: 280, duration: '4h 30m' },
    { from: 'Bangalore', to: 'Chennai', distance: 350, duration: '5h 30m' },
    { from: 'Bangalore', to: 'Mumbai', distance: 840, duration: '12h 00m' },
    { from: 'Chennai', to: 'Hyderabad', distance: 630, duration: '9h 15m' },
    { from: 'Mumbai', to: 'Pune', distance: 150, duration: '2h 30m' },
    { from: 'Delhi', to: 'Jaipur', distance: 280, duration: '4h 45m' },
    { from: 'Delhi', to: 'Agra', distance: 230, duration: '3h 30m' },
  ]);

  const busData = [];
  const layouts = ['seater', 'sleeper', 'semi-sleeper', 'double-decker'];
  const types = ['AC Seater', 'AC Sleeper', 'AC Semi-Sleeper', 'Non-AC Seater', 'Non-AC Sleeper', 'Double Decker', 'Volvo AC'];
  const amenitiesList = ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'Reading Light', 'GPS Tracking', 'Emergency Exit', 'CCTV', 'Pushback Seats', 'Live Tracking'];

  for (let i = 0; i < 20; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const route = routes[Math.floor(Math.random() * routes.length)];
    const layout = layouts[Math.floor(Math.random() * layouts.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const totalSeats = layout === 'double-decker' ? 56 : layout === 'sleeper' ? 30 : 40;
    const depH = 6 + Math.floor(Math.random() * 14);
    const depM = Math.random() > 0.5 ? '00' : '30';
    const arrH = (depH + 4 + Math.floor(Math.random() * 6)) % 24;
    const arrM = Math.random() > 0.5 ? '00' : '30';
    const duration = `${4 + Math.floor(Math.random() * 8)}h ${Math.random() > 0.5 ? '00' : '30'}m`;
    const fare = 300 + Math.floor(Math.random() * 1500);

    const seats = [];
    if (layout === 'double-decker') {
      for (let d = 0; d < 2; d++) {
        for (let r = 1; r <= 28; r++) {
          seats.push({ seatNumber: `${d === 0 ? 'L' : 'U'}${r}`, isBooked: false, isSleeper: true, deck: d === 0 ? 'lower' : 'upper' });
        }
      }
    } else if (layout === 'sleeper') {
      for (let r = 1; r <= 30; r++) {
        seats.push({ seatNumber: `S${r}`, isBooked: false, isSleeper: true, deck: 'none' });
      }
    } else {
      for (let r = 1; r <= totalSeats; r++) {
        seats.push({ seatNumber: `${r}`, isBooked: false, isSleeper: false, deck: 'none' });
      }
    }

    const shuffled = amenitiesList.sort(() => 0.5 - Math.random());
    const amenities = shuffled.slice(0, 3 + Math.floor(Math.random() * 4));

    busData.push({
      busName: `${company.name} ${['Express', 'Super', 'Super Luxury', 'Grand', 'Premium', 'Comfort'][Math.floor(Math.random() * 6)]}`,
      busType: type,
      company: company._id,
      route: route._id,
      departureTime: `${depH.toString().padStart(2, '0')}:${depM}`,
      arrivalTime: `${arrH.toString().padStart(2, '0')}:${arrM}`,
      duration,
      fare: Math.round(fare / 10) * 10,
      totalSeats,
      availableSeats: totalSeats,
      seats,
      amenities,
      layout,
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      boardingPoints: [
        { location: `${route.from} Central Bus Station`, time: `${depH.toString().padStart(2, '0')}:${depM}` },
        { location: `${route.from} Railway Station`, time: `${depH.toString().padStart(2, '0')}:${depM > '00' ? (depH + 1).toString().padStart(2, '0') + ':15' : depH.toString().padStart(2, '0') + ':20'}` },
      ],
      droppingPoints: [
        { location: `${route.to} Central Bus Station`, time: `${arrH.toString().padStart(2, '0')}:${arrM}` },
        { location: `${route.to} Railway Station`, time: `${arrH.toString().padStart(2, '0')}:${arrM > '00' ? (arrH + 1).toString().padStart(2, '0') + ':15' : arrH.toString().padStart(2, '0') + ':20'}` },
      ],
    });
  }

  await Bus.insertMany(busData);
  console.log('Seed data inserted successfully!');
  console.log(`  - 1 Admin user (admin@ipltravels.com / admin123)`);
  console.log(`  - ${companies.length} Bus Companies`);
  console.log(`  - ${routes.length} Routes`);
  console.log(`  - ${busData.length} Buses`);
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
