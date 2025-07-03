const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
  verifyFingerprint
} = require('../config/auth');
const {
  createLogisticsRecord,
  getLogisticsRecords
} = require('../controllers/logisticsController');

// Logistics staff routes
router.post('/',
  authenticateToken,
  authorizeRoles('logistics'),
  verifyFingerprint,
  createLogisticsRecord
);

router.get('/',
  authenticateToken,
  authorizeRoles('logistics', 'factory', 'admin'),
  getLogisticsRecords
);

// Border crossing update
router.patch('/:id/crossing',
  authenticateToken,
  authorizeRoles('logistics'),
  verifyFingerprint,
  async (req, res) => {
    const { borderCrossing } = req.body;
    const record = await Logistics.findByIdAndUpdate(
      req.params.id,
      { borderCrossing },
      { new: true }
    );
    res.json(record);
  }
);

module.exports = router;