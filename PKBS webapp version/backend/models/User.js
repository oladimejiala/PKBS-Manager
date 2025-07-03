const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: (v) => /^\+?[\d\s-]{10,15}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    required: true,
    enum: ['sourcing', 'logistics', 'factory', 'sales', 'admin', 'staff'],
    default: 'staff',
    validate: {
      validator: function(v) {
        // Additional validation if needed
        return ['sourcing', 'logistics', 'factory', 'sales', 'admin', 'staff'].includes(v);
      },
      message: props => `${props.value} is not a valid role!`
    }
  },
  designation: {
    type: String,
    trim: true,
    maxlength: [50, 'Designation cannot exceed 50 characters']
  },
  fingerprintData: {
    type: String,
    required: [true, 'Fingerprint data is required'],
    select: false // Never return in queries
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginIP: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash fingerprint data before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('fingerprintData')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.fingerprintData = await bcrypt.hash(this.fingerprintData, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare fingerprints
UserSchema.methods.compareFingerprint = async function(fingerprint) {
  return await bcrypt.compare(fingerprint, this.fingerprintData);
};

// Indexes
UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', UserSchema);