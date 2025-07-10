.PHONY: help build up down logs clean test format lint deps

# Default target
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

clean: ## Clean up Docker containers, networks, and volumes
	docker-compose down -v --remove-orphans
	docker system prune -f

# Individual service commands
up-infra: ## Start only infrastructure services (consul, postgres, redis, rabbitmq)
	docker-compose up -d consul postgres redis rabbitmq

up-gateway: ## Start API Gateway
	docker-compose up -d api-gateway

up-order: ## Start Order Service
	docker-compose up -d order-service

up-restaurant: ## Start Restaurant Service
	docker-compose up -d restaurant-service

up-kitchen: ## Start Kitchen Service
	docker-compose up -d kitchen-service

up-delivery: ## Start Delivery Service
	docker-compose up -d delivery-service

up-accounting: ## Start Accounting Service
	docker-compose up -d accounting-service

up-notification: ## Start Notification Service
	docker-compose up -d notification-service

# Development commands
test: ## Run tests for all services
	@echo "Running tests for all services..."
	@for dir in api-gateway order-service restaurant-service kitchen-service delivery-service accounting-service notification-service; do \
		echo "Testing $$dir..."; \
		cd $$dir && go test ./... && cd ..; \
	done

format: ## Format Go code
	@echo "Formatting Go code..."
	@for dir in shared api-gateway order-service restaurant-service kitchen-service delivery-service accounting-service notification-service; do \
		echo "Formatting $$dir..."; \
		cd $$dir && go fmt ./... && cd ..; \
	done

lint: ## Run golint on all services
	@echo "Running linter on all services..."
	@for dir in shared api-gateway order-service restaurant-service kitchen-service delivery-service accounting-service notification-service; do \
		echo "Linting $$dir..."; \
		cd $$dir && golint ./... && cd ..; \
	done

deps: ## Download Go dependencies for all services
	@echo "Downloading dependencies for all services..."
	@for dir in shared api-gateway order-service restaurant-service kitchen-service delivery-service accounting-service notification-service; do \
		echo "Dependencies for $$dir..."; \
		cd $$dir && go mod download && cd ..; \
	done

tidy: ## Tidy Go modules for all services
	@echo "Tidying Go modules for all services..."
	@for dir in shared api-gateway order-service restaurant-service kitchen-service delivery-service accounting-service notification-service; do \
		echo "Tidying $$dir..."; \
		cd $$dir && go mod tidy && cd ..; \
	done

# Monitoring commands
status: ## Show status of all services
	docker-compose ps

health: ## Check health of all services
	@echo "Checking service health..."
	@echo "API Gateway:"
	@curl -s http://localhost:8080/health || echo "Service not responding"
	@echo "\nOrder Service:"
	@curl -s http://localhost:8081/health || echo "Service not responding"
	@echo "\nRestaurant Service:"
	@curl -s http://localhost:8082/health || echo "Service not responding"
	@echo "\nKitchen Service:"
	@curl -s http://localhost:8083/health || echo "Service not responding"
	@echo "\nDelivery Service:"
	@curl -s http://localhost:8084/health || echo "Service not responding"
	@echo "\nAccounting Service:"
	@curl -s http://localhost:8085/health || echo "Service not responding"
	@echo "\nNotification Service:"
	@curl -s http://localhost:8086/health || echo "Service not responding"

consul: ## Open Consul UI
	@echo "Opening Consul UI at http://localhost:8500"
	@open http://localhost:8500 2>/dev/null || xdg-open http://localhost:8500 2>/dev/null || echo "Please open http://localhost:8500 in your browser"

rabbitmq: ## Open RabbitMQ Management UI
	@echo "Opening RabbitMQ Management UI at http://localhost:15672"
	@echo "Username: guest, Password: guest"
	@open http://localhost:15672 2>/dev/null || xdg-open http://localhost:15672 2>/dev/null || echo "Please open http://localhost:15672 in your browser"

# Database commands
db-logs: ## View PostgreSQL logs
	docker-compose logs postgres

db-connect: ## Connect to PostgreSQL database
	docker-compose exec postgres psql -U postgres -d food_delivery

# Log commands for individual services
logs-gateway: ## View API Gateway logs
	docker-compose logs -f api-gateway

logs-order: ## View Order Service logs
	docker-compose logs -f order-service

logs-restaurant: ## View Restaurant Service logs
	docker-compose logs -f restaurant-service

logs-kitchen: ## View Kitchen Service logs
	docker-compose logs -f kitchen-service

logs-delivery: ## View Delivery Service logs
	docker-compose logs -f delivery-service

logs-accounting: ## View Accounting Service logs
	docker-compose logs -f accounting-service

logs-notification: ## View Notification Service logs
	docker-compose logs -f notification-service

# Scale commands
scale-order: ## Scale Order Service (usage: make scale-order REPLICAS=3)
	docker-compose up -d --scale order-service=$(or $(REPLICAS),2)

scale-restaurant: ## Scale Restaurant Service (usage: make scale-restaurant REPLICAS=3)
	docker-compose up -d --scale restaurant-service=$(or $(REPLICAS),2)

scale-kitchen: ## Scale Kitchen Service (usage: make scale-kitchen REPLICAS=3)
	docker-compose up -d --scale kitchen-service=$(or $(REPLICAS),2)

scale-delivery: ## Scale Delivery Service (usage: make scale-delivery REPLICAS=3)
	docker-compose up -d --scale delivery-service=$(or $(REPLICAS),2)

# API testing commands
test-api: ## Test API endpoints
	@echo "Testing API Gateway health..."
	@curl -s http://localhost:8080/health | jq .
	@echo "\nTesting restaurants endpoint..."
	@curl -s http://localhost:8080/api/v1/restaurants | jq .

# Quick start commands
quick-start: ## Quick start - build and run all services
	@echo "Starting Food Delivery Microservices..."
	@make build
	@make up
	@echo "Waiting for services to be ready..."
	@sleep 30
	@make health
	@echo "\nServices are ready!"
	@echo "API Gateway: http://localhost:8080"
	@echo "Consul UI: http://localhost:8500"
	@echo "RabbitMQ UI: http://localhost:15672"

dev-setup: ## Setup development environment
	@echo "Setting up development environment..."
	@make deps
	@make up-infra
	@echo "Infrastructure services started. You can now run individual services locally."

# Production commands
prod-build: ## Build production images
	docker-compose -f docker-compose.yml build --no-cache

prod-up: ## Start production environment
	docker-compose -f docker-compose.yml up -d