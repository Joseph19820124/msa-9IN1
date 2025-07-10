const express = require('express');
const config = require('./config');
const routes = require('./routes');
const { setupMiddleware, errorHandler } = require('../shared/middleware');
const Database = require('../shared/database');
const ConsulClient = require('../shared/consul-client');
const { eventBus, EVENT_TYPES } = require('../shared/events');

const app = express();
const database = new Database(config.database.uri);
const consulClient = new ConsulClient(config.consul.host, config.consul.port);

// Setup middleware
setupMiddleware(app);

// Routes
app.use('/orders', routes);

// Error handling middleware
app.use(errorHandler);

// Event handlers
eventBus.subscribe(EVENT_TYPES.PAYMENT_PROCESSED, (data) => {
  console.log('Payment processed for order:', data.orderId);
  // Update order payment status
});

eventBus.subscribe(EVENT_TYPES.PAYMENT_FAILED, (data) => {
  console.log('Payment failed for order:', data.orderId);
  // Update order payment status and potentially cancel
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();
    
    const server = app.listen(config.server.port, config.server.host, async () => {
      console.log(`Order Service running on ${config.server.host}:${config.server.port}`);
      
      // Register with Consul
      await consulClient.registerService({
        id: 'order-service-1',
        name: 'order-service',
        address: config.server.host,
        port: config.server.port
      });
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`${signal} received, shutting down gracefully`);
      await consulClient.deregisterService('order-service-1');
      await database.disconnect();
      server.close(() => {
        console.log('Order Service terminated');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start Order Service:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;