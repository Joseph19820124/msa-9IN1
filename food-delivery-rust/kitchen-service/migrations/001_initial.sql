-- Create enum types
CREATE TYPE kitchen_status AS ENUM ('RECEIVED', 'PREPARING', 'READY', 'PICKED_UP');

-- Create kitchen_orders table
CREATE TABLE IF NOT EXISTS kitchen_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE,
    restaurant_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'RECEIVED',
    estimated_time INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_kitchen_orders_order_id ON kitchen_orders(order_id);
CREATE INDEX idx_kitchen_orders_restaurant_id ON kitchen_orders(restaurant_id);
CREATE INDEX idx_kitchen_orders_status ON kitchen_orders(status);