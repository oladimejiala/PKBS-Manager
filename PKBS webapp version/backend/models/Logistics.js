const mongoose = require('mongoose');

const LogisticsSchema = new mongoose.Schema({
  sourcingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sourcing',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverName: {
    type: String,
    required: [true, 'Receiver name is required'],
    trim: true
  },
  receiverPhone: {
    type: String,
    validate: {
      validator: (v) => /^\+?[\d\s-]{10,15}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  designation: {
    type: String,
    trim: true
  },
  quantityReceived: {
    type: Number,
    required: [true, 'Received quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  logisticsCost: {
    type: Number,
    required: [true, 'Logistics cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  driverName: {
    type: String,
    trim: true
  },
  driverPhone: {
    type: String,
    validate: {
      validator: (v) => /^\+?[\d\s-]{10,15}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  vehicleNumber: {
    type: String,
    trim: true
  },
  receiverThumbprint: {
    type: String,
    required: [true, 'Receiver thumbprint is required']
  },
  staffThumbprint: {
    type: String,
    required: [true, 'Staff thumbprint is required']
  },
  borderCrossing: {
    type: String,
    enum: ['Seme', 'Idiroko', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'delivered'],
    default: 'pending'
  }
}, {
  timestamps: true
});

LogisticsSchema.index({ sourcingId: 1 });
LogisticsSchema.index({ staffId: 1 });
LogisticsSchema.index({ borderCrossing: 1 });
LogisticsSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Logistics', LogisticsSchema);