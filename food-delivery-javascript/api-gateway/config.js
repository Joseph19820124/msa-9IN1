require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: process.env.CONSUL_PORT || 8500
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  services: {
    order: {
      name: 'order-service',
      basePath: '/api/orders'
    },
    restaurant: {
      name: 'restaurant-service',
      basePath: '/api/restaurants'
    },
    kitchen: {
      name: 'kitchen-service',
      basePath: '/api/kitchen'
    },
    delivery: {
      name: 'delivery-service',
      basePath: '/api/delivery'
    },
    accounting: {
      name: 'accounting-service',
      basePath: '/api/accounting'
    },
    notification: {
      name: 'notification-service',
      basePath: '/api/notifications'
    }
  },
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  }
};