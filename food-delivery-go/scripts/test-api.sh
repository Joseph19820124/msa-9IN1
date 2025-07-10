#!/bin/bash

# Food Delivery API Test Script
echo "Testing Food Delivery Microservices API..."
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URLs
API_GATEWAY="http://localhost:8080"
ORDER_SERVICE="http://localhost:8081"
RESTAURANT_SERVICE="http://localhost:8082"
KITCHEN_SERVICE="http://localhost:8083"
DELIVERY_SERVICE="http://localhost:8084"
ACCOUNTING_SERVICE="http://localhost:8085"
NOTIFICATION_SERVICE="http://localhost:8086"

# Function to test endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $description... "
    
    response=$(curl -s -w "%{http_code}" -o /dev/null "$url")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response)"
    fi
}

# Function to test JSON endpoint
test_json_endpoint() {
    local url=$1
    local description=$2
    
    echo -n "Testing $description... "
    
    response=$(curl -s "$url")
    if echo "$response" | jq . >/dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC} (Valid JSON)"
        echo "   Response: $(echo "$response" | jq -c .)"
    else
        echo -e "${RED}✗ FAIL${NC} (Invalid JSON or no response)"
        echo "   Response: $response"
    fi
}

echo -e "${YELLOW}Health Checks${NC}"
echo "-------------"
test_endpoint "$API_GATEWAY/health" "API Gateway Health"
test_endpoint "$ORDER_SERVICE/health" "Order Service Health"
test_endpoint "$RESTAURANT_SERVICE/health" "Restaurant Service Health"
test_endpoint "$KITCHEN_SERVICE/health" "Kitchen Service Health"
test_endpoint "$DELIVERY_SERVICE/health" "Delivery Service Health"
test_endpoint "$ACCOUNTING_SERVICE/health" "Accounting Service Health"
test_endpoint "$NOTIFICATION_SERVICE/health" "Notification Service Health"

echo ""
echo -e "${YELLOW}API Gateway Endpoints${NC}"
echo "---------------------"
test_json_endpoint "$API_GATEWAY/api/v1/restaurants" "Get Restaurants"

echo ""
echo -e "${YELLOW}Restaurant Service Endpoints${NC}"
echo "----------------------------"
test_json_endpoint "$RESTAURANT_SERVICE/api/v1/restaurants" "Get Restaurants (Direct)"
test_json_endpoint "$RESTAURANT_SERVICE/api/v1/menu/categories" "Get Menu Categories"

echo ""
echo -e "${YELLOW}Order Service Endpoints${NC}"
echo "-----------------------"
# Note: These might return 401 without authentication
test_endpoint "$ORDER_SERVICE/api/v1/orders" "Get Orders" 401

echo ""
echo -e "${YELLOW}Kitchen Service Endpoints${NC}"
echo "-------------------------"
test_endpoint "$KITCHEN_SERVICE/api/v1/kitchen/orders?restaurant_id=1" "Get Kitchen Orders" 400

echo ""
echo -e "${YELLOW}Delivery Service Endpoints${NC}"
echo "--------------------------"
test_json_endpoint "$DELIVERY_SERVICE/api/v1/delivery/drivers" "Get Delivery Drivers"

echo ""
echo -e "${YELLOW}Accounting Service Endpoints${NC}"
echo "----------------------------"
test_json_endpoint "$ACCOUNTING_SERVICE/api/v1/accounting/transactions" "Get Transactions"

echo ""
echo -e "${YELLOW}Notification Service Endpoints${NC}"
echo "------------------------------"
test_json_endpoint "$NOTIFICATION_SERVICE/api/v1/notifications" "Get Notifications"

echo ""
echo -e "${YELLOW}Creating Test Data${NC}"
echo "------------------"

# Create a test restaurant
echo -n "Creating test restaurant... "
restaurant_data='{
  "name": "Test Pizza Place",
  "description": "Best pizza in town",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001",
  "phone": "555-0123",
  "email": "test@pizzaplace.com",
  "cuisine_type": "Italian",
  "opening_time": "09:00",
  "closing_time": "22:00"
}'

restaurant_response=$(curl -s -X POST "$RESTAURANT_SERVICE/api/v1/restaurants" \
  -H "Content-Type: application/json" \
  -d "$restaurant_data")

if echo "$restaurant_response" | jq .success | grep -q true; then
    echo -e "${GREEN}✓ PASS${NC}"
    restaurant_id=$(echo "$restaurant_response" | jq -r '.data.id')
    echo "   Created restaurant with ID: $restaurant_id"
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "   Response: $restaurant_response"
fi

# Create a test menu item
if [ ! -z "$restaurant_id" ]; then
    echo -n "Creating test menu item... "
    menu_item_data='{
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato, mozzarella, and basil",
      "price": 15.99,
      "category": "Pizza",
      "prep_time": 20
    }'
    
    menu_response=$(curl -s -X POST "$RESTAURANT_SERVICE/api/v1/restaurants/$restaurant_id/menu" \
      -H "Content-Type: application/json" \
      -d "$menu_item_data")
    
    if echo "$menu_response" | jq .success | grep -q true; then
        echo -e "${GREEN}✓ PASS${NC}"
        menu_item_id=$(echo "$menu_response" | jq -r '.data.id')
        echo "   Created menu item with ID: $menu_item_id"
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "   Response: $menu_response"
    fi
fi

# Create a test driver
echo -n "Creating test driver... "
driver_data='{
  "user_id": 1,
  "vehicle_type": "Car",
  "license_plate": "ABC123",
  "current_latitude": 40.7128,
  "current_longitude": -74.0060
}'

driver_response=$(curl -s -X POST "$DELIVERY_SERVICE/api/v1/delivery/drivers" \
  -H "Content-Type: application/json" \
  -d "$driver_data")

if echo "$driver_response" | jq .success | grep -q true; then
    echo -e "${GREEN}✓ PASS${NC}"
    driver_id=$(echo "$driver_response" | jq -r '.data.id')
    echo "   Created driver with ID: $driver_id"
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "   Response: $driver_response"
fi

echo ""
echo -e "${YELLOW}Integration Tests${NC}"
echo "-----------------"

# Test getting the created restaurant
if [ ! -z "$restaurant_id" ]; then
    test_json_endpoint "$RESTAURANT_SERVICE/api/v1/restaurants/$restaurant_id" "Get Created Restaurant"
    test_json_endpoint "$RESTAURANT_SERVICE/api/v1/restaurants/$restaurant_id/menu" "Get Restaurant Menu"
fi

# Test getting the created driver
if [ ! -z "$driver_id" ]; then
    test_json_endpoint "$DELIVERY_SERVICE/api/v1/delivery/drivers/$driver_id" "Get Created Driver"
fi

echo ""
echo "==========================================="
echo -e "${GREEN}API Testing Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Check Consul UI: http://localhost:8500"
echo "2. Check RabbitMQ UI: http://localhost:15672 (guest/guest)"
echo "3. Test API Gateway: http://localhost:8080/api/v1/restaurants"
echo ""