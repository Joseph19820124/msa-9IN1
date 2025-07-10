# Food Delivery Microservices - Multi-Language Implementation

A comprehensive food delivery system implemented in multiple programming languages, demonstrating microservices architecture patterns across different technology stacks.

## Overview

This repository contains complete implementations of a food delivery system using 9 different programming languages:

1. **Java/Spring Boot** - Enterprise-grade with full Spring ecosystem
2. **.NET/C#** - Microsoft stack with ASP.NET Core
3. **Go** - Concurrent, efficient implementation with Gin framework
4. **Python/FastAPI** - Modern async framework with excellent performance
5. **JavaScript/Node.js** - Express.js with comprehensive tooling
6. **TypeScript** - Type-safe JavaScript with enhanced tooling
7. **Ruby** - Developer-friendly with Sinatra framework
8. **Rust** - High-performance, memory-safe implementation
9. **C++** - High-performance native implementation

## Architecture

Each implementation consists of 7 microservices:

- **API Gateway** - Central entry point for all client requests
- **Order Service** - Manages customer orders and order lifecycle
- **Restaurant Service** - Handles restaurant data and menu management
- **Kitchen Service** - Manages order preparation and cooking workflow
- **Delivery Service** - Coordinates order delivery and driver assignment
- **Accounting Service** - Processes payments and handles billing
- **Notification Service** - Sends real-time notifications to users

## Technology Stack Comparison

| Language | Framework | ORM/Database | Service Discovery | Container Port Range |
|----------|-----------|--------------|-------------------|---------------------|
| Java | Spring Boot | JPA/Hibernate | Netflix Eureka | 8080-8086 |
| .NET | ASP.NET Core | Entity Framework | Consul | 8080-8086 |
| Go | Gin | GORM | Consul | 8080-8086 |
| Python | FastAPI | SQLAlchemy | Consul | 8000-8006 |
| JavaScript | Express.js | Sequelize | Manual | 3000-3006 |
| TypeScript | Express.js | TypeORM | Manual | 3000-3006 |
| Ruby | Sinatra | ActiveRecord | Manual | 3000-3006 |
| Rust | Actix-web | SQLx | Manual | 8080-8086 |
| C++ | cpp-httplib | libpqxx | Manual | 3030-3036 |

## Quick Start Guide

### Prerequisites

- Docker and Docker Compose
- Git

### Running Any Implementation

1. Clone the repository:
   ```bash
   git clone https://github.com/Joseph19820124/msa-9IN1.git
   cd msa-9IN1
   ```

2. Choose your preferred implementation:
   ```bash
   # Java/Spring Boot (Most Complete)
   cd food-delivery-microservices
   
   # .NET Core
   cd food-delivery-dotnet
   
   # Go
   cd food-delivery-go
   
   # Python/FastAPI
   cd food-delivery-python
   
   # JavaScript
   cd food-delivery-javascript
   
   # TypeScript
   cd food-delivery-javascript/food-delivery-typescript
   
   # Ruby
   cd food-delivery-ruby
   
   # Rust
   cd food-delivery-rust
   
   # C++
   cd food-delivery-cpp
   ```

3. Start the services:
   ```bash
   docker-compose up --build
   ```

4. Access the API Gateway:
   - **Java**: http://localhost:8080
   - **.NET**: http://localhost:8080
   - **Go**: http://localhost:8080
   - **Python**: http://localhost:8000
   - **JavaScript**: http://localhost:3000
   - **TypeScript**: http://localhost:3000
   - **Ruby**: http://localhost:3000
   - **Rust**: http://localhost:8080
   - **C++**: http://localhost:3030

## API Endpoints (Common Across All Implementations)

### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders/{id}` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/{id}` - Get specific restaurant
- `POST /api/restaurants` - Create new restaurant
- `GET /api/restaurants/{id}/menu` - Get restaurant menu
- `POST /api/restaurants/{id}/menu` - Add menu item

### Kitchen Operations
- `GET /api/kitchen/orders` - Get orders for kitchen
- `PUT /api/kitchen/orders/{id}` - Update order preparation status

### Delivery Management
- `GET /api/deliveries` - List all deliveries
- `GET /api/deliveries/{id}` - Get specific delivery
- `PUT /api/deliveries/{id}` - Update delivery status

### Payments
- `GET /api/payments` - List all payments
- `POST /api/payments` - Process payment

### Notifications
- `POST /api/notifications` - Send notification
- `GET /notifications` - Get recent notifications (some implementations)

