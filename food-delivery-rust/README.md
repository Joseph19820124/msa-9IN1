# Food Delivery Microservices - Rust Implementation

A complete microservices architecture for a food delivery system implemented in Rust using Axum web framework, PostgreSQL databases, and Consul for service discovery.

## Architecture Overview

The system consists of the following microservices:

1. **API Gateway** - Central entry point for all client requests
2. **Order Service** - Manages customer orders
3. **Restaurant Service** - Manages restaurants and menus
4. **Kitchen Service** - Handles kitchen operations and order preparation
5. **Delivery Service** - Manages delivery assignments and tracking
6. **Accounting Service** - Handles financial transactions
7. **Notification Service** - Manages user notifications

## Technology Stack

- **Language**: Rust
- **Web Framework**: Axum
- **Database**: PostgreSQL with SQLx
- **Service Discovery**: Consul
- **Containerization**: Docker & Docker Compose
- **Async Runtime**: Tokio

## Prerequisites

- Docker and Docker Compose
- Rust 1.75+ (for local development)
- PostgreSQL client tools (optional)

## Getting Started

### 1. Clone the repository

```bash
cd food-delivery-rust
```

### 2. Build and run all services

```bash
docker-compose up --build
```

This will:
- Start Consul for service discovery
- Create PostgreSQL databases for each service
- Build and run all microservices
- Run database migrations automatically

### 3. Access the services

- **API Gateway**: http://localhost:8080
- **Consul UI**: http://localhost:8500

## API Endpoints

### Order Service (via API Gateway)
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/customer/:customer_id` - Get customer orders

### Restaurant Service (via API Gateway)
- `POST /api/restaurants` - Create a new restaurant
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants/:id/menu` - Add menu item

### Kitchen Service (via API Gateway)
- `GET /api/kitchen/orders/:order_id` - Get kitchen order
- `PUT /api/kitchen/orders/:order_id/status` - Update kitchen status

### Delivery Service (via API Gateway)
- `GET /api/deliveries/order/:order_id` - Get delivery by order
- `PUT /api/deliveries/:id/assign` - Assign driver to delivery
- `PUT /api/deliveries/:id/status` - Update delivery status

### Accounting Service (via API Gateway)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/order/:order_id` - Get order transactions

### Notification Service (via API Gateway)
- `POST /api/notifications` - Send notification
- `GET /api/notifications/user/:user_id` - Get user notifications

## Example Requests

### Create a Restaurant

```bash
curl -X POST http://localhost:8080/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Palace",
    "cuisineType": "Italian",
    "address": "123 Main St",
    "phone": "555-0123"
  }'
```

### Add Menu Item

```bash
curl -X POST http://localhost:8080/api/restaurants/{restaurant_id}/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato and mozzarella",
    "price": 12.99,
    "category": "Pizza"
  }'
```

### Create an Order

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "restaurantId": "{restaurant_id}",
    "items": [
      {
        "menuItemId": "{menu_item_id}",
        "quantity": 2
      }
    ],
    "deliveryAddress": "456 Oak Ave"
  }'
```

## Development

### Local Development Setup

1. Install Rust and cargo
2. Install Docker for PostgreSQL and Consul
3. Start infrastructure services:
   ```bash
   docker-compose up consul order-db restaurant-db kitchen-db delivery-db accounting-db notification-db
   ```
4. Run individual services locally:
   ```bash
   cd order-service
   cargo run
   ```

### Running Tests

```bash
# Run tests for all services
cargo test --workspace

# Run tests for a specific service
cd order-service
cargo test
```

### Database Migrations

Each service uses SQLx for database migrations. Migrations are automatically run on startup.

To create a new migration:
```bash
cd service-name
sqlx migrate add migration_name
```

## Project Structure

```
food-delivery-rust/
├── api-gateway/          # API Gateway service
├── order-service/        # Order management
├── restaurant-service/   # Restaurant and menu management
├── kitchen-service/      # Kitchen operations
├── delivery-service/     # Delivery tracking
├── accounting-service/   # Financial transactions
├── notification-service/ # User notifications
├── shared/              # Shared models and utilities
├── docker-compose.yml   # Docker Compose configuration
└── README.md           # This file
```

## Service Communication

Services communicate through:
1. **REST APIs** - Synchronous communication via HTTP
2. **Service Discovery** - Services register with Consul and discover each other dynamically

## Error Handling

All services implement consistent error handling with:
- Proper HTTP status codes
- JSON error responses
- Detailed logging via `tracing`

## Monitoring and Logging

- All services use the `tracing` crate for structured logging
- Logs are output to stdout/stderr
- Log levels can be configured via the `RUST_LOG` environment variable

## Security Considerations

In a production environment, consider:
- Adding authentication/authorization (JWT tokens)
- Implementing rate limiting
- Using HTTPS/TLS
- Securing database connections
- Implementing input validation
- Adding API versioning

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.