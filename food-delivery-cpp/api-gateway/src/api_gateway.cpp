#include "api_gateway.h"
#include "http_client.h"
#include <iostream>
#include <sstream>

ApiGateway::ApiGateway(const std::map<std::string, std::string>& service_urls) 
    : service_urls_(service_urls), server_(std::make_unique<httplib::Server>()) {
    setupRoutes();
}

bool ApiGateway::start(const std::string& host, int port) {
    return server_->listen(host.c_str(), port);
}

void ApiGateway::setupRoutes() {
    // CORS headers
    server_->set_pre_routing_handler([](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return httplib::Server::HandlerResponse::Unhandled;
    });

    // Health check
    server_->Get("/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content(R"({"status": "healthy", "service": "api-gateway"})", "application/json");
    });

    // Order endpoints
    server_->Get("/api/orders", [this](const httplib::Request&, httplib::Response& res) {
        std::string result = callService("order", "GET", "/orders");
        res.set_content(result, "application/json");
    });

    server_->Get(R"(/api/orders/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string result = callService("order", "GET", "/orders/" + id);
        res.set_content(result, "application/json");
    });

    server_->Post("/api/orders", [this](const httplib::Request& req, httplib::Response& res) {
        std::string result = callService("order", "POST", "/orders", req.body);
        res.set_content(result, "application/json");
        res.status = 201;
    });

    server_->Put(R"(/api/orders/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string result = callService("order", "PUT", "/orders/" + id, req.body);
        res.set_content(result, "application/json");
    });

    // Restaurant endpoints
    server_->Get("/api/restaurants", [this](const httplib::Request&, httplib::Response& res) {
        std::string result = callService("restaurant", "GET", "/restaurants");
        res.set_content(result, "application/json");
    });

    server_->Get(R"(/api/restaurants/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string result = callService("restaurant", "GET", "/restaurants/" + id);
        res.set_content(result, "application/json");
    });

    server_->Post("/api/restaurants", [this](const httplib::Request& req, httplib::Response& res) {
        std::string result = callService("restaurant", "POST", "/restaurants", req.body);
        res.set_content(result, "application/json");
        res.status = 201;
    });

    // Menu endpoints
    server_->Get(R"(/api/restaurants/(\d+)/menu)", [this](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string result = callService("restaurant", "GET", "/restaurants/" + id + "/menu");
        res.set_content(result, "application/json");
    });

    server_->Post(R"(/api/restaurants/(\d+)/menu)", [this](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string result = callService("restaurant", "POST", "/restaurants/" + id + "/menu", req.body);
        res.set_content(result, "application/json");
        res.status = 201;
    });

    // Kitchen endpoints
    server_->Get("/api/kitchen/orders", [this](const httplib::Request&, httplib::Response& res) {
        std::string result = callService("kitchen", "GET", "/kitchen/orders");
        res.set_content(result, "application/json");
    });

    server_->Put(R"(/api/kitchen/orders/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string result = callService("kitchen", "PUT", "/kitchen/orders/" + id, req.body);
        res.set_content(result, "application/json");
    });

    // Delivery endpoints
    server_->Get("/api/deliveries", [this](const httplib::Request&, httplib::Response& res) {
        std::string result = callService("delivery", "GET", "/deliveries");
        res.set_content(result, "application/json");
    });

    server_->Get(R"(/api/deliveries/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string result = callService("delivery", "GET", "/deliveries/" + id);
        res.set_content(result, "application/json");
    });

    server_->Put(R"(/api/deliveries/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        std::string id = req.matches[1];
        std::string result = callService("delivery", "PUT", "/deliveries/" + id, req.body);
        res.set_content(result, "application/json");
    });

    // Accounting endpoints
    server_->Get("/api/payments", [this](const httplib::Request&, httplib::Response& res) {
        std::string result = callService("accounting", "GET", "/payments");
        res.set_content(result, "application/json");
    });

    server_->Post("/api/payments", [this](const httplib::Request& req, httplib::Response& res) {
        std::string result = callService("accounting", "POST", "/payments", req.body);
        res.set_content(result, "application/json");
        res.status = 201;
    });

    // Notification endpoints
    server_->Post("/api/notifications", [this](const httplib::Request& req, httplib::Response& res) {
        std::string result = callService("notification", "POST", "/notifications", req.body);
        res.set_content(result, "application/json");
        res.status = 201;
    });
}

std::string ApiGateway::callService(const std::string& service, const std::string& method, 
                                  const std::string& path, const std::string& body) {
    try {
        HttpClient client(service_urls_.at(service));
        return client.request(method, path, body);
    } catch (const std::exception& e) {
        std::cerr << "Service call failed: " << e.what() << std::endl;
        return R"({"error": "Service unavailable"})";
    }
}