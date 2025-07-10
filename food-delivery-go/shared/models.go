package shared

import (
	"time"

	"gorm.io/gorm"
)

// BaseModel contains common fields for all models
type BaseModel struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

// User represents a user in the system
type User struct {
	BaseModel
	Username    string `json:"username" gorm:"unique;not null"`
	Email       string `json:"email" gorm:"unique;not null"`
	Password    string `json:"-" gorm:"not null"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Phone       string `json:"phone"`
	Role        string `json:"role" gorm:"default:customer"`
	Address     string `json:"address"`
	City        string `json:"city"`
	State       string `json:"state"`
	ZipCode     string `json:"zip_code"`
	IsActive    bool   `json:"is_active" gorm:"default:true"`
}

// Restaurant represents a restaurant in the system
type Restaurant struct {
	BaseModel
	Name        string  `json:"name" gorm:"not null"`
	Description string  `json:"description"`
	Address     string  `json:"address" gorm:"not null"`
	City        string  `json:"city" gorm:"not null"`
	State       string  `json:"state" gorm:"not null"`
	ZipCode     string  `json:"zip_code" gorm:"not null"`
	Phone       string  `json:"phone"`
	Email       string  `json:"email"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Rating      float64 `json:"rating" gorm:"default:0"`
	IsActive    bool    `json:"is_active" gorm:"default:true"`
	CuisineType string  `json:"cuisine_type"`
	OpeningTime string  `json:"opening_time"`
	ClosingTime string  `json:"closing_time"`
}

// MenuItem represents a menu item
type MenuItem struct {
	BaseModel
	RestaurantID uint    `json:"restaurant_id" gorm:"not null"`
	Name         string  `json:"name" gorm:"not null"`
	Description  string  `json:"description"`
	Price        float64 `json:"price" gorm:"not null"`
	Category     string  `json:"category"`
	ImageURL     string  `json:"image_url"`
	IsAvailable  bool    `json:"is_available" gorm:"default:true"`
	PrepTime     int     `json:"prep_time"` // in minutes
}

// Order represents an order
type Order struct {
	BaseModel
	CustomerID       uint           `json:"customer_id" gorm:"not null"`
	RestaurantID     uint           `json:"restaurant_id" gorm:"not null"`
	Status           string         `json:"status" gorm:"default:pending"`
	TotalAmount      float64        `json:"total_amount" gorm:"not null"`
	DeliveryFee      float64        `json:"delivery_fee" gorm:"default:0"`
	Tax              float64        `json:"tax" gorm:"default:0"`
	DeliveryAddress  string         `json:"delivery_address" gorm:"not null"`
	DeliveryCity     string         `json:"delivery_city" gorm:"not null"`
	DeliveryState    string         `json:"delivery_state" gorm:"not null"`
	DeliveryZipCode  string         `json:"delivery_zip_code" gorm:"not null"`
	SpecialInstructions string      `json:"special_instructions"`
	EstimatedDelivery time.Time     `json:"estimated_delivery"`
	ActualDelivery   *time.Time     `json:"actual_delivery,omitempty"`
	Items            []OrderItem    `json:"items" gorm:"foreignKey:OrderID"`
	DeliveryID       *uint          `json:"delivery_id,omitempty"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	BaseModel
	OrderID      uint    `json:"order_id" gorm:"not null"`
	MenuItemID   uint    `json:"menu_item_id" gorm:"not null"`
	Quantity     int     `json:"quantity" gorm:"not null"`
	Price        float64 `json:"price" gorm:"not null"`
	Instructions string  `json:"instructions"`
}

// DeliveryDriver represents a delivery driver
type DeliveryDriver struct {
	BaseModel
	UserID           uint    `json:"user_id" gorm:"not null"`
	VehicleType      string  `json:"vehicle_type"`
	LicensePlate     string  `json:"license_plate"`
	CurrentLatitude  float64 `json:"current_latitude"`
	CurrentLongitude float64 `json:"current_longitude"`
	IsAvailable      bool    `json:"is_available" gorm:"default:true"`
	Status           string  `json:"status" gorm:"default:offline"`
	Rating           float64 `json:"rating" gorm:"default:0"`
}

// Delivery represents a delivery
type Delivery struct {
	BaseModel
	OrderID           uint       `json:"order_id" gorm:"not null"`
	DriverID          uint       `json:"driver_id" gorm:"not null"`
	Status            string     `json:"status" gorm:"default:assigned"`
	PickupTime        *time.Time `json:"pickup_time,omitempty"`
	DeliveryTime      *time.Time `json:"delivery_time,omitempty"`
	EstimatedDelivery time.Time  `json:"estimated_delivery"`
	TrackingNumber    string     `json:"tracking_number" gorm:"unique"`
}

// Transaction represents a financial transaction
type Transaction struct {
	BaseModel
	OrderID       uint    `json:"order_id" gorm:"not null"`
	Type          string  `json:"type" gorm:"not null"` // payment, refund, commission
	Amount        float64 `json:"amount" gorm:"not null"`
	Status        string  `json:"status" gorm:"default:pending"`
	PaymentMethod string  `json:"payment_method"`
	Reference     string  `json:"reference"`
	Description   string  `json:"description"`
}

// Notification represents a notification
type Notification struct {
	BaseModel
	UserID    uint   `json:"user_id" gorm:"not null"`
	Title     string `json:"title" gorm:"not null"`
	Message   string `json:"message" gorm:"not null"`
	Type      string `json:"type" gorm:"not null"` // email, sms, push
	Status    string `json:"status" gorm:"default:pending"`
	ReadAt    *time.Time `json:"read_at,omitempty"`
	SentAt    *time.Time `json:"sent_at,omitempty"`
	Data      string `json:"data"` // JSON string for additional data
}

// OrderStatusHistory tracks order status changes
type OrderStatusHistory struct {
	BaseModel
	OrderID     uint   `json:"order_id" gorm:"not null"`
	Status      string `json:"status" gorm:"not null"`
	Description string `json:"description"`
	UpdatedBy   uint   `json:"updated_by"`
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// OrderStatus constants
const (
	OrderStatusPending     = "pending"
	OrderStatusConfirmed   = "confirmed"
	OrderStatusPreparing   = "preparing"
	OrderStatusReady       = "ready"
	OrderStatusPickedUp    = "picked_up"
	OrderStatusDelivered   = "delivered"
	OrderStatusCancelled   = "cancelled"
)

// DeliveryStatus constants
const (
	DeliveryStatusAssigned   = "assigned"
	DeliveryStatusEnRoute    = "en_route"
	DeliveryStatusPickedUp   = "picked_up"
	DeliveryStatusDelivering = "delivering"
	DeliveryStatusDelivered  = "delivered"
	DeliveryStatusCancelled  = "cancelled"
)

// DriverStatus constants
const (
	DriverStatusOffline   = "offline"
	DriverStatusAvailable = "available"
	DriverStatusBusy      = "busy"
	DriverStatusOnBreak   = "on_break"
)

// NotificationType constants
const (
	NotificationTypeEmail = "email"
	NotificationTypeSMS   = "sms"
	NotificationTypePush  = "push"
)

// TransactionType constants
const (
	TransactionTypePayment    = "payment"
	TransactionTypeRefund     = "refund"
	TransactionTypeCommission = "commission"
)

// UserRole constants
const (
	UserRoleCustomer = "customer"
	UserRoleAdmin    = "admin"
	UserRoleDriver   = "driver"
	UserRoleRestaurant = "restaurant"
)