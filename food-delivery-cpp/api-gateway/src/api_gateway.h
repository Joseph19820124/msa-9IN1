#pragma once

#include <string>
#include <map>
#include <memory>
#include "../include/httplib.h"

class ApiGateway {
public:
    ApiGateway(const std::map<std::string, std::string>& service_urls);
    bool start(const std::string& host, int port);

private:
    void setupRoutes();
    std::string callService(const std::string& service, const std::string& method, 
                          const std::string& path, const std::string& body = "");
    
    std::map<std::string, std::string> service_urls_;
    std::unique_ptr<httplib::Server> server_;
};