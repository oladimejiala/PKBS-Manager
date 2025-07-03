const Logistics = require('../models/Logistics');
const Sourcing = require('../models/Sourcing');
const { sendTransactionReceipt } = require('../services/emailService');

exports.createLogisticsRecord = async (req, res) => {
  try {
    const {
      sourcingId,
      receiverName,
      receiverPhone,
      designation,
      quantityReceived,
      logisticsCost,
      driverName,
      driverPhone,
      vehicleNumber
    } = req.body;

    // Verify sourcing record exists
    const sourcingRecord = await Sourcing.findById(sourcingId);
    if (!sourcingRecord) {
      return res.status(404).json({ message: 'Sourcing record not found' });
    }

    const logisticsRecord = new Logistics({
      sourcingId,
      staffId: req.user.id,
      receiverName,
      receiverPhone,
      designation,
      quantityReceived,
      logisticsCost,
      driverName,
      driverPhone,
      vehicleNumber,
      receiverThumbprint: req.body.receiverThumbprint,
      staffThumbprint: req.user.fingerprintData
    });

    await logisticsRecord.save();

    // Update sourcing record status
    sourcingRecord.status = 'in-transit';
    await sourcingRecord.save();

    // Send receipt
    await sendTransactionReceipt({
      type: 'logistics',
      data: logisticsRecord,
      recipient: process.env.CEO_EMAIL
    });

    res.status(201).json(logisticsRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLogisticsRecords = async (req, res) => {
  try {
    const records = await Logistics.find()
      .populate('sourcingId')
      .populate('staffId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};