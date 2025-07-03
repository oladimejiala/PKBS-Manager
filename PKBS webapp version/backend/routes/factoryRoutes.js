const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
  verifyFingerprint
} = require('../config/auth');
const {
  createFactoryRecord,
  getProductionReport
} = require('../controllers/factoryController');

// Factory staff routes
router.post('/',
  authenticateToken,
  authorizeRoles('factory'),
  verifyFingerprint,
  createFactoryRecord
);

router.get('/',
  authenticateToken,
  authorizeRoles('factory', 'sales', 'admin'),
  getProductionReport
);

// Quality control update
router.patch('/:id/quality',
  authenticateToken,
  authorizeRoles('factory', 'admin'),
  async (req, res) => {
    const { qualityMetrics } = req.body;
    const record = await Factory.findByIdAndUpdate(
      req.params.id,
      { qualityMetrics },
      { new: true }
    );
    res.json(record);
  }
);

module.exports = router;