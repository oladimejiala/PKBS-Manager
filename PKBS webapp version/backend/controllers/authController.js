const User = require('../models/User');
const Token = require('../models/Token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendRegistrationEmail } = require('../services/emailService');

// Generate registration tokens (admin only)
exports.generateToken = async (req, res) => {
  try {
    const token = uuidv4();
    const newToken = new Token({
      token,
      generatedBy: req.user.id,
      role: req.body.role || 'staff' // Default to staff role
    });
    
    await newToken.save();
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating token' });
  }
};

// Register new staff
exports.register = async (req, res) => {
  const { phone, name, role, designation, fingerprintData, token } = req.body;

  try {
    // Verify token
    const validToken = await Token.findOne({ token, used: false });
    if (!validToken) {
      return res.status(400).json({ message: 'Invalid or used token' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      phone,
      name,
      role: validToken.role || role,
      designation,
      fingerprintData
    });

    await user.save();
    
    // Mark token as used
    validToken.used = true;
    await validToken.save();

    // Send welcome email
    await sendRegistrationEmail(user);

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user._id 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login staff
exports.login = async (req, res) => {
  const { phone, fingerprintData } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(fingerprintData, user.fingerprintData);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user._id,
            name: user.name,
            role: user.role,
            phone: user.phone
          }
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    const token = await Token.findOne({ 
      token: req.params.token, 
      used: false 
    });
    
    if (!token) {
      return res.status(400).json({ valid: false });
    }
    
    res.json({ valid: true, role: token.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};