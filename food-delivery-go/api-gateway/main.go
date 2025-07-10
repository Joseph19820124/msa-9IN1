package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"food-delivery-go/api-gateway/internal/handlers"
	"food-delivery-go/shared"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	config := shared.LoadConfig("api-gateway")
	
	// Create logger
	logger := shared.NewLogger("api-gateway")
	
	// Create service discovery
	sd, err := shared.NewServiceDiscovery(config.ConsulAddr, logger)
	if err != nil {
		log.Fatalf("Failed to create service discovery: %v", err)
	}
	
	// Create HTTP client
	httpClient := shared.NewHTTPClient(sd)
	
	// Create handlers
	gatewayHandler := handlers.NewGatewayHandler(httpClient, logger)
	
	// Setup Gin router
	r := gin.Default()
	
	// Middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(corsMiddleware())
	
	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})
	
	// API routes
	api := r.Group("/api/v1")
	{
		// Authentication routes
		auth := api.Group("/auth")
		{
			auth.POST("/login", gatewayHandler.Login)
			auth.POST("/register", gatewayHandler.Register)
			auth.POST("/refresh", gatewayHandler.RefreshToken)
		}
		
		// User routes
		users := api.Group("/users")
		users.Use(authMiddleware())
		{
			users.GET("/profile", gatewayHandler.GetUserProfile)
			users.PUT("/profile", gatewayHandler.UpdateUserProfile)
		}
		
		// Restaurant routes
		restaurants := api.Group("/restaurants")
		{
			restaurants.GET("", gatewayHandler.GetRestaurants)
			restaurants.GET("/:id", gatewayHandler.GetRestaurant)
			restaurants.GET("/:id/menu", gatewayHandler.GetRestaurantMenu)
		}
		
		// Order routes
		orders := api.Group("/orders")
		orders.Use(authMiddleware())
		{
			orders.POST("", gatewayHandler.CreateOrder)
			orders.GET("", gatewayHandler.GetOrders)
			orders.GET("/:id", gatewayHandler.GetOrder)
			orders.PUT("/:id/cancel", gatewayHandler.CancelOrder)
		}
		
		// Delivery routes
		delivery := api.Group("/delivery")
		delivery.Use(authMiddleware())
		{
			delivery.GET("/track/:order_id", gatewayHandler.TrackDelivery)
		}
		
		// Notification routes
		notifications := api.Group("/notifications")
		notifications.Use(authMiddleware())
		{
			notifications.GET("", gatewayHandler.GetNotifications)
			notifications.PUT("/:id/read", gatewayHandler.MarkNotificationRead)
		}
	}
	
	// Register service with consul
	err = sd.Register(config)
	if err != nil {
		log.Fatalf("Failed to register service: %v", err)
	}
	
	// Start server
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", config.Port),
		Handler: r,
	}
	
	go func() {
		logger.Info("Starting API Gateway on port %s", config.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()
	
	// Wait for interrupt signal to gracefully shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	
	logger.Info("Shutting down server...")
	
	// Deregister from consul
	sd.Deregister(config.ServiceID)
	
	// Shutdown server
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	
	logger.Info("Server exited")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, shared.APIResponse{
				Success: false,
				Message: "Authorization header required",
			})
			c.Abort()
			return
		}

		// TODO: Implement JWT token validation
		// For now, just pass through
		c.Next()
	}
}