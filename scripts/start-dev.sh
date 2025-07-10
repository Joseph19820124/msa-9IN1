#!/bin/bash

# 启动开发环境的脚本

echo "Starting development environment..."

# 启动基础服务（数据库和Eureka）
echo "Starting infrastructure services..."
docker-compose up -d eureka-server order-db restaurant-db kitchen-db delivery-db accounting-db notification-db

# 等待数据库启动
echo "Waiting for databases to be ready..."
sleep 30

echo "Infrastructure services started successfully!"
echo "You can now start individual microservices locally for development."
echo ""
echo "To start a service locally:"
echo "cd [service-name]"
echo "./mvnw spring-boot:run"
echo ""
echo "To start the frontend:"
echo "cd restaurant-web-ui"
echo "npm start"