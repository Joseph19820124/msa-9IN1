const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  specialInstructions: {
    type: String,
    default: ''
  }
});

const deliveryAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'US'
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  deliveryAddress: deliveryAddressSchema,
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  tip: {
    type: Number,
    default: 0,
    min: 0
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    enum: ['CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'DIGITAL_WALLET'],
    default: 'CREDIT_CARD'
  },
  orderHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Add methods to the order schema
orderSchema.methods.calculateTotal = function() {
  const itemsTotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.totalAmount = itemsTotal + this.deliveryFee + this.tax + this.tip;
  return this.totalAmount;
};

orderSchema.methods.addHistoryEntry = function(status, notes = '') {
  this.orderHistory.push({
    status,
    timestamp: new Date(),
    notes
  });
  this.status = status;
};

orderSchema.methods.estimateDeliveryTime = function() {
  const now = new Date();
  const preparationTime = 30; // 30 minutes preparation
  const deliveryTime = 20; // 20 minutes delivery
  this.estimatedDeliveryTime = new Date(now.getTime() + (preparationTime + deliveryTime) * 60000);
  return this.estimatedDeliveryTime;
};

// Indexes for better query performance
orderSchema.index({ orderId: 1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = {
  Order,
  orderSchema,
  orderItemSchema,
  deliveryAddressSchema
};