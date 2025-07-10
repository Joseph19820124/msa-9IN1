#!/bin/bash

# Food Delivery Microservices - API Testing Script

API_BASE="http://localhost:3000"
JWT_TOKEN=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Food Delivery API Testing Script"
echo "=================================="

# Function to make API calls
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "Method: $method"
    echo "Endpoint: $API_BASE$endpoint"
    
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    local headers=""
    if [ -n "$JWT_TOKEN" ]; then
        headers="-H 'Authorization: Bearer $JWT_TOKEN'"
    fi
    
    local cmd="curl -s -X $method $API_BASE$endpoint -H 'Content-Type: application/json' $headers"
    if [ -n "$data" ]; then
        cmd="$cmd -d '$data'"
    fi
    
    echo "Command: $cmd"
    echo "Response:"
    
    local response=$(eval $cmd)
    local status=$?
    
    if [ $status -eq 0 ]; then
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
        echo -e "${GREEN}✅ Success${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
        echo "Error: $response"
    fi
    
    echo "---"
}

# 1. Test authentication
echo -e "\n${YELLOW}1. Testing Authentication${NC}"
auth_response=$(curl -s -X POST $API_BASE/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@fooddelivery.com", "password": "admin123"}')

if echo "$auth_response" | grep -q "token"; then
    JWT_TOKEN=$(echo "$auth_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    echo -e "${GREEN}✅ Authentication successful${NC}"
    echo "JWT Token: ${JWT_TOKEN:0:50}..."
else
    echo -e "${RED}❌ Authentication failed${NC}"
    echo "Response: $auth_response"
    exit 1
fi

# 2. Test service discovery
api_call "GET" "/services" "" "Service Discovery"

# 3. Test restaurant creation
restaurant_data='{
    "name": "Test Pizza Palace",
    "description": "Best pizza in town for testing",
    "address": {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TC",
        "zipCode": "12345"
    },
    "contact": {
        "phone": "+1234567890",
        "email": "test@pizzapalace.com"
    },
    "cuisineTypes": ["Italian", "Pizza"],
    "deliveryInfo": {
        "deliveryFee": 3.99,
        "minimumOrder": 15.00,
        "deliveryRadius": 10,
        "averageDeliveryTime": 30
    }
}'

echo -e "\n${YELLOW}2. Testing Restaurant Management${NC}"
restaurant_response=$(curl -s -X POST $API_BASE/api/restaurants \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -d "$restaurant_data")

if echo "$restaurant_response" | grep -q "restaurantId"; then
    RESTAURANT_ID=$(echo "$restaurant_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['restaurant']['restaurantId'])" 2>/dev/null)
    echo -e "${GREEN}✅ Restaurant created successfully${NC}"
    echo "Restaurant ID: $RESTAURANT_ID"
else
    echo -e "${RED}❌ Restaurant creation failed${NC}"
    echo "Response: $restaurant_response"
fi

# 4. Test menu item creation
if [ -n "$RESTAURANT_ID" ]; then
    menu_item_data='{
        "name": "Test Margherita Pizza",
        "description": "Classic pizza with tomato sauce, mozzarella, and basil",
        "price": 12.99,
        "category": "MAIN_COURSE",
        "cuisineType": "Italian",
        "preparationTime": 15,
        "dietaryRestrictions": ["VEGETARIAN"]
    }'
    
    menu_response=$(curl -s -X POST $API_BASE/api/restaurants/$RESTAURANT_ID/menu \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "$menu_item_data")
    
    if echo "$menu_response" | grep -q "menuItemId"; then
        MENU_ITEM_ID=$(echo "$menu_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['menuItem']['menuItemId'])" 2>/dev/null)
        echo -e "${GREEN}✅ Menu item created successfully${NC}"
        echo "Menu Item ID: $MENU_ITEM_ID"
    else
        echo -e "${RED}❌ Menu item creation failed${NC}"
        echo "Response: $menu_response"
    fi
fi

# 5. Test order creation
if [ -n "$RESTAURANT_ID" ] && [ -n "$MENU_ITEM_ID" ]; then
    order_data='{
        "customerId": "test-customer-123",
        "restaurantId": "'$RESTAURANT_ID'",
        "items": [
            {
                "menuItemId": "'$MENU_ITEM_ID'",
                "name": "Test Margherita Pizza",
                "quantity": 2,
                "price": 12.99
            }
        ],
        "deliveryAddress": {
            "street": "456 Test Ave",
            "city": "Test City",
            "state": "TC",
            "zipCode": "12346"
        },
        "paymentMethod": "CREDIT_CARD"
    }'
    
    echo -e "\n${YELLOW}3. Testing Order Management${NC}"
    order_response=$(curl -s -X POST $API_BASE/api/orders \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "$order_data")
    
    if echo "$order_response" | grep -q "orderId"; then
        ORDER_ID=$(echo "$order_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['order']['orderId'])" 2>/dev/null)
        echo -e "${GREEN}✅ Order created successfully${NC}"
        echo "Order ID: $ORDER_ID"
        
        # Test order retrieval
        api_call "GET" "/api/orders/$ORDER_ID" "" "Get Order Details"
    else
        echo -e "${RED}❌ Order creation failed${NC}"
        echo "Response: $order_response"
    fi
fi

# 6. Test other services
echo -e "\n${YELLOW}4. Testing Other Services${NC}"
api_call "GET" "/api/restaurants" "" "Get Restaurants"
api_call "GET" "/api/orders" "" "Get Orders"

# 7. Test accounting service
if [ -n "$ORDER_ID" ]; then
    payment_data='{
        "amount": 29.97,
        "orderId": "'$ORDER_ID'",
        "customerId": "test-customer-123",
        "restaurantId": "'$RESTAURANT_ID'"
    }'
    
    echo -e "\n${YELLOW}5. Testing Payment Processing${NC}"
    payment_response=$(curl -s -X POST $API_BASE/api/accounting/payments/create-intent \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "$payment_data")
    
    if echo "$payment_response" | grep -q "clientSecret"; then
        echo -e "${GREEN}✅ Payment intent created successfully${NC}"
        echo "Payment response: $payment_response"
    else
        echo -e "${RED}❌ Payment intent creation failed${NC}"
        echo "Response: $payment_response"
    fi
fi

echo -e "\n${GREEN}🎉 API Testing Complete!${NC}"
echo "=================================="
echo "Check the responses above for detailed results."
echo ""
echo "To test more endpoints, refer to the README.md file."