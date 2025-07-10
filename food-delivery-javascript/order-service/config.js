require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost'
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/order-service'
  },
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: process.env.CONSUL_PORT || 8500
  },
  services: {
    restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
    accounting: process.env.ACCOUNTING_SERVICE_URL || 'http://localhost:3006',
    kitchen: process.env.KITCHEN_SERVICE_URL || 'http://localhost:3003',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007'
  },
  rateLimiting: {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
};