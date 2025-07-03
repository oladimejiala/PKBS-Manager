const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
  verifyFingerprint
} = require('../config/auth');
const {
  createSourcingRecord,
  getSourcingRecords,
  verifySourcingRecord
} = require('../controllers/sourcingController');

// Sourcing staff routes
router.post('/',
  authenticateToken,
  authorizeRoles('sourcing'),
  verifyFingerprint,
  createSourcingRecord
);

router.get('/',
  authenticateToken,
  authorizeRoles('sourcing', 'logistics', 'admin'),
  getSourcingRecords
);

// Admin verification route
router.put('/:id/verify',
  authenticateToken,
  authorizeRoles('admin', 'logistics'),
  verifySourcingRecord
);

// Get single record
router.get('/:id',
  authenticateToken,
  authorizeRoles('sourcing', 'logistics', 'admin'),
  async (req, res) => {
    const record = await Sourcing.findById(req.params.id)
      .populate('staffId', 'name phone');
    res.json(record);
  }
);

module.exports = router;