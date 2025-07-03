const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles
} = require('../config/auth');
const User = require('../models/User');
const Sourcing = require('../models/Sourcing');
const Logistics = require('../models/Logistics');
const Factory = require('../models/Factory');
const Sales = require('../models/Sales');
const { checkDBHealth } = require('../config/db');

// Middleware - Admin only
router.use(authenticateToken, authorizeRoles('admin'));

// 1. SYSTEM MONITORING
router.get('/system-health', async (req, res) => {
  const dbStatus = await checkDBHealth();
  res.json({
    status: 'operational',
    database: dbStatus,
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 2. USER MANAGEMENT
router.get('/users', async (req, res) => {
  const users = await User.find({}, '-fingerprintData')
    .sort({ createdAt: -1 });
  res.json(users);
});

router.post('/users/:id/activate', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  );
  res.json(user);
});

router.post('/users/:id/deactivate', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  res.json(user);
});

// 3. AUDIT TRAILS
router.get('/audit/sourcing', async (req, res) => {
  const records = await Sourcing.find()
    .populate('staffId', 'name phone')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(records);
});

router.get('/audit/logistics', async (req, res) => {
  const records = await Logistics.find()
    .populate('staffId sourcingId')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(records);
});

// 4. BUSINESS ANALYTICS
router.get('/analytics/daily-production', async (req, res) => {
  const results = await Factory.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalPKO: { $sum: "$pkoExtracted" },
        totalPKC: { $sum: "$pkcExtracted" },
        batches: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);
  res.json(results);
});

// 5. DATA CORRECTION
router.patch('/correct/sourcing/:id', async (req, res) => {
  const { field, value } = req.body;
  const allowedFields = ['quantity', 'price', 'supplierName'];
  
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: 'Invalid field for correction' });
  }

  const updated = await Sourcing.findByIdAndUpdate(
    req.params.id,
    { [field]: value, status: 'corrected' },
    { new: true }
  );
  
  res.json(updated);
});

// 6. SYSTEM CONFIGURATION
router.post('/config/receipt-email', async (req, res) => {
  // In production, you'd save this to a config collection
  process.env.CEO_EMAIL = req.body.email;
  res.json({ message: 'Receipt email updated' });
});

// 7. COMPREHENSIVE REPORTING
router.get('/reports/chain-of-custody/:id', async (req, res) => {
  const sourcing = await Sourcing.findById(req.params.id)
    .populate('staffId', 'name phone');
  
  const logistics = await Logistics.findOne({ sourcingId: req.params.id })
    .populate('staffId', 'name phone');
  
  const factory = await Factory.findOne({ logisticsId: logistics._id })
    .populate('staffId', 'name phone');
  
  const sales = await Sales.find({ factoryId: factory._id })
    .populate('staffId', 'name phone');

  res.json({
    sourcing,
    logistics,
    factory,
    sales
  });
});

module.exports = router;