const express = require('express');
const config = require('./config');
const routes = require('./routes');
const { setupMiddleware, errorHandler } = require('../shared/middleware');
const Database = require('../shared/database');
const ConsulClient = require('../shared/consul-client');

const app = express();
const database = new Database(config.database.uri);
const consulClient = new ConsulClient(config.consul.host, config.consul.port);

// Setup middleware
setupMiddleware(app);

// Routes
app.use('/restaurants', routes);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();
    
    const server = app.listen(config.server.port, config.server.host, async () => {
      console.log(`Restaurant Service running on ${config.server.host}:${config.server.port}`);
      
      // Register with Consul
      await consulClient.registerService({
        id: 'restaurant-service-1',
        name: 'restaurant-service',
        address: config.server.host,
        port: config.server.port
      });
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`${signal} received, shutting down gracefully`);
      await consulClient.deregisterService('restaurant-service-1');
      await database.disconnect();
      server.close(() => {
        console.log('Restaurant Service terminated');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start Restaurant Service:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;