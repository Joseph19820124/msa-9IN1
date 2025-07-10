#include <iostream>
#include <string>
#include <cstdlib>
#include "../include/order_service.h"

int main() {
    try {
        // Get configuration from environment
        const char* port_env = std::getenv("PORT");
        int port = port_env ? std::atoi(port_env) : 3001;
        
        const char* database_url = std::getenv("DATABASE_URL");
        if (!database_url) {
            std::cerr << "DATABASE_URL environment variable is required" << std::endl;
            return 1;
        }
        
        const char* notification_service_url = std::getenv("NOTIFICATION_SERVICE_URL");
        std::string notification_url = notification_service_url ? 
            notification_service_url : "http://notification-service:3006";
        
        // Create and start the service
        OrderService service(database_url, notification_url);
        
        std::cout << "Order Service starting on port " << port << std::endl;
        
        if (service.start("0.0.0.0", port)) {
            std::cout << "Order Service started successfully" << std::endl;
        } else {
            std::cerr << "Failed to start Order Service" << std::endl;
            return 1;
        }
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}