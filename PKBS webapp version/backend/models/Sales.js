const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
  factoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerPhone: {
    type: String,
    validate: {
      validator: (v) => /^\+?[\d\s-]{10,15}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  productType: {
    type: String,
    enum: ['PKO', 'PKC', 'Both'],
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'transfer', 'cheque', 'credit'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'complete'],
    required: true,
    default: 'pending'
  },
  deliveryAddress: {
    type: String,
    trim: true
  },
  customerThumbprint: {
    type: String,
    required: [true, 'Customer thumbprint is required']
  },
  staffThumbprint: {
    type: String,
    required: [true, 'Staff thumbprint is required']
  },
  invoiceNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Pre-save hook to generate invoice number
SalesSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
  }
  next();
});

SalesSchema.index({ factoryId: 1 });
SalesSchema.index({ staffId: 1 });
SalesSchema.index({ customerPhone: 1 });
SalesSchema.index({ invoiceNumber: 1 }, { unique: true });
SalesSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Sales', SalesSchema);