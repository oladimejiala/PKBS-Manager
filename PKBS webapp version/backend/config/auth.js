// /config/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Rate limiter for auth endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    solution: 'Please try again after 15 minutes'
  }
});

// Enhanced token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access token missing',
      solution: 'Add Authorization: Bearer <token> header'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid token',
        details: err.name === 'TokenExpiredError' 
          ? 'Token expired' 
          : 'Malformed token',
        solution: 'Request a new token by logging in again'
      });
    }

    // Verify user still exists
    try {
      const user = await User.findById(decoded.user.id);
      if (!user || !user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'User account not active'
        });
      }

      // Standardized user object
      req.user = {
        id: decoded.user.id,
        role: decoded.user.role,
        phone: decoded.user.phone,
        ip: req.ip // Track IP for security
      };

      next();
    } catch (dbError) {
      res.status(500).json({
        success: false,
        error: 'User verification failed'
      });
    }
  });
};

// Role authorization with enhanced logging
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({
        success: false,
        error: 'User role not detected',
        solution: 'Reauthenticate and try again'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(
        `Unauthorized access attempt by ${req.user.id} (${req.user.role})`
      );
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        currentRole: req.user.role,
        solution: 'Contact administrator for access'
      });
    }

    next();
  };
};

// Fingerprint verification middleware
const verifyFingerprint = async (req, res, next) => {
  const { fingerprintData } = req.body;
  
  if (!fingerprintData) {
    return res.status(400).json({ 
      success: false,
      error: 'Fingerprint data required',
      solution: 'Include fingerprintData in request body'
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(fingerprintData, user.fingerprintData);
    
    if (!isMatch) {
      console.warn(`Fingerprint mismatch for user ${req.user.id}`);
      return res.status(403).json({ 
        success: false,
        error: 'Biometric verification failed',
        solution: 'Try again or contact administrator'
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Biometric verification error',
      details: err.message
    });
  }
};

// Optional token blacklisting (for logout)
const tokenBlacklist = new Set();

const checkBlacklist = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({
      success: false,
      error: 'Token revoked',
      solution: 'Login again to get new token'
    });
  }
  next();
};

const addToBlacklist = (token) => {
  tokenBlacklist.add(token);
  setTimeout(() => tokenBlacklist.delete(token), 8 * 60 * 60 * 1000); // Auto-clear after token expiry
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  verifyFingerprint,
  checkBlacklist,
  addToBlacklist,
  authRateLimiter
};