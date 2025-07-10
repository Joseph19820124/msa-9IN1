// This is a placeholder for the cpp-httplib header
// In a real implementation, you would download the single-header library from:
// https://github.com/yhirose/cpp-httplib
#pragma once

// Minimal interface for demonstration
namespace httplib {
    class Server {
    public:
        bool listen(const char* host, int port);
        void Get(const char* pattern, auto handler);
        void Post(const char* pattern, auto handler);
        void Put(const char* pattern, auto handler);
        void Delete(const char* pattern, auto handler);
    };
    
    class Request {
    public:
        std::string body;
        std::map<std::string, std::string> params;
    };
    
    class Response {
    public:
        void set_content(const std::string& content, const char* content_type);
        void status = 200;
    };
    
    class Client {
    public:
        Client(const char* host, int port);
        auto Get(const char* path);
        auto Post(const char* path, const std::string& body, const char* content_type);
        auto Put(const char* path, const std::string& body, const char* content_type);
        auto Delete(const char* path);
    };
}