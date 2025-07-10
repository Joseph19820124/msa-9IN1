# Food Delivery Microservices - Go Implementation

A complete microservices architecture for a food delivery platform built with Go, featuring service discovery with Consul, PostgreSQL databases, and Docker containerization.

## Architecture Overview

The system consists of 7 microservices:

1. **API Gateway** (Port 8080) - Routes requests to appropriate services
2. **Order Service** (Port 8081) - Manages customer orders and order lifecycle
3. **Restaurant Service** (Port 8082) - Manages restaurants and menu items
4. **Kitchen Service** (Port 8083) - Handles order preparation and kitchen operations
5. **Delivery Service** (Port 8084) - Manages delivery drivers and order delivery
6. **Accounting Service** (Port 8085) - Handles payments, refunds, and financial reporting
7. **Notification Service** (Port 8086) - Sends notifications via email, SMS, and push

## Technology Stack

- **Language**: Go 1.21
- **Web Framework**: Gin
- **Database**: PostgreSQL with GORM
- **Service Discovery**: Consul
- **Caching**: Redis
- **Message Queue**: RabbitMQ
- **Containerization**: Docker & Docker Compose
- **WebSocket**: Gorilla WebSocket (for real-time notifications)

## Features

### Core Features
- User authentication and authorization
- Restaurant and menu management
- Order placement and tracking
- Kitchen order management
- Delivery assignment and tracking
- Payment processing and refunds
- Real-time notifications
- Comprehensive reporting

### Technical Features
- Microservices architecture
- Service discovery and health checks
- Database per service pattern
- REST API design
- Real-time WebSocket connections
- Containerized deployment
- Graceful shutdown handling
- Structured logging

## Prerequisites

- Docker and Docker Compose
- Go 1.21+ (for local development)
- Make (optional, for using Makefile commands)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-delivery-go
   ```

2. **Start the services**
   ```bash
   docker-compose up -d
   ```

3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

4. **Check Consul UI**
   - Open http://localhost:8500
   - Verify all services are registered and healthy

5. **Test the API Gateway**
   ```bash
   curl http://localhost:8080/health
   ```

## Service Endpoints

### API Gateway (http://localhost:8080)
- `GET /health` - Health check
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/restaurants` - List restaurants
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/delivery/track/{order_id}` - Track delivery

### Individual Services

#### Order Service (http://localhost:8081)
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get orders
- `GET /api/v1/orders/{id}` - Get order details
- `PUT /api/v1/orders/{id}/status` - Update order status
- `PUT /api/v1/orders/{id}/cancel` - Cancel order

#### Restaurant Service (http://localhost:8082)
- `GET /api/v1/restaurants` - List restaurants
- `POST /api/v1/restaurants` - Create restaurant
- `GET /api/v1/restaurants/{id}` - Get restaurant details
- `GET /api/v1/restaurants/{id}/menu` - Get restaurant menu
- `POST /api/v1/restaurants/{id}/menu` - Add menu item

#### Kitchen Service (http://localhost:8083)
- `GET /api/v1/kitchen/orders` - Get kitchen orders
- `PUT /api/v1/kitchen/orders/{id}/accept` - Accept order
- `PUT /api/v1/kitchen/orders/{id}/start` - Start preparation
- `PUT /api/v1/kitchen/orders/{id}/ready` - Mark order ready

#### Delivery Service (http://localhost:8084)
- `GET /api/v1/delivery/track/{order_id}` - Track delivery
- `GET /api/v1/delivery/drivers` - List drivers
- `POST /api/v1/delivery/assignments` - Create delivery assignment
- `PUT /api/v1/driver/location` - Update driver location

#### Accounting Service (http://localhost:8085)
- `GET /api/v1/accounting/transactions` - List transactions
- `POST /api/v1/accounting/payments` - Process payment
- `POST /api/v1/accounting/refunds` - Process refund
- `GET /api/v1/accounting/reports/revenue` - Revenue report

#### Notification Service (http://localhost:8086)
- `GET /api/v1/notifications` - Get notifications
- `POST /api/v1/notifications/send` - Send notification
- `PUT /api/v1/notifications/{id}/read` - Mark as read
- `GET /api/v1/notifications/ws` - WebSocket connection

## Configuration

Services can be configured using environment variables:

### Common Variables
- `PORT` - Service port (default: 8080)
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `DB_NAME` - Database name (service-specific)
- `CONSUL_ADDR` - Consul address (default: localhost:8500)
- `SERVICE_ADDR` - Service address for registration
- `SERVICE_ID` - Unique service instance ID
- `REDIS_ADDR` - Redis address (default: localhost:6379)
- `RABBITMQ_ADDR` - RabbitMQ address
- `JWT_SECRET` - JWT signing secret

## Development

### Local Development Setup

1. **Start infrastructure services**
   ```bash
   docker-compose up -d consul postgres redis rabbitmq
   ```

2. **Run a service locally**
   ```bash
   cd order-service
   go mod download
   go run main.go
   ```

3. **Build a service**
   ```bash
   cd order-service
   go build -o bin/order-service .
   ```

### Building Docker Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build order-service
```

### Database Migrations

Database schemas are automatically created using GORM AutoMigrate when services start. The shared models are defined in the `shared/models.go` file.

### Testing

```bash
# Run tests for all services
make test

# Run tests for specific service
cd order-service
go test ./...
```

## Monitoring and Observability

### Health Checks
- Each service exposes a `/health` endpoint
- Consul performs regular health checks
- Docker Compose health checks configured

### Logging
- Structured logging with service identification
- Log levels: INFO, ERROR, DEBUG, WARN
- Request/response logging via Gin middleware

### Consul UI
- Access at http://localhost:8500
- View service registry and health status
- Monitor service instances

### RabbitMQ Management
- Access at http://localhost:15672
- Username: guest, Password: guest
- Monitor queues and message flow

## Production Deployment

### Environment-specific Configurations

1. **Production**
   - Use environment-specific `.env` files
   - Configure proper database credentials
   - Set up SSL/TLS certificates
   - Configure external load balancer

2. **Security Considerations**
   - Use secrets management (e.g., HashiCorp Vault)
   - Configure proper network policies
   - Enable authentication for all services
   - Regular security updates

### Scaling

Services can be scaled horizontally:

```bash
# Scale order service to 3 instances
docker-compose up -d --scale order-service=3
```

### High Availability

- Deploy multiple instances of each service
- Use external PostgreSQL cluster
- Configure Redis cluster
- Set up Consul cluster

## API Documentation

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### Error Responses
All services return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Success Responses
All services return standardized success responses:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Follow Go conventions
- Use gofmt for formatting
- Add comments for exported functions
- Write unit tests for new features

### Commit Messages
- Use descriptive commit messages
- Follow conventional commit format
- Reference issue numbers when applicable

## Troubleshooting

### Common Issues

1. **Services not registering with Consul**
   - Check Consul is running: `docker-compose logs consul`
   - Verify network connectivity
   - Check service configuration

2. **Database connection errors**
   - Ensure PostgreSQL is running: `docker-compose logs postgres`
   - Verify database credentials
   - Check if databases are created

3. **Port conflicts**
   - Check if ports are already in use: `netstat -tulpn`
   - Modify port mappings in docker-compose.yml

4. **Build failures**
   - Ensure Go modules are downloaded: `go mod download`
   - Check Go version compatibility
   - Verify Docker is running

### Logs

View logs for specific services:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs order-service

# Follow logs in real-time
docker-compose logs -f order-service
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review service logs for error details