const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
  verifyFingerprint,
  authRateLimiter
} = require('../config/auth');
const {
  generateToken,
  register,
  login,
  verifyToken
} = require('../controllers/authController');

// Public routes
router.post('/login', authRateLimiter, login);
router.get('/verify-token/:token', verifyToken);

// Admin-protected routes
router.post('/generate-token',
  authenticateToken,
  authorizeRoles('admin'),
  generateToken
);

router.post('/register',
  authenticateToken,
  authorizeRoles('admin'),
  register
);

// Staff verification
router.post('/verify-fingerprint',
  authenticateToken,
  verifyFingerprint,
  (req, res) => res.json({ success: true, message: 'Fingerprint verified' })
);

// Logout
router.post('/logout',
  authenticateToken,
  (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    addToBlacklist(token);
    res.json({ success: true, message: 'Logged out successfully' });
  }
);

module.exports = router;