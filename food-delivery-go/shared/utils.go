package shared

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/hashicorp/consul/api"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Database string
	SSLMode  string
}

// NewDatabaseConnection creates a new database connection
func NewDatabaseConnection(config DatabaseConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		config.Host, config.User, config.Password, config.Database, config.Port, config.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	return db, nil
}

// ConsulClient holds the consul client
type ConsulClient struct {
	client *api.Client
}

// NewConsulClient creates a new consul client
func NewConsulClient(address string) (*ConsulClient, error) {
	config := api.DefaultConfig()
	config.Address = address
	
	client, err := api.NewClient(config)
	if err != nil {
		return nil, fmt.Errorf("failed to create consul client: %w", err)
	}

	return &ConsulClient{client: client}, nil
}

// RegisterService registers a service with consul
func (c *ConsulClient) RegisterService(service *api.AgentServiceRegistration) error {
	return c.client.Agent().ServiceRegister(service)
}

// DeregisterService deregisters a service from consul
func (c *ConsulClient) DeregisterService(serviceID string) error {
	return c.client.Agent().ServiceDeregister(serviceID)
}

// DiscoverService discovers a service from consul
func (c *ConsulClient) DiscoverService(serviceName string) ([]*api.ServiceEntry, error) {
	services, _, err := c.client.Health().Service(serviceName, "", true, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to discover service %s: %w", serviceName, err)
	}

	return services, nil
}

// GetServiceURL returns the URL for a service
func (c *ConsulClient) GetServiceURL(serviceName string) (string, error) {
	services, err := c.DiscoverService(serviceName)
	if err != nil {
		return "", err
	}

	if len(services) == 0 {
		return "", fmt.Errorf("no healthy instances of service %s found", serviceName)
	}

	service := services[0]
	return fmt.Sprintf("http://%s:%d", service.Service.Address, service.Service.Port), nil
}

// Config holds application configuration
type Config struct {
	Port         string
	Database     DatabaseConfig
	ConsulAddr   string
	ServiceName  string
	ServiceID    string
	ServiceAddr  string
	RedisAddr    string
	RabbitMQAddr string
	JWTSecret    string
}

// LoadConfig loads configuration from environment variables
func LoadConfig(serviceName string) *Config {
	return &Config{
		Port: getEnv("PORT", "8080"),
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Database: getEnv("DB_NAME", serviceName),
			SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		},
		ConsulAddr:   getEnv("CONSUL_ADDR", "localhost:8500"),
		ServiceName:  serviceName,
		ServiceID:    fmt.Sprintf("%s-%s", serviceName, getEnv("INSTANCE_ID", "1")),
		ServiceAddr:  getEnv("SERVICE_ADDR", "localhost"),
		RedisAddr:    getEnv("REDIS_ADDR", "localhost:6379"),
		RabbitMQAddr: getEnv("RABBITMQ_ADDR", "amqp://guest:guest@localhost:5672/"),
		JWTSecret:    getEnv("JWT_SECRET", "your-secret-key"),
	}
}

// getEnv gets an environment variable with a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// Logger provides structured logging
type Logger struct {
	serviceName string
}

// NewLogger creates a new logger
func NewLogger(serviceName string) *Logger {
	return &Logger{serviceName: serviceName}
}

// Info logs an info message
func (l *Logger) Info(msg string, args ...interface{}) {
	log.Printf("[%s] INFO: %s", l.serviceName, fmt.Sprintf(msg, args...))
}

// Error logs an error message
func (l *Logger) Error(msg string, args ...interface{}) {
	log.Printf("[%s] ERROR: %s", l.serviceName, fmt.Sprintf(msg, args...))
}

// Debug logs a debug message
func (l *Logger) Debug(msg string, args ...interface{}) {
	log.Printf("[%s] DEBUG: %s", l.serviceName, fmt.Sprintf(msg, args...))
}

// Warn logs a warning message
func (l *Logger) Warn(msg string, args ...interface{}) {
	log.Printf("[%s] WARN: %s", l.serviceName, fmt.Sprintf(msg, args...))
}

// ServiceDiscovery provides service discovery functionality
type ServiceDiscovery struct {
	consul *ConsulClient
	logger *Logger
}

// NewServiceDiscovery creates a new service discovery instance
func NewServiceDiscovery(consulAddr string, logger *Logger) (*ServiceDiscovery, error) {
	consul, err := NewConsulClient(consulAddr)
	if err != nil {
		return nil, err
	}

	return &ServiceDiscovery{
		consul: consul,
		logger: logger,
	}, nil
}

// Register registers the service with consul
func (sd *ServiceDiscovery) Register(config *Config) error {
	registration := &api.AgentServiceRegistration{
		ID:      config.ServiceID,
		Name:    config.ServiceName,
		Address: config.ServiceAddr,
		Port:    parsePort(config.Port),
		Check: &api.AgentServiceCheck{
			HTTP:     fmt.Sprintf("http://%s:%s/health", config.ServiceAddr, config.Port),
			Interval: "10s",
			Timeout:  "5s",
		},
	}

	err := sd.consul.RegisterService(registration)
	if err != nil {
		sd.logger.Error("Failed to register service: %v", err)
		return err
	}

	sd.logger.Info("Service registered successfully: %s", config.ServiceID)
	return nil
}

// Deregister deregisters the service from consul
func (sd *ServiceDiscovery) Deregister(serviceID string) error {
	err := sd.consul.DeregisterService(serviceID)
	if err != nil {
		sd.logger.Error("Failed to deregister service: %v", err)
		return err
	}

	sd.logger.Info("Service deregistered successfully: %s", serviceID)
	return nil
}

// GetServiceURL returns the URL for a service
func (sd *ServiceDiscovery) GetServiceURL(serviceName string) (string, error) {
	return sd.consul.GetServiceURL(serviceName)
}

// parsePort converts port string to int
func parsePort(portStr string) int {
	if portStr == "" {
		return 8080
	}
	
	var port int
	fmt.Sscanf(portStr, "%d", &port)
	return port
}

// HTTPClient provides HTTP client functionality with service discovery
type HTTPClient struct {
	sd *ServiceDiscovery
}

// NewHTTPClient creates a new HTTP client
func NewHTTPClient(sd *ServiceDiscovery) *HTTPClient {
	return &HTTPClient{sd: sd}
}

// GetServiceURL returns the URL for a service
func (h *HTTPClient) GetServiceURL(serviceName string) (string, error) {
	return h.sd.GetServiceURL(serviceName)
}

// GracefulShutdown handles graceful shutdown
func GracefulShutdown(ctx context.Context, sd *ServiceDiscovery, serviceID string, shutdownFunc func() error) error {
	// Wait for shutdown signal
	<-ctx.Done()

	// Deregister from consul
	if sd != nil {
		sd.Deregister(serviceID)
	}

	// Perform custom shutdown
	if shutdownFunc != nil {
		return shutdownFunc()
	}

	return nil
}