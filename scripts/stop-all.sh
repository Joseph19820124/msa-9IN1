#!/bin/bash

# 停止所有服务的脚本

echo "Stopping all services..."

# 停止Docker Compose服务
docker-compose down

echo "All services stopped!"