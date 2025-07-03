require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');

// Import routes
const authRoutes = require('./routes/authRoutes');
const sourcingRoutes = require('./routes/sourcingRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const factoryRoutes = require('./routes/factoryRoutes');
const salesRoutes = require('./routes/salesRoutes');
const adminRoutes = require('./routes/adminRoutes');

// DB Connection
require('./config/db'); // Will connect DB and exit on error

// Initialize app
const app = express();

// Security + Rate Limiting
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Try again later.'
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sourcing', sourcingRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/factory', factoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/admin', adminRoutes);

// Deployment: Serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
