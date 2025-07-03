const mongoose = require('mongoose');

const FactorySchema = new mongoose.Schema({
  logisticsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Logistics',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantityProcessed: {
    type: Number,
    required: [true, 'Processed quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  pkoExtracted: {
    type: Number,
    required: [true, 'PKO quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  pkcExtracted: {
    type: Number,
    required: [true, 'PKC quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  processingCost: {
    type: Number,
    required: [true, 'Processing cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  processingTime: {
    start: {
      type: Date,
      required: [true, 'Start time is required']
    },
    end: {
      type: Date,
      required: [true, 'End time is required'],
      validate: {
        validator: function(v) {
          return v > this.processingTime.start;
        },
        message: 'End time must be after start time'
      }
    }
  },
  receiverThumbprint: {
    type: String,
    required: [true, 'Receiver thumbprint is required']
  },
  staffThumbprint: {
    type: String,
    required: [true, 'Staff thumbprint is required']
  },
  qualityMetrics: {
    moistureContent: {
      type: Number,
      min: 0,
      max: 100
    },
    ffa: {
      type: Number,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'packaged'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Calculate duration as virtual field
FactorySchema.virtual('durationHours').get(function() {
  const diff = this.processingTime.end - this.processingTime.start;
  return (diff / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours
});

FactorySchema.index({ logisticsId: 1 });
FactorySchema.index({ staffId: 1 });
FactorySchema.index({ status: 1 });
FactorySchema.index({ 'processingTime.start': -1 });

module.exports = mongoose.model('Factory', FactorySchema);