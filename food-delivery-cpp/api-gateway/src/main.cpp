#include <iostream>
#include <string>
#include <map>
#include <memory>
#include <cstdlib>
#include "../include/httplib.h"
#include "api_gateway.h"

int main() {
    // Get port from environment or use default
    const char* port_env = std::getenv("PORT");
    int port = port_env ? std::atoi(port_env) : 3000;
    
    // Service URLs
    std::map<std::string, std::string> service_urls = {
        {"order", std::getenv("ORDER_SERVICE_URL") ?: "http://order-service:3001"},
        {"restaurant", std::getenv("RESTAURANT_SERVICE_URL") ?: "http://restaurant-service:3002"},
        {"kitchen", std::getenv("KITCHEN_SERVICE_URL") ?: "http://kitchen-service:3003"},
        {"delivery", std::getenv("DELIVERY_SERVICE_URL") ?: "http://delivery-service:3004"},
        {"accounting", std::getenv("ACCOUNTING_SERVICE_URL") ?: "http://accounting-service:3005"},
        {"notification", std::getenv("NOTIFICATION_SERVICE_URL") ?: "http://notification-service:3006"}
    };
    
    auto gateway = std::make_unique<ApiGateway>(service_urls);
    
    std::cout << "API Gateway starting on port " << port << std::endl;
    
    if (gateway->start("0.0.0.0", port)) {
        std::cout << "API Gateway started successfully" << std::endl;
    } else {
        std::cerr << "Failed to start API Gateway" << std::endl;
        return 1;
    }
    
    return 0;
}