## Example Usage

### Create a New Order

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "restaurant_id": 1,
    "items": [
      {
        "name": "Margherita Pizza",
        "quantity": 2,
        "price": 15.99
      },
      {
        "name": "Caesar Salad",
        "quantity": 1,
        "price": 8.50
      }
    ],
    "total_amount": 40.48
  }'
```

### Get All Restaurants

```bash
curl http://localhost:8080/api/restaurants
```

### Update Order Status

```bash
curl -X PUT http://localhost:8080/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "preparing"
  }'
```

## Database Schema

Each implementation uses PostgreSQL with the following core schema:

### Orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Restaurants Table
```sql
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    cuisine_type VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Comparison

Approximate performance characteristics (requests/second):

| Language | Throughput | Memory Usage | Startup Time | Build Time | Developer Experience |
|----------|------------|--------------|--------------|------------|-------------------|
| Rust | ~15,000 | Low | Fast | Slow | Medium |
| C++ | ~12,000 | Very Low | Very Fast | Slow | Hard |
| Go | ~10,000 | Low | Fast | Fast | Good |
| Java | ~8,000 | High | Slow | Medium | Excellent |
| .NET | ~8,000 | Medium | Medium | Medium | Excellent |
| Node.js | ~8,000 | Medium | Fast | Fast | Good |
| Python | ~6,000 | Medium | Fast | Fast | Excellent |
| Ruby | ~4,000 | High | Medium | Fast | Excellent |

*Note: Performance varies based on specific use cases and optimizations.*

## Implementation Features

### Java/Spring Boot Implementation
- **Most Complete**: Full Spring ecosystem with actuator, security, data
- **Service Discovery**: Netflix Eureka with Spring Cloud Gateway
- **Database**: PostgreSQL with JPA/Hibernate
- **Frontend**: React 18 with Ant Design
- **Features**: Comprehensive logging, monitoring, testing

### .NET Core Implementation
- **Enterprise Ready**: ASP.NET Core with Entity Framework
- **Service Discovery**: Consul integration
- **Database**: PostgreSQL with EF Core migrations
- **Features**: Built-in DI, configuration management

### Go Implementation
- **High Performance**: Gin framework with excellent concurrency
- **Service Discovery**: Consul with health checks
- **Database**: PostgreSQL with GORM
- **Additional**: Redis, RabbitMQ, WebSocket support

### Python/FastAPI Implementation
- **Modern Async**: FastAPI with automatic OpenAPI documentation
- **Service Discovery**: Consul integration
- **Database**: PostgreSQL with SQLAlchemy
- **Monitoring**: Prometheus + Grafana integration

## Development Workflow

### Local Development

Each implementation can be developed locally:

1. **Install dependencies** (language-specific)
2. **Set up databases** (PostgreSQL + Redis)
3. **Configure environment variables**
4. **Run database migrations**
5. **Start individual services**

### Testing

Each implementation includes:
- Unit tests for business logic
- Integration tests for API endpoints
- Health check endpoints
- Database connectivity tests

### Monitoring

All implementations provide:
- Health check endpoints (`/health`)
- Structured logging
- Error handling and reporting
- Performance metrics (where applicable)

## Deployment Strategies

### Docker Compose (Development)
- Single-machine deployment
- Shared networks and volumes
- Easy service discovery
- Rapid development iteration

### Kubernetes (Production)
- Multi-node deployment
- Load balancing and scaling
- Service mesh integration
- Rolling updates and rollbacks

### Cloud-Native (AWS/GCP/Azure)
- Managed databases (RDS, Cloud SQL)
- Container orchestration (EKS, GKE, AKS)
- Message queuing (SQS, Pub/Sub)
- API gateways and load balancers

## Security Considerations

All implementations include:
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Environment variable management
- Error handling without information disclosure

## Contributing

1. Fork the repository
2. Choose an implementation to work on
3. Follow the language-specific coding standards
4. Add comprehensive tests
5. Update documentation
6. Submit a pull request

### Adding New Languages

To add a new language implementation:
1. Create a new directory: `food-delivery-{language}`
2. Implement all 7 microservices
3. Create Docker configuration
4. Add comprehensive README
5. Ensure API compatibility
6. Add to the main docker-compose setup

## License

This project is licensed under the MIT License - see the individual implementation directories for details.

## Acknowledgments

- Built with modern microservices patterns
- Demonstrates polyglot microservices architecture
- Inspired by real-world food delivery platforms
- Educational resource for comparing programming languages and frameworks