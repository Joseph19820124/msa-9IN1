#pragma once

#include <string>
#include <memory>
#include "httplib.h"
#include "database.h"

class OrderService {
public:
    OrderService(const std::string& database_url, const std::string& notification_service_url);
    bool start(const std::string& host, int port);

private:
    void setupRoutes();
    void notifyService(const std::string& event, const std::string& data);
    
    std::unique_ptr<httplib::Server> server_;
    std::unique_ptr<Database> database_;
    std::string notification_service_url_;
};