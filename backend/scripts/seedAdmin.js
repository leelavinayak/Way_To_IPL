require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@ipltravels.com' });
  if (existing) {
    console.log('Admin user already exists:');
    console.log(`  Email: admin@ipltravels.com`);
    console.log(`  Password: admin123`);
    console.log(`  Role: ${existing.role}`);
    process.exit(0);
  }

  await User.create({
    name: 'Admin User',
    email: 'admin@ipltravels.com',
    password: 'admin123',
    mobile: '9999999999',
    role: 'admin',
    isVerified: true,
  });

  console.log('Admin user created successfully!');
  console.log('  Email: admin@ipltravels.com');
  console.log('  Password: admin123');
  process.exit(0);
};

seedAdmin().catch(err => { console.error(err); process.exit(1); });
