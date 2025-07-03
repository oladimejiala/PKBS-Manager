const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  used: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['sourcing', 'logistics', 'factory', 'sales', 'admin'],
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    index: { expires: 0 } // Auto-delete expired tokens
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Token', TokenSchema);