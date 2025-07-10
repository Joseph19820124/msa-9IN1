# Food Delivery Microservices - PHP Implementation

A complete food delivery system built with PHP microservices using Slim Framework and Eloquent ORM.

## Architecture

This system consists of 7 microservices:

1. **API Gateway** (Port 3020) - Entry point for all requests
2. **Order Service** (Port 3021) - Manages customer orders
3. **Restaurant Service** (Port 3022) - Manages restaurants and menus
4. **Kitchen Service** (Port 3023) - Handles order preparation
5. **Delivery Service** (Port 3024) - Manages order delivery
6. **Accounting Service** (Port 3025) - Handles payments and billing
7. **Notification Service** (Port 3026) - Sends notifications

## Technology Stack

- **Language**: PHP 8.2+
- **Framework**: Slim Framework 4
- **ORM**: Eloquent ORM (Laravel's database component)
- **Database**: PostgreSQL (separate database per service)
- **HTTP Client**: Guzzle HTTP
- **Caching/Messaging**: Redis
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose
- PHP 8.2+ with Composer (for local development)

## Quick Start

1. Clone the repository and navigate to the PHP implementation:
   ```bash
   cd food-delivery-php
   ```

2. Start all services with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. The API Gateway will be available at `http://localhost:3020`

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
curl -X POST http://localhost:3020/api/orders \
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
curl http://localhost:3020/api/restaurants
```

## Local Development

Each service can be run independently for development:

1. Install dependencies:
   ```bash
   cd order-service
   composer install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

3. Run database migrations:
   ```bash
   php artisan migrate
   ```

4. Start the PHP built-in server:
   ```bash
   php -S localhost:8000 -t public
   ```

## Database Schema

Each service uses Eloquent models with PostgreSQL:

- **Orders**: customer_id, restaurant_id, items (JSON), total_amount, status
- **Restaurants**: name, address, phone, cuisine_type, rating
- **Menu Items**: restaurant_id, name, description, price, category, available
- **Kitchen Orders**: order_id, status, preparation_time, assigned_chef
- **Deliveries**: order_id, driver_id, pickup_time, delivery_time, status
- **Payments**: order_id, amount, payment_method, status, transaction_id

## Configuration

Environment variables (set in .env files or docker-compose.yml):

```env
# Database
DATABASE_URL=pgsql:host=localhost;port=5432;dbname=food_delivery;user=postgres;password=password

# Service URLs (for inter-service communication)
ORDER_SERVICE_URL=http://order-service
RESTAURANT_SERVICE_URL=http://restaurant-service
KITCHEN_SERVICE_URL=http://kitchen-service
DELIVERY_SERVICE_URL=http://delivery-service
ACCOUNTING_SERVICE_URL=http://accounting-service
NOTIFICATION_SERVICE_URL=http://notification-service

# Redis
REDIS_URL=redis://redis:6379

# Application
APP_ENV=development
APP_DEBUG=true
```

## Dependency Management

Using Composer for dependency management:

```json
{
    "require": {
        "slim/slim": "^4.12",
        "slim/psr7": "^1.6",
        "illuminate/database": "^10.0",
        "guzzlehttp/guzzle": "^7.8",
        "vlucas/phpdotenv": "^5.5"
    }
}
```

## Database Migrations

Create migrations using Eloquent Schema Builder:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('customer_id');
            $table->integer('restaurant_id');
            $table->json('items');
            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }
}
```

## Error Handling

Each service implements:
- Global error handling middleware
- Structured JSON error responses
- Input validation using PHP filters
- Database connection error handling
- HTTP client exception handling

## Performance Considerations

- PHP-FPM for production deployment
- Connection pooling for database connections
- Redis for caching and session storage
- Optimized autoloading with Composer
- Gzip compression for responses

## Production Deployment

For production deployment:

1. Use PHP-FPM with Nginx
2. Configure proper logging
3. Set up monitoring (New Relic, Datadog)
4. Use managed databases
5. Implement proper security headers
6. Set up CI/CD pipelines
7. Use APCu for opcode caching

## Security Features

- Input validation and sanitization
- CSRF protection
- SQL injection prevention (Eloquent ORM)
- XSS protection
- Environment variable management
- CORS configuration

## Docker Configuration

Each service uses optimized Dockerfiles:

```dockerfile
FROM php:8.2-fpm-alpine

RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

COPY . .

EXPOSE 9000
CMD ["php-fpm"]
```

## Testing

Run PHPUnit tests:
```bash
cd order-service
composer test
```

Run integration tests:
```bash
composer test:integration
```

## Code Quality

- PSR-12 coding standards
- PHPStan for static analysis
- PHP-CS-Fixer for code formatting
- PHPMD for mess detection

## Monitoring and Health Checks

Each service exposes:
- `GET /health` - Service health status
- `GET /metrics` - Application metrics
- Structured logging with Monolog

## API Documentation

Generate API documentation with:
- OpenAPI/Swagger specifications
- Automated documentation generation
- Interactive API explorer

## Contributing

1. Fork the repository
2. Follow PSR-12 coding standards
3. Add comprehensive tests
4. Update documentation
5. Submit a pull request

## Troubleshooting

Common issues and solutions:

1. **Composer dependency conflicts**: Clear cache with `composer clear-cache`
2. **Database connection errors**: Check DATABASE_URL and PostgreSQL status
3. **Memory issues**: Increase PHP memory_limit
4. **Permission errors**: Check file/directory permissions in containers
5. **Service communication**: Verify service URLs and network connectivity