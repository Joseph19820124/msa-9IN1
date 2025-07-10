const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const config = require('./config');
const ConsulClient = require('../shared/consul-client');

const router = express.Router();
const consulClient = new ConsulClient(config.consul.host, config.consul.port);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Login endpoint
router.post('/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  
  // Simple authentication (in production, verify against user database)
  if (email === 'admin@fooddelivery.com' && password === 'admin123') {
    const token = jwt.sign(
      { userId: 1, email: email, role: 'admin' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.json({
      token,
      user: { userId: 1, email: email, role: 'admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Create proxy middleware for each service
const createServiceProxy = (serviceName, basePath) => {
  return createProxyMiddleware({
    target: `http://localhost:3001`, // Default target, will be updated dynamically
    changeOrigin: true,
    pathRewrite: {
      [`^${basePath}`]: ''
    },
    router: async (req) => {
      try {
        const endpoint = await consulClient.getServiceEndpoint(serviceName);
        return endpoint;
      } catch (error) {
        console.error(`Error routing to ${serviceName}:`, error);
        throw error;
      }
    },
    onError: (err, req, res) => {
      console.error(`Proxy error for ${serviceName}:`, err);
      res.status(503).json({
        error: 'Service Unavailable',
        message: `${serviceName} is currently unavailable`
      });
    }
  });
};

// Public routes (no authentication required)
router.use('/api/restaurants', createServiceProxy('restaurant-service', '/api/restaurants'));

// Protected routes (authentication required)
router.use('/api/orders', authenticateToken, createServiceProxy('order-service', '/api/orders'));
router.use('/api/kitchen', authenticateToken, createServiceProxy('kitchen-service', '/api/kitchen'));
router.use('/api/delivery', authenticateToken, createServiceProxy('delivery-service', '/api/delivery'));
router.use('/api/accounting', authenticateToken, createServiceProxy('accounting-service', '/api/accounting'));
router.use('/api/notifications', authenticateToken, createServiceProxy('notification-service', '/api/notifications'));

// Service discovery endpoint
router.get('/services', async (req, res) => {
  try {
    const services = {};
    for (const [key, service] of Object.entries(config.services)) {
      const healthyServices = await consulClient.discoverService(service.name);
      services[key] = {
        name: service.name,
        basePath: service.basePath,
        instances: healthyServices.length,
        healthy: healthyServices.length > 0
      };
    }
    res.json(services);
  } catch (error) {
    console.error('Error discovering services:', error);
    res.status(500).json({ error: 'Service discovery failed' });
  }
});

module.exports = router;