const express = require('express');
const { body, param, validationResult } = require('express-validator');
const axios = require('axios');
const { Order } = require('./models');
const config = require('./config');
const { eventBus, EVENT_TYPES } = require('../shared/events');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Generate unique order ID
const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Create new order
router.post('/', [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItemId').notEmpty().withMessage('Menu item ID is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode').notEmpty().withMessage('Zip code is required')
], handleValidationErrors, async (req, res) => {
  try {
    const orderData = {
      orderId: generateOrderId(),
      ...req.body
    };

    // Validate restaurant exists
    try {
      await axios.get(`${config.services.restaurant}/restaurants/${orderData.restaurantId}`);
    } catch (error) {
      return res.status(400).json({ error: 'Restaurant not found' });
    }

    // Create order
    const order = new Order(orderData);
    
    // Calculate totals
    order.calculateTotal();
    order.estimateDeliveryTime();
    order.addHistoryEntry('PENDING', 'Order created');

    await order.save();

    // Publish order created event
    eventBus.publish(EVENT_TYPES.ORDER_CREATED, {
      orderId: order.orderId,
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      totalAmount: order.totalAmount,
      items: order.items
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        totalAmount: order.totalAmount,
        estimatedDeliveryTime: order.estimatedDeliveryTime
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId, restaurantId } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (restaurantId) filter.restaurantId = restaurantId;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:orderId', [
  param('orderId').notEmpty().withMessage('Order ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/:orderId/status', [
  param('orderId').notEmpty().withMessage('Order ID is required'),
  body('status').isIn(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid status'),
  body('notes').optional().isString()
], handleValidationErrors, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    order.addHistoryEntry(status, notes);
    
    if (status === 'DELIVERED') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    // Publish status update event
    const eventType = status === 'CONFIRMED' ? EVENT_TYPES.ORDER_CONFIRMED :
                     status === 'CANCELLED' ? EVENT_TYPES.ORDER_CANCELLED :
                     status === 'DELIVERED' ? EVENT_TYPES.ORDER_DELIVERED :
                     `order.status.${status.toLowerCase()}`;
    
    eventBus.publish(eventType, {
      orderId: order.orderId,
      status: order.status,
      customerId: order.customerId,
      restaurantId: order.restaurantId
    });

    res.json({
      message: 'Order status updated successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel order
router.delete('/:orderId', [
  param('orderId').notEmpty().withMessage('Order ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    order.addHistoryEntry('CANCELLED', 'Order cancelled by customer');
    await order.save();

    // Publish order cancelled event
    eventBus.publish(EVENT_TYPES.ORDER_CANCELLED, {
      orderId: order.orderId,
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      reason: 'Customer cancellation'
    });

    res.json({
      message: 'Order cancelled successfully',
      order: {
        orderId: order.orderId,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get order history
router.get('/:orderId/history', [
  param('orderId').notEmpty().withMessage('Order ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      orderId: order.orderId,
      history: order.orderHistory
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

// Get orders by customer
router.get('/customer/:customerId', [
  param('customerId').notEmpty().withMessage('Customer ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { customerId: req.params.customerId };
    
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

module.exports = router;