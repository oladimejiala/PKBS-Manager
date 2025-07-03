// run this in bash using : node initializeAdmin.js 

// /initializeAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashedFingerprint = await bcrypt.hash(process.env.ADMIN_FINGERPRINT, 10);
    
    const admin = new User({
      phone: process.env.ADMIN_PHONE,
      name: 'System Admin',
      role: 'admin',
      fingerprintData: hashedFingerprint,
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err);
    process.exit(1);
  }
}

createAdmin();