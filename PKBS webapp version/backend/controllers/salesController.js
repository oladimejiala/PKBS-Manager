const Sales = require('../models/Sales');
const Factory = require('../models/Factory');
const { sendTransactionReceipt } = require('../services/emailService');

exports.createSalesRecord = async (req, res) => {
  try {
    const {
      factoryId,
      customerName,
      customerPhone,
      productType,
      quantity,
      unitPrice,
      paymentMethod,
      deliveryAddress
    } = req.body;

    // Verify factory record
    const factoryRecord = await Factory.findById(factoryId);
    if (!factoryRecord) {
      return res.status(404).json({ message: 'Factory record not found' });
    }

    const salesRecord = new Sales({
      factoryId,
      staffId: req.user.id,
      customerName,
      customerPhone,
      productType,
      quantity,
      unitPrice,
      totalAmount: quantity * unitPrice,
      paymentMethod,
      deliveryAddress,
      customerThumbprint: req.body.customerThumbprint,
      staffThumbprint: req.user.fingerprintData
    });

    await salesRecord.save();

    // Update inventory
    if (productType === 'PKO') {
      factoryRecord.pkoExtracted -= quantity;
    } else {
      factoryRecord.pkcExtracted -= quantity;
    }
    await factoryRecord.save();

    // Send receipt
    await sendTransactionReceipt({
      type: 'sales',
      data: salesRecord,
      recipient: process.env.CEO_EMAIL
    });

    res.status(201).json(salesRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, productType } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (productType) {
      query.productType = productType;
    }

    const records = await Sales.find(query)
      .populate('factoryId')
      .populate('staffId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};