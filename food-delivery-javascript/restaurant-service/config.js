require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3002,
    host: process.env.HOST || 'localhost'
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-service'
  },
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: process.env.CONSUL_PORT || 8500
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
  },
  rateLimiting: {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
};