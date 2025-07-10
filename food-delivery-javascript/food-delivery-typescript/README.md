# Food Delivery Microservices - TypeScript Edition

A complete food delivery platform built with TypeScript, Express.js, TypeORM, PostgreSQL, Redis, and Consul for service discovery.

## Architecture Overview

This system consists of 7 microservices:

1. **API Gateway** (Port 3000) - Routes requests to appropriate services
2. **Order Service** (Port 3001) - Manages customer orders
3. **Restaurant Service** (Port 3002) - Manages restaurants and menus
4. **Kitchen Service** (Port 3003) - Handles order preparation
5. **Delivery Service** (Port 3004) - Manages deliveries and drivers
6. **Accounting Service** (Port 3005) - Handles payments and invoicing
7. **Notification Service** (Port 3006) - Sends notifications to users

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Service Discovery**: Consul
- **Containerization**: Docker & Docker Compose
- **Validation**: express-validator
- **HTTP Client**: Axios

## Project Structure

```
food-delivery-typescript/
├── shared/                     # Shared utilities and types
│   ├── types/                 # Common TypeScript interfaces
│   ├── utils/                 # Shared utilities (DB, Redis, HTTP)
│   └── middleware/            # Common middleware
├── api-gateway/               # API Gateway service
├── order-service/             # Order management
├── restaurant-service/        # Restaurant and menu management
├── kitchen-service/           # Kitchen operations
├── delivery-service/          # Delivery management
├── accounting-service/        # Payment processing
├── notification-service/      # Notification system
├── docker-compose.yml         # Container orchestration
├── init-db.sql               # Database initialization
└── README.md                 # This file
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Quick Start

### 1. Clone and Start with Docker

```bash
# Navigate to the project directory
cd food-delivery-typescript

# Start all services with Docker Compose
docker-compose up -d

# Check service status
docker-compose ps
```

### 2. Verify Services

Once all containers are running, you can verify the services:

- **API Gateway**: http://localhost:3000/health
- **Consul UI**: http://localhost:8500
- **Service Discovery**: http://localhost:3000/services

### 3. Test the API

```bash
# Get all restaurants
curl http://localhost:3000/api/restaurants

# Create a new order (example)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-uuid",
    "restaurantId": "restaurant-uuid",
    "items": [
      {
        "menuItemId": "item-uuid",
        "menuItemName": "Pizza Margherita",
        "quantity": 2,
        "price": 15.99
      }
    ],
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    },
    "deliveryFee": 3.99
  }'
```

## Local Development

### 1. Install Dependencies

```bash
# Install dependencies for all services
for service in api-gateway order-service restaurant-service kitchen-service delivery-service accounting-service notification-service; do
  cd $service && npm install && cd ..
done

# Install shared dependencies
cd shared && npm install && cd ..
```

### 2. Start Infrastructure Services

```bash
# Start only infrastructure services
docker-compose up -d consul postgres redis
```

### 3. Run Services Locally

```bash
# Start each service in development mode
cd order-service && npm run dev &
cd restaurant-service && npm run dev &
cd kitchen-service && npm run dev &
cd delivery-service && npm run dev &
cd accounting-service && npm run dev &
cd notification-service && npm run dev &
cd api-gateway && npm run dev &
```

## API Documentation

### API Gateway Routes

The API Gateway provides a unified entry point for all services:

#### Order Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

#### Restaurant Management
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create new restaurant
- `GET /api/restaurants/:id/menu` - Get restaurant menu

#### Kitchen Operations
- `GET /api/kitchen/orders` - Get kitchen orders
- `PUT /api/kitchen/orders/:id/status` - Update order status

#### Delivery Management
- `GET /api/delivery/orders` - Get delivery orders
- `POST /api/delivery/orders/:id/assign` - Assign driver
- `PUT /api/delivery/orders/:id/status` - Update delivery status

#### Payments
- `GET /api/accounting/payments` - Get payments
- `POST /api/accounting/payments` - Process payment

#### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications` - Send notification

## Database Schema

Each service has its own database with the following main entities:

### Order Service
- `orders` - Customer orders
- `order_items` - Order line items

### Restaurant Service
- `restaurants` - Restaurant information
- `menu_categories` - Menu categories
- `menu_items` - Menu items

### Kitchen Service
- `kitchen_orders` - Orders in kitchen queue

### Delivery Service
- `deliveries` - Delivery information
- `drivers` - Driver information

### Accounting Service
- `payments` - Payment records
- `invoices` - Invoice records

### Notification Service
- `notifications` - Notification records
- `notification_templates` - Message templates

## Configuration

### Environment Variables

Each service can be configured using environment variables:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=service_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Consul
CONSUL_HOST=localhost
CONSUL_PORT=8500

# Service URLs (for inter-service communication)
ORDER_SERVICE_URL=http://localhost:3001
RESTAURANT_SERVICE_URL=http://localhost:3002
# ... etc
```

## Service Discovery

This project uses Consul for service discovery. Services automatically register themselves with Consul on startup and can discover other services dynamically.

### Consul UI
Access the Consul UI at http://localhost:8500 to see:
- Registered services
- Health checks
- Service configuration

## Monitoring and Health Checks

Each service provides:
- Health check endpoint: `/health`
- Graceful shutdown handling
- Request logging and error handling

## Testing

```bash
# Run tests for a specific service
cd order-service
npm test

# Run linting
npm run lint

# Build TypeScript
npm run build
```

## Deployment

### Production Build

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-specific Configurations

Create environment-specific docker-compose files:
- `docker-compose.dev.yml` - Development
- `docker-compose.staging.yml` - Staging
- `docker-compose.prod.yml` - Production

## Troubleshooting

### Common Issues

1. **Services not registering with Consul**
   - Check Consul is running: `docker-compose logs consul`
   - Verify network connectivity

2. **Database connection errors**
   - Ensure PostgreSQL is running: `docker-compose logs postgres`
   - Check database credentials

3. **Inter-service communication issues**
   - Verify service discovery in Consul UI
   - Check service health endpoints

### Logs

View logs for specific services:
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs order-service

# Follow logs in real-time
docker-compose logs -f api-gateway
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Gateway   │    │     Consul       │    │   PostgreSQL    │
│   (Port 3000)   │────│  Service Discovery│    │   (Port 5432)   │
└─────────────────┘    │   (Port 8500)    │    └─────────────────┘
         │              └──────────────────┘              │
         │                       │                        │
         ├───────────────────────┼────────────────────────┤
         │                       │                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Order Service   │    │Restaurant Service│    │ Kitchen Service │
│  (Port 3001)    │    │  (Port 3002)     │    │  (Port 3003)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                        │
         └───────────────────────┼────────────────────────┘
                                 │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Delivery Service │    │Accounting Service│    │Notification Svc │
│  (Port 3004)    │    │  (Port 3005)     │    │  (Port 3006)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                        │
         └───────────────────────┴────────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │   (Port 6379)   │
                    └─────────────────┘
```