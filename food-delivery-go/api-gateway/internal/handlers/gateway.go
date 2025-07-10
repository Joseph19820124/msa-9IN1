package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"food-delivery-go/shared"

	"github.com/gin-gonic/gin"
)

// GatewayHandler handles API gateway requests
type GatewayHandler struct {
	httpClient *shared.HTTPClient
	logger     *shared.Logger
}

// NewGatewayHandler creates a new gateway handler
func NewGatewayHandler(httpClient *shared.HTTPClient, logger *shared.Logger) *GatewayHandler {
	return &GatewayHandler{
		httpClient: httpClient,
		logger:     logger,
	}
}

// Login handles user login
func (h *GatewayHandler) Login(c *gin.Context) {
	h.proxyRequest(c, "user-service", "/api/v1/auth/login", "POST")
}

// Register handles user registration
func (h *GatewayHandler) Register(c *gin.Context) {
	h.proxyRequest(c, "user-service", "/api/v1/auth/register", "POST")
}

// RefreshToken handles token refresh
func (h *GatewayHandler) RefreshToken(c *gin.Context) {
	h.proxyRequest(c, "user-service", "/api/v1/auth/refresh", "POST")
}

// GetUserProfile gets user profile
func (h *GatewayHandler) GetUserProfile(c *gin.Context) {
	h.proxyRequest(c, "user-service", "/api/v1/users/profile", "GET")
}

// UpdateUserProfile updates user profile
func (h *GatewayHandler) UpdateUserProfile(c *gin.Context) {
	h.proxyRequest(c, "user-service", "/api/v1/users/profile", "PUT")
}

// GetRestaurants gets all restaurants
func (h *GatewayHandler) GetRestaurants(c *gin.Context) {
	h.proxyRequest(c, "restaurant-service", "/api/v1/restaurants", "GET")
}

// GetRestaurant gets a specific restaurant
func (h *GatewayHandler) GetRestaurant(c *gin.Context) {
	id := c.Param("id")
	path := fmt.Sprintf("/api/v1/restaurants/%s", id)
	h.proxyRequest(c, "restaurant-service", path, "GET")
}

// GetRestaurantMenu gets restaurant menu
func (h *GatewayHandler) GetRestaurantMenu(c *gin.Context) {
	id := c.Param("id")
	path := fmt.Sprintf("/api/v1/restaurants/%s/menu", id)
	h.proxyRequest(c, "restaurant-service", path, "GET")
}

// CreateOrder creates a new order
func (h *GatewayHandler) CreateOrder(c *gin.Context) {
	h.proxyRequest(c, "order-service", "/api/v1/orders", "POST")
}

// GetOrders gets user orders
func (h *GatewayHandler) GetOrders(c *gin.Context) {
	h.proxyRequest(c, "order-service", "/api/v1/orders", "GET")
}

// GetOrder gets a specific order
func (h *GatewayHandler) GetOrder(c *gin.Context) {
	id := c.Param("id")
	path := fmt.Sprintf("/api/v1/orders/%s", id)
	h.proxyRequest(c, "order-service", path, "GET")
}

// CancelOrder cancels an order
func (h *GatewayHandler) CancelOrder(c *gin.Context) {
	id := c.Param("id")
	path := fmt.Sprintf("/api/v1/orders/%s/cancel", id)
	h.proxyRequest(c, "order-service", path, "PUT")
}

// TrackDelivery tracks delivery status
func (h *GatewayHandler) TrackDelivery(c *gin.Context) {
	orderID := c.Param("order_id")
	path := fmt.Sprintf("/api/v1/delivery/track/%s", orderID)
	h.proxyRequest(c, "delivery-service", path, "GET")
}

// GetNotifications gets user notifications
func (h *GatewayHandler) GetNotifications(c *gin.Context) {
	h.proxyRequest(c, "notification-service", "/api/v1/notifications", "GET")
}

// MarkNotificationRead marks notification as read
func (h *GatewayHandler) MarkNotificationRead(c *gin.Context) {
	id := c.Param("id")
	path := fmt.Sprintf("/api/v1/notifications/%s/read", id)
	h.proxyRequest(c, "notification-service", path, "PUT")
}

// proxyRequest proxies the request to the appropriate service
func (h *GatewayHandler) proxyRequest(c *gin.Context, serviceName, path, method string) {
	// Get service URL
	serviceURL, err := h.httpClient.GetServiceURL(serviceName)
	if err != nil {
		h.logger.Error("Failed to get service URL for %s: %v", serviceName, err)
		c.JSON(http.StatusServiceUnavailable, shared.APIResponse{
			Success: false,
			Message: "Service temporarily unavailable",
			Error:   err.Error(),
		})
		return
	}

	// Build target URL
	targetURL := serviceURL + path
	
	// Add query parameters
	if len(c.Request.URL.RawQuery) > 0 {
		targetURL += "?" + c.Request.URL.RawQuery
	}

	// Read request body
	var bodyBytes []byte
	if c.Request.Body != nil {
		bodyBytes, _ = io.ReadAll(c.Request.Body)
	}

	// Create new request
	req, err := http.NewRequest(method, targetURL, bytes.NewBuffer(bodyBytes))
	if err != nil {
		h.logger.Error("Failed to create request: %v", err)
		c.JSON(http.StatusInternalServerError, shared.APIResponse{
			Success: false,
			Message: "Internal server error",
			Error:   err.Error(),
		})
		return
	}

	// Copy headers
	for key, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	// Make request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		h.logger.Error("Failed to make request to %s: %v", targetURL, err)
		c.JSON(http.StatusBadGateway, shared.APIResponse{
			Success: false,
			Message: "Bad gateway",
			Error:   err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	// Read response body
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		h.logger.Error("Failed to read response body: %v", err)
		c.JSON(http.StatusInternalServerError, shared.APIResponse{
			Success: false,
			Message: "Internal server error",
			Error:   err.Error(),
		})
		return
	}

	// Copy response headers
	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	// Return response
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), respBody)
}

// getUserIDFromToken extracts user ID from JWT token
func (h *GatewayHandler) getUserIDFromToken(c *gin.Context) (uint, error) {
	// TODO: Implement JWT token parsing
	// For now, return a dummy user ID
	return 1, nil
}

// getQueryParam gets query parameter as string
func getQueryParam(c *gin.Context, key, defaultValue string) string {
	if value := c.Query(key); value != "" {
		return value
	}
	return defaultValue
}

// getQueryParamInt gets query parameter as int
func getQueryParamInt(c *gin.Context, key string, defaultValue int) int {
	if value := c.Query(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

// validateJSON validates JSON request body
func validateJSON(c *gin.Context, obj interface{}) error {
	if err := c.ShouldBindJSON(obj); err != nil {
		return err
	}
	return nil
}

// sendResponse sends a standardized JSON response
func sendResponse(c *gin.Context, statusCode int, success bool, message string, data interface{}) {
	response := shared.APIResponse{
		Success: success,
		Message: message,
		Data:    data,
	}
	c.JSON(statusCode, response)
}

// sendError sends an error response
func sendError(c *gin.Context, statusCode int, message string, err error) {
	response := shared.APIResponse{
		Success: false,
		Message: message,
	}
	if err != nil {
		response.Error = err.Error()
	}
	c.JSON(statusCode, response)
}