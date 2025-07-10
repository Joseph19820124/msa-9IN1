const EventEmitter = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0); // Remove limit on event listeners
  }

  publish(eventType, data) {
    console.log(`Publishing event: ${eventType}`, data);
    this.emit(eventType, data);
  }

  subscribe(eventType, handler) {
    console.log(`Subscribing to event: ${eventType}`);
    this.on(eventType, handler);
  }

  unsubscribe(eventType, handler) {
    console.log(`Unsubscribing from event: ${eventType}`);
    this.removeListener(eventType, handler);
  }
}

// Event types
const EVENT_TYPES = {
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_DELIVERED: 'order.delivered',
  PAYMENT_PROCESSED: 'payment.processed',
  PAYMENT_FAILED: 'payment.failed',
  KITCHEN_ORDER_READY: 'kitchen.order.ready',
  DELIVERY_ASSIGNED: 'delivery.assigned',
  DELIVERY_COMPLETED: 'delivery.completed',
  NOTIFICATION_SENT: 'notification.sent'
};

const eventBus = new EventBus();

module.exports = {
  EventBus,
  EVENT_TYPES,
  eventBus
};