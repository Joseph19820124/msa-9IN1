# Food Delivery Microservices Architecture - Python Implementation

A complete microservices-based food delivery system built with Python, FastAPI, PostgreSQL, and Consul for service discovery. This system provides a scalable, maintainable architecture for handling food delivery operations.

## Architecture Overview

The system consists of 7 microservices:

1. **API Gateway** - Routes requests to appropriate services
2. **Order Service** - Manages customer orders
3. **Restaurant Service** - Manages restaurants and menu items
4. **Kitchen Service** - Handles order preparation
5. **Delivery Service** - Manages deliveries and drivers
6. **Accounting Service** - Handles payments and billing
7. **Notification Service** - Sends notifications to users

## Technology Stack

- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL
- **Service Discovery**: Consul
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Swagger/OpenAPI
- **Monitoring**: Prometheus & Grafana
- **Caching**: Redis

## Project Structure

```
food-delivery-python/
├── api-gateway/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── order-service/
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── restaurant-service/
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── kitchen-service/
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── delivery-service/
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── accounting-service/
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── notification-service/
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── shared/
│   ├── __init__.py
│   ├── consul_client.py
│   ├── database.py
│   ├── models.py
│   ├── http_client.py
│   └── utils.py
├── docker-compose.yml
├── init-db.sql
├── prometheus.yml
├── .env.example
└── README.md
```

## Features

### Core Features
- **Order Management**: Create, track, and manage food orders
- **Restaurant Management**: CRUD operations for restaurants and menus
- **Kitchen Operations**: Order preparation workflow
- **Delivery Management**: Driver assignment and delivery tracking
- **Payment Processing**: Secure payment handling and invoicing
- **Notification System**: Multi-channel notifications (email, SMS, push)

### Technical Features
- **Service Discovery**: Automatic service registration and discovery with Consul
- **API Gateway**: Centralized request routing and load balancing
- **Database Per Service**: Each service has its own PostgreSQL database
- **Async Processing**: High-performance async API endpoints
- **Health Checks**: Comprehensive health monitoring
- **Observability**: Prometheus metrics and Grafana dashboards
- **Containerization**: Docker containers for easy deployment

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.11+ (for local development)
- PostgreSQL (for local development)

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-delivery-python
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

4. **Access the services**
   - API Gateway: http://localhost:8000
   - Order Service: http://localhost:8001
   - Restaurant Service: http://localhost:8002
   - Kitchen Service: http://localhost:8003
   - Delivery Service: http://localhost:8004
   - Accounting Service: http://localhost:8005
   - Notification Service: http://localhost:8006
   - Consul UI: http://localhost:8500
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000 (admin/admin)

### Local Development Setup

1. **Install dependencies for each service**
   ```bash
   # For each service directory
   cd <service-directory>
   pip install -r requirements.txt
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL and Consul**
   ```bash
   docker-compose up -d postgres consul
   ```

4. **Run services individually**
   ```bash
   # Terminal 1 - API Gateway
   cd api-gateway
   python main.py

   # Terminal 2 - Order Service
   cd order-service
   python main.py

   # Continue for other services...
   ```

## API Documentation

Each service provides OpenAPI documentation:

- API Gateway: http://localhost:8000/docs
- Order Service: http://localhost:8001/docs
- Restaurant Service: http://localhost:8002/docs
- Kitchen Service: http://localhost:8003/docs
- Delivery Service: http://localhost:8004/docs
- Accounting Service: http://localhost:8005/docs
- Notification Service: http://localhost:8006/docs

## Usage Examples

### Creating a Restaurant
```bash
curl -X POST "http://localhost:8000/api/restaurants" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "phone": "+1234567890",
    "email": "info@pizzapalace.com",
    "cuisine_type": "Italian",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip_code": "10001",
      "country": "US"
    },
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'
```

### Creating an Order
```bash
curl -X POST "http://localhost:8000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "restaurant_id": 1,
    "items": [
      {
        "menu_item_id": 1,
        "quantity": 2,
        "unit_price": 12.99
      }
    ],
    "delivery_address": {
      "street": "456 Oak Ave",
      "city": "New York",
      "state": "NY",
      "zip_code": "10002",
      "country": "US"
    }
  }'
```

### Processing a Payment
```bash
curl -X POST "http://localhost:8000/api/payments" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "amount": 25.98,
    "payment_method": "credit_card"
  }'
```

## Service Details

### API Gateway (Port 8000)
- Routes all external requests to appropriate services
- Provides centralized authentication and rate limiting
- Implements circuit breaker pattern for resilience

### Order Service (Port 8001)
**Endpoints:**
- `POST /orders` - Create new order
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/status` - Update order status
- `DELETE /orders/{id}` - Cancel order

