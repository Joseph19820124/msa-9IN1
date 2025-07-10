#!/bin/bash

# 构建所有微服务的脚本

echo "Building all microservices..."

# 构建Java服务
echo "Building API Gateway..."
cd api-gateway
./mvnw clean package -DskipTests
cd ..

echo "Building Order Service..."
cd order-service
./mvnw clean package -DskipTests
cd ..

echo "Building Restaurant Service..."
cd restaurant-service
./mvnw clean package -DskipTests
cd ..

echo "Building Kitchen Service..."
cd kitchen-service
./mvnw clean package -DskipTests
cd ..

echo "Building Delivery Service..."
cd delivery-service
./mvnw clean package -DskipTests
cd ..

echo "Building Accounting Service..."
cd accounting-service
./mvnw clean package -DskipTests
cd ..

echo "Building Notification Service..."
cd notification-service
./mvnw clean package -DskipTests
cd ..

# 构建前端
echo "Building Restaurant Web UI..."
cd restaurant-web-ui
npm install
npm run build
cd ..

echo "All services built successfully!"