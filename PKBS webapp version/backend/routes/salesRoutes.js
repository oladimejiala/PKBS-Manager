const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
  verifyFingerprint
} = require('../config/auth');
const {
  createSalesRecord,
  getSalesReport
} = require('../controllers/salesController');

// Sales staff routes
router.post('/',
  authenticateToken,
  authorizeRoles('sales'),
  verifyFingerprint,
  createSalesRecord
);

router.get('/',
  authenticateToken,
  authorizeRoles('sales', 'admin'),
  getSalesReport
);

// Payment status update
router.patch('/:id/payment',
  authenticateToken,
  authorizeRoles('sales', 'admin'),
  async (req, res) => {
    const { paymentStatus } = req.body;
    const record = await Sales.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    res.json(record);
  }
);

// Generate invoice PDF
router.get('/:id/invoice',
  authenticateToken,
  authorizeRoles('sales', 'admin'),
  async (req, res) => {
    const sale = await Sales.findById(req.params.id)
      .populate('staffId', 'name')
      .populate('factoryId');
      
    // In a real implementation, you'd generate a PDF here
    res.json({
      invoice: sale.invoiceNumber,
      customer: sale.customerName,
      amount: sale.totalAmount,
      // ... other invoice details
    });
  }
);

module.exports = router;