const Factory = require('../models/Factory');
const Logistics = require('../models/Logistics');
const { sendTransactionReceipt } = require('../services/emailService');

exports.createFactoryRecord = async (req, res) => {
  try {
    const {
      logisticsId,
      quantityProcessed,
      pkoExtracted,
      pkcExtracted,
      processingCost,
      startTime,
      endTime
    } = req.body;

    // Verify logistics record
    const logisticsRecord = await Logistics.findById(logisticsId);
    if (!logisticsRecord) {
      return res.status(404).json({ message: 'Logistics record not found' });
    }

    const factoryRecord = new Factory({
      logisticsId,
      staffId: req.user.id,
      quantityProcessed,
      pkoExtracted,
      pkcExtracted,
      processingCost,
      processingTime: {
        start: new Date(startTime),
        end: new Date(endTime)
      },
      receiverThumbprint: req.body.receiverThumbprint,
      staffThumbprint: req.user.fingerprintData
    });

    await factoryRecord.save();

    // Update logistics status
    logisticsRecord.status = 'processed';
    await logisticsRecord.save();

    // Send receipt
    await sendTransactionReceipt({
      type: 'factory',
      data: factoryRecord,
      recipient: process.env.CEO_EMAIL
    });

    res.status(201).json(factoryRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductionReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query['processingTime.start'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const records = await Factory.find(query)
      .populate('logisticsId')
      .populate('staffId', 'name phone')
      .sort({ 'processingTime.start': -1 });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

