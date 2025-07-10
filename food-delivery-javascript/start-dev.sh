#!/bin/bash

# Food Delivery Microservices - Development Startup Script

echo "🚀 Starting Food Delivery Microservices in Development Mode..."

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    echo "Checking if $service_name is running on port $port..."
    
    if curl -s -f "http://localhost:$port/health" > /dev/null 2>&1; then
        echo "✅ $service_name is running"
        return 0
    else
        echo "❌ $service_name is not running"
        return 1
    fi
}

# Start infrastructure services first
echo "📦 Starting infrastructure services..."
docker-compose up -d consul mongodb

# Wait for infrastructure to be ready
echo "⏳ Waiting for infrastructure services to be ready..."
sleep 10

# Check if Consul is ready
until curl -s -f "http://localhost:8500/v1/status/leader" > /dev/null 2>&1; do
    echo "Waiting for Consul to be ready..."
    sleep 2
done
echo "✅ Consul is ready"

# Check if MongoDB is ready
until docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    echo "Waiting for MongoDB to be ready..."
    sleep 2
done
echo "✅ MongoDB is ready"

# Start all application services
echo "🏗️ Starting application services..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Check service health
echo "🔍 Checking service health..."
services=(
    "API Gateway:3000"
    "Order Service:3001"
    "Restaurant Service:3002"
    "Kitchen Service:3003"
    "Delivery Service:3004"
    "Accounting Service:3005"
    "Notification Service:3006"
)

all_healthy=true
for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if ! check_service "$name" "$port"; then
        all_healthy=false
    fi
done

if $all_healthy; then
    echo ""
    echo "🎉 All services are running successfully!"
    echo ""
    echo "📋 Service URLs:"
    echo "   • API Gateway: http://localhost:3000"
    echo "   • Consul UI: http://localhost:8500"
    echo "   • MongoDB Express: http://localhost:8081 (admin/admin)"
    echo ""
    echo "🔑 Default login credentials:"
    echo "   • Email: admin@fooddelivery.com"
    echo "   • Password: admin123"
    echo ""
    echo "📚 API Documentation available in README.md"
else
    echo ""
    echo "⚠️  Some services are not healthy. Check logs with:"
    echo "   docker-compose logs -f"
fi

echo ""
echo "📊 View service status:"
echo "   docker-compose ps"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose down"