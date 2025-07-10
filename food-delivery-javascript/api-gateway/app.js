const express = require('express');
const config = require('./config');
const routes = require('./routes');
const { setupMiddleware, errorHandler } = require('../shared/middleware');
const ConsulClient = require('../shared/consul-client');

const app = express();
const consulClient = new ConsulClient(config.consul.host, config.consul.port);

// Setup middleware
setupMiddleware(app);

// Routes
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(config.server.port, config.server.host, async () => {
  console.log(`API Gateway running on ${config.server.host}:${config.server.port}`);
  
  // Register with Consul
  await consulClient.registerService({
    id: 'api-gateway-1',
    name: 'api-gateway',
    address: config.server.host,
    port: config.server.port
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await consulClient.deregisterService('api-gateway-1');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await consulClient.deregisterService('api-gateway-1');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;