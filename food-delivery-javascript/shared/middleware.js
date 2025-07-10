const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const createHealthCheck = () => {
  return (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || 'unknown'
    });
  };
};

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later.'
  });
};

const setupMiddleware = (app) => {
  // Security middleware
  app.use(helmet());
  
  // CORS middleware
  app.use(cors());
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Rate limiting
  app.use(createRateLimiter());
  
  // Health check endpoint
  app.get('/health', createHealthCheck());
  
  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
};

module.exports = {
  setupMiddleware,
  errorHandler,
  createHealthCheck,
  createRateLimiter
};