### Restaurant Service (Port 8002)
**Endpoints:**
- `POST /restaurants` - Create restaurant
- `GET /restaurants` - List restaurants
- `GET /restaurants/{id}` - Get restaurant details
- `POST /restaurants/{id}/menu` - Add menu item
- `GET /restaurants/{id}/menu` - Get menu items

### Kitchen Service (Port 8003)
**Endpoints:**
- `POST /kitchen/orders` - Receive kitchen order
- `GET /kitchen/orders` - List kitchen orders
- `PUT /kitchen/orders/{id}/status` - Update preparation status

### Delivery Service (Port 8004)
**Endpoints:**
- `POST /deliveries` - Create delivery
- `GET /deliveries/{id}` - Get delivery details
- `POST /deliveries/{id}/assign` - Assign driver
- `GET /deliveries/track/{tracking_id}` - Track delivery

### Accounting Service (Port 8005)
**Endpoints:**
- `POST /payments` - Create payment
- `PUT /payments/{id}/process` - Process payment
- `POST /payments/refund` - Process refund
- `GET /payments/invoices` - Get invoices

### Notification Service (Port 8006)
**Endpoints:**
- `POST /notifications` - Send notification
- `GET /notifications` - List notifications
- `POST /notifications/bulk` - Send bulk notifications
- `POST /notifications/preferences` - Set preferences

## Database Schema

Each service has its own PostgreSQL database with the following schemas:

### Order Service Database
- `orders` - Order information
- `order_items` - Order line items

### Restaurant Service Database
- `restaurants` - Restaurant information
- `menu_items` - Menu items

### Kitchen Service Database
- `kitchen_orders` - Kitchen order queue
- `kitchen_order_items` - Kitchen order items

### Delivery Service Database
- `deliveries` - Delivery information
- `drivers` - Driver information

### Accounting Service Database
- `payments` - Payment records
- `invoices` - Invoice records
- `transactions` - Transaction history

### Notification Service Database
- `notifications` - Notification records
- `notification_templates` - Message templates
- `notification_preferences` - User preferences

## Monitoring and Observability

### Health Checks
All services expose health check endpoints at `/health`

### Metrics
Prometheus metrics are available at `/metrics` for each service

### Logging
All services use structured logging with different log levels

### Service Discovery
Consul tracks all service instances and their health status

## Configuration

### Environment Variables
Key configuration options:

- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `CONSUL_HOST` - Consul host
- `CONSUL_PORT` - Consul port
- `LOG_LEVEL` - Logging level
- `DEBUG` - Debug mode

### Service Ports
- API Gateway: 8000
- Order Service: 8001
- Restaurant Service: 8002
- Kitchen Service: 8003
- Delivery Service: 8004
- Accounting Service: 8005
- Notification Service: 8006

## Testing

### Unit Tests
```bash
# Run tests for a specific service
cd <service-directory>
python -m pytest tests/
```

### Integration Tests
```bash
# Run integration tests
python -m pytest tests/integration/
```

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8000/api/restaurants

# Using artillery
artillery run load-test.yml
```

## Deployment

### Docker Compose Deployment
```bash
docker-compose up -d
```

### Kubernetes Deployment
```bash
kubectl apply -f k8s/
```

### Production Considerations
- Use managed databases (AWS RDS, Google Cloud SQL)
- Implement proper security (TLS, authentication)
- Set up monitoring and alerting
- Use container orchestration (Kubernetes)
- Implement CI/CD pipelines

## Security

### Authentication
- JWT tokens for API authentication
- Service-to-service authentication

### Authorization
- Role-based access control
- API key management

### Data Protection
- Encryption at rest and in transit
- PCI compliance for payment data
- GDPR compliance for user data

## Performance Optimization

### Caching
- Redis for session caching
- Application-level caching

### Database Optimization
- Connection pooling
- Query optimization
- Read replicas

### Async Processing
- Background task processing
- Message queues for decoupling

## Troubleshooting

### Common Issues

1. **Services not starting**
   - Check Docker logs: `docker-compose logs <service-name>`
   - Verify environment variables
   - Check database connectivity

2. **Service discovery issues**
   - Verify Consul is running
   - Check service registration
   - Review network connectivity

3. **Database connection issues**
   - Check PostgreSQL is running
   - Verify database credentials
   - Check database exists

### Debug Commands
```bash
# View logs
docker-compose logs -f <service-name>

# Check service status
docker-compose ps

# Execute commands in container
docker-compose exec <service-name> bash

# Check Consul services
curl http://localhost:8500/v1/agent/services
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run tests and ensure they pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the troubleshooting section

## Roadmap

- [ ] Add authentication and authorization
- [ ] Implement circuit breaker pattern
- [ ] Add comprehensive monitoring
- [ ] Implement event sourcing
- [ ] Add automated testing
- [ ] Kubernetes deployment manifests
- [ ] CI/CD pipeline setup
- [ ] Performance optimization
- [ ] Security hardening
- [ ] API rate limiting