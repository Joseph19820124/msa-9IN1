# Food Delivery Microservices - Ruby Implementation

A complete food delivery system built with Ruby microservices using Sinatra and ActiveRecord.

## Architecture

This system consists of 7 microservices:

1. **API Gateway** (Port 3000) - Entry point for all requests
2. **Order Service** (Port 3001) - Manages customer orders
3. **Restaurant Service** (Port 3002) - Manages restaurants and menus
4. **Kitchen Service** (Port 3003) - Handles order preparation
5. **Delivery Service** (Port 3004) - Manages order delivery
6. **Accounting Service** (Port 3005) - Handles payments and billing
7. **Notification Service** (Port 3006) - Sends notifications

## Technology Stack

- **Framework**: Sinatra (lightweight Ruby web framework)
- **ORM**: ActiveRecord
- **Database**: PostgreSQL (separate database per service)
- **Caching/Messaging**: Redis
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose
- Ruby 3.2+ (for local development)

## Quick Start

1. Clone the repository and navigate to the Ruby implementation:
   ```bash
   cd food-delivery-ruby
   ```

2. Start all services with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. The API Gateway will be available at `http://localhost:3000`

## API Endpoints

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/{id}` - Get specific restaurant
- `POST /api/restaurants` - Create new restaurant
- `GET /api/restaurants/{id}/menu` - Get restaurant menu
- `POST /api/restaurants/{id}/menu` - Add menu item

### Kitchen
- `GET /api/kitchen/orders` - Get orders for kitchen
- `PUT /api/kitchen/orders/{id}` - Update order status

### Delivery
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/{id}` - Get specific delivery
- `PUT /api/deliveries/{id}` - Update delivery status

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Process payment

### Notifications
- `POST /api/notifications` - Send notification

## Example Usage

### Create a new order:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "restaurant_id": 1,
    "items": [{"name": "Pizza", "quantity": 2, "price": 15.99}],
    "total_amount": 31.98
  }'
```

### Get all restaurants:
```bash
curl http://localhost:3000/api/restaurants
```

## Local Development

Each service can be run independently for development:

1. Install dependencies:
   ```bash
   cd order-service
   bundle install
   ```

2. Set up the database:
   ```bash
   bundle exec rake db:migrate
   ```

3. Run the service:
   ```bash
   ruby app.rb
   ```

## Database Schema

Each service has its own PostgreSQL database:

- **Orders**: customer_id, restaurant_id, items (JSON), total_amount, status
- **Restaurants**: name, address, phone, cuisine_type, rating
- **Menu Items**: restaurant_id, name, description, price, category, available
- **Kitchen Orders**: order_id, status, preparation_time, assigned_chef
- **Deliveries**: order_id, driver_id, pickup_time, delivery_time, status
- **Payments**: order_id, amount, payment_method, status, transaction_id

## Configuration

Environment variables can be set in docker-compose.yml or .env files:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- Service URLs for inter-service communication

## Monitoring and Health Checks

Each service exposes a health check endpoint:
- `GET /health` - Returns service status

## Testing

Run tests for individual services:
```bash
cd order-service
bundle exec rspec
```

## Production Deployment

For production deployment:

1. Use proper environment variables for database connections
2. Set up proper logging and monitoring
3. Configure load balancers for high availability
4. Use managed databases (e.g., AWS RDS)
5. Implement proper security measures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request