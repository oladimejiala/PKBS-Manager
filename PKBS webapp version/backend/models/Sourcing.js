const mongoose = require('mongoose');

const SourcingSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplierName: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true
  },
  supplierPhone: {
    type: String,
    validate: {
      validator: (v) => /^\+?[\d\s-]{10,15}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unit: {
    type: String,
    enum: ['kg', 'bags', 'tons'],
    default: 'kg'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  paymentProof: {
    type: String, // URL to image
    required: [true, 'Payment proof is required']
  },
  goodsPhotos: [{
    type: String,
    required: [true, 'At least 3 photos are required'],
    validate: [arrayLimit, '{PATH} must have at least 3 items']
  }],
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: validateCoordinates,
        message: props => `${props.value} is not valid coordinates!`
      }
    }
  },
  supplierThumbprint: {
    type: String,
    required: [true, 'Supplier thumbprint is required']
  },
  staffThumbprint: {
    type: String,
    required: [true, 'Staff thumbprint is required']
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'in-transit', 'processed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Validate photo array length
function arrayLimit(val) {
  return val.length >= 3;
}

// Validate coordinates [longitude, latitude]
function validateCoordinates(coords) {
  return coords.length === 2 && 
    coords[0] >= -180 && coords[0] <= 180 &&
    coords[1] >= -90 && coords[1] <= 90;
}

// Geospatial index
SourcingSchema.index({ location: '2dsphere' });
SourcingSchema.index({ staffId: 1 });
SourcingSchema.index({ status: 1 });
SourcingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Sourcing', SourcingSchema);