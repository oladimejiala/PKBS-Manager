const Sourcing = require('../models/Sourcing');
const User = require('../models/User');
const { sendTransactionReceipt } = require('../services/emailService');

exports.createSourcingRecord = async (req, res) => {
  try {
    const { 
      supplierName,
      supplierPhone,
      quantity,
      price,
      paymentProof,
      goodsPhotos,
      location,
      supplierThumbprint
    } = req.body;

    // Validate required fields
    if (!supplierName || !quantity || !price || !supplierThumbprint) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sourcingRecord = new Sourcing({
      staffId: req.user.id,
      supplierName,
      supplierPhone,
      quantity,
      price,
      paymentProof,
      goodsPhotos,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      supplierThumbprint,
      staffThumbprint: req.user.fingerprintData
    });

    await sourcingRecord.save();

    // Send receipt to CEO
    await sendTransactionReceipt({
      type: 'sourcing',
      data: sourcingRecord,
      recipient: process.env.CEO_EMAIL
    });

    res.status(201).json(sourcingRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSourcingRecords = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const records = await Sourcing.find(query)
      .populate('staffId', 'name phone')
      .sort({ timestamp: -1 });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifySourcingRecord = async (req, res) => {
  try {
    const record = await Sourcing.findByIdAndUpdate(
      req.params.id,
      { status: 'verified' },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};