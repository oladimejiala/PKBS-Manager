// /config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

// Connection events for better monitoring
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
  console.log(`  Host: ${mongoose.connection.host}`);
  console.log(`  DB: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

// Graceful shutdown handler
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,  // 5s timeout for server selection
      connectTimeoutMS: 10000,        // 10s timeout for initial connection
      socketTimeoutMS: 45000,         // 45s timeout for queries
      maxPoolSize: 10,                // Maximum number of connections
      retryWrites: true,
      retryReads: true,
      appName: 'PKBS-API'             // Identify connections in MongoDB Atlas
    });

    // Enable Mongoose debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        console.log(`Mongoose: ${collectionName}.${method}`, {
          query,
          doc
        });
      });
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Custom error handling for common cases
    if (error.name === 'MongooseServerSelectionError') {
      console.error('  Possible causes:');
      console.error('  - Incorrect MongoDB URI');
      console.error('  - Network connectivity issues');
      console.error('  - MongoDB service down');
    }
    
    // Exit with failure code
    process.exit(1);
  }
};

// Connection health check
const checkDBHealth = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return {
      status: 'healthy',
      db: mongoose.connection.name,
      ping: 'ok',
      readyState: mongoose.connection.readyState
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
      readyState: mongoose.connection.readyState
    };
  }
};

module.exports = {
  connectDB,
  checkDBHealth,
  connection: mongoose.connection
};