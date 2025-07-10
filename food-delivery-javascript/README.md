# Food Delivery Microservices Architecture (JavaScript/Node.js)

A complete microservices-based food delivery system built with Node.js, Express.js, MongoDB, and Docker.

## Architecture Overview

This system consists of 7 microservices:

1. **API Gateway** - Entry point, routing, authentication
2. **Order Service** - Order management and lifecycle
3. **Restaurant Service** - Restaurant and menu management
4. **Kitchen Service** - Kitchen operations and order preparation
5. **Delivery Service** - Delivery management and tracking
6. **Accounting Service** - Payment processing and financial operations
7. **Notification Service** - Multi-channel notifications

## Technologies Used

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Service Discovery**: Consul
- **Containerization**: Docker & Docker Compose
- **Payment Processing**: Stripe
- **Notifications**: Nodemailer (Email), Twilio (SMS), Firebase (Push), Socket.IO (WebSocket)
- **Geolocation**: Geolib for distance calculations
- **Scheduling**: Node-cron for background tasks

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- MongoDB (if running locally)
- Consul (if running locally)

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd food-delivery-javascript
```

2. Build and start all services:
```bash
docker-compose up -d
```

3. Verify services are running:
```bash
docker-compose ps
```

4. Access the services:
   - API Gateway: http://localhost:3000
   - Consul UI: http://localhost:8500
   - MongoDB Express: http://localhost:8081 (optional)

### Service Endpoints

- **API Gateway**: `http://localhost:3000`
- **Order Service**: `http://localhost:3001`
- **Restaurant Service**: `http://localhost:3002`
- **Kitchen Service**: `http://localhost:3003`
- **Delivery Service**: `http://localhost:3004`
- **Accounting Service**: `http://localhost:3005`
- **Notification Service**: `http://localhost:3006`

## API Documentation

### Authentication

Most endpoints require authentication. Use the `/auth/login` endpoint to get a JWT token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fooddelivery.com", "password": "admin123"}'
```

### Example API Calls

#### 1. Create a Restaurant

```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "contact": {
      "phone": "+1234567890",
      "email": "info@pizzapalace.com"
    },
    "cuisineTypes": ["Italian", "Pizza"],
    "deliveryInfo": {
      "deliveryFee": 3.99,
      "minimumOrder": 15.00,
      "deliveryRadius": 10,
      "averageDeliveryTime": 30
    }
  }'
```

#### 2. Add Menu Items

```bash
curl -X POST http://localhost:3000/api/restaurants/RESTAURANT_ID/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato sauce, mozzarella, and basil",
    "price": 12.99,
    "category": "MAIN_COURSE",
    "cuisineType": "Italian",
    "preparationTime": 15,
    "dietaryRestrictions": ["VEGETARIAN"]
  }'
```

#### 3. Create an Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "restaurantId": "RESTAURANT_ID",
    "items": [
      {
        "menuItemId": "MENU_ITEM_ID",
        "name": "Margherita Pizza",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "deliveryAddress": {
      "street": "456 Oak Ave",
      "city": "New York",
      "state": "NY",
      "zipCode": "10002"
    },
    "paymentMethod": "CREDIT_CARD"
  }'
```

#### 4. Track Order Status

```bash
curl -X GET http://localhost:3000/api/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. Process Payment

```bash
curl -X POST http://localhost:3000/api/accounting/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 29.97,
    "orderId": "ORDER_ID",
    "customerId": "CUSTOMER_ID",
    "restaurantId": "RESTAURANT_ID"
  }'
```

## Configuration

### Environment Variables

Each service can be configured using environment variables. Key configurations include:

#### Database
- `MONGODB_URI`: MongoDB connection string
- `CONSUL_HOST`: Consul server host
- `CONSUL_PORT`: Consul server port

#### Security
- `JWT_SECRET`: Secret for JWT token signing
- `STRIPE_SECRET_KEY`: Stripe secret key for payments

#### External Services
- `EMAIL_USER`: Email service username
- `EMAIL_PASS`: Email service password
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio authentication token

### Service-Specific Configuration

Each service has its own `config.js` file with detailed configuration options.

## Development

### Running Services Locally

1. Install dependencies for each service:
```bash
cd api-gateway && npm install
cd ../order-service && npm install
# ... repeat for all services
```

2. Start MongoDB and Consul:
```bash
docker-compose up -d consul mongodb
```

3. Start services in development mode:
```bash
# Terminal 1
cd api-gateway && npm run dev

# Terminal 2
cd order-service && npm run dev

# ... repeat for all services
```

### Testing

Run tests for individual services:
```bash
cd order-service
npm test
```

### Database Management

Access MongoDB using MongoDB Express:
- URL: http://localhost:8081
- Username: admin
- Password: admin

Or use MongoDB Compass with connection string:
```
mongodb://admin:password123@localhost:27017/
```

## Monitoring and Health Checks

### Health Endpoints

Each service provides a health check endpoint:
- `GET /health` - Service health status

### Consul Service Discovery

Access Consul UI at http://localhost:8500 to:
- View registered services
- Check service health
- Monitor service instances

### Logs

View service logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f order-service
```

## Production Deployment

### Security Considerations

1. **Change default credentials** in docker-compose.yml
2. **Use environment-specific secrets** for JWT, Stripe, etc.
3. **Enable HTTPS** for all external endpoints
4. **Implement rate limiting** (already configured)
5. **Set up proper logging** and monitoring

### Scaling

Scale individual services:
```bash
docker-compose up -d --scale order-service=3
```

### Load Balancing

For production, use a load balancer (nginx, HAProxy) in front of the API Gateway.

## Architecture Patterns

### Microservices Patterns Implemented

1. **API Gateway Pattern** - Single entry point
2. **Service Registry Pattern** - Consul for service discovery
3. **Database per Service** - Each service has its own database
4. **Event-Driven Architecture** - Services communicate via events
5. **Circuit Breaker Pattern** - Implemented in service calls
6. **Health Check Pattern** - All services provide health endpoints
7. **Retry Pattern** - Automatic retries for failed operations

### Data Flow

1. **Order Creation**: API Gateway → Order Service → Kitchen Service
2. **Payment Processing**: Order Service → Accounting Service
3. **Kitchen Operations**: Kitchen Service → Delivery Service
4. **Notifications**: All services → Notification Service
5. **Delivery Tracking**: Delivery Service → Notification Service

## Troubleshooting

### Common Issues

1. **Services not starting**: Check Docker logs and ensure all environment variables are set
2. **Database connection issues**: Verify MongoDB is running and accessible
3. **Service discovery issues**: Check Consul is running and services are registered
4. **Payment issues**: Verify Stripe credentials are correct

### Debugging

1. **Check service logs**:
```bash
docker-compose logs -f service-name
```

2. **Check service health**:
```bash
curl http://localhost:PORT/health
```

3. **Check Consul registration**:
Visit http://localhost:8500 and verify services are registered

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review service logs
3. Create an issue in the repository

---

This microservices architecture provides a robust, scalable foundation for a food delivery platform with proper separation of concerns, fault tolerance, and observability.