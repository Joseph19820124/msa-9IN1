from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator
from decimal import Decimal

# Enums
class OrderStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY = "READY"
    PICKED_UP = "PICKED_UP"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class DeliveryStatus(str, Enum):
    PENDING = "PENDING"
    ASSIGNED = "ASSIGNED"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class NotificationType(str, Enum):
    ORDER_CONFIRMATION = "ORDER_CONFIRMATION"
    ORDER_READY = "ORDER_READY"
    DELIVERY_ASSIGNED = "DELIVERY_ASSIGNED"
    DELIVERY_PICKED_UP = "DELIVERY_PICKED_UP"
    DELIVERY_COMPLETED = "DELIVERY_COMPLETED"
    PAYMENT_CONFIRMATION = "PAYMENT_CONFIRMATION"

# Base Response Models
class BaseResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[Any] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

# Common Data Models
class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "US"
    
    class Config:
        schema_extra = {
            "example": {
                "street": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip_code": "10001",
                "country": "US"
            }
        }

class Location(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    
    class Config:
        schema_extra = {
            "example": {
                "latitude": 40.7128,
                "longitude": -74.0060
            }
        }

class MenuItem(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: Decimal = Field(..., decimal_places=2)
    category: str
    available: bool = True
    preparation_time: int = Field(..., description="Preparation time in minutes")
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Margherita Pizza",
                "description": "Classic pizza with tomato sauce, mozzarella, and basil",
                "price": 12.99,
                "category": "Pizza",
                "available": True,
                "preparation_time": 20
            }
        }

class OrderItem(BaseModel):
    menu_item_id: int
    quantity: int = Field(..., gt=0)
    special_instructions: Optional[str] = None
    unit_price: Decimal = Field(..., decimal_places=2)
    
    class Config:
        schema_extra = {
            "example": {
                "menu_item_id": 1,
                "quantity": 2,
                "special_instructions": "Extra cheese",
                "unit_price": 12.99
            }
        }

class Restaurant(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    address: Address
    location: Location
    phone: str
    email: str
    cuisine_type: str
    rating: Optional[float] = Field(None, ge=0, le=5)
    is_active: bool = True
    operating_hours: Optional[Dict[str, str]] = None
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Mario's Pizza",
                "description": "Authentic Italian pizza",
                "phone": "+1234567890",
                "email": "info@mariospizza.com",
                "cuisine_type": "Italian",
                "rating": 4.5,
                "is_active": True,
                "operating_hours": {
                    "monday": "10:00-22:00",
                    "tuesday": "10:00-22:00",
                    "wednesday": "10:00-22:00",
                    "thursday": "10:00-22:00",
                    "friday": "10:00-23:00",
                    "saturday": "10:00-23:00",
                    "sunday": "11:00-21:00"
                }
            }
        }

class Order(BaseModel):
    id: Optional[int] = None
    customer_id: int
    restaurant_id: int
    items: List[OrderItem]
    delivery_address: Address
    total_amount: Decimal = Field(..., decimal_places=2)
    status: OrderStatus = OrderStatus.PENDING
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    estimated_delivery_time: Optional[datetime] = None
    special_instructions: Optional[str] = None
    
    @validator('total_amount')
    def validate_total_amount(cls, v):
        if v <= 0:
            raise ValueError('Total amount must be positive')
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "customer_id": 1,
                "restaurant_id": 1,
                "items": [
                    {
                        "menu_item_id": 1,
                        "quantity": 2,
                        "unit_price": 12.99
                    }
                ],
                "total_amount": 25.98,
                "special_instructions": "Please ring the doorbell"
            }
        }

class Delivery(BaseModel):
    id: Optional[int] = None
    order_id: int
    driver_id: Optional[int] = None
    pickup_address: Address
    delivery_address: Address
    pickup_location: Location
    delivery_location: Location
    status: DeliveryStatus = DeliveryStatus.PENDING
    created_at: Optional[datetime] = None
    pickup_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None
    estimated_delivery_time: Optional[datetime] = None
    
    class Config:
        schema_extra = {
            "example": {
                "order_id": 1,
                "driver_id": 1,
                "status": "PENDING"
            }
        }

class Payment(BaseModel):
    id: Optional[int] = None
    order_id: int
    amount: Decimal = Field(..., decimal_places=2)
    currency: str = "USD"
    payment_method: str
    payment_status: PaymentStatus = PaymentStatus.PENDING
    transaction_id: Optional[str] = None
    created_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None
    
    class Config:
        schema_extra = {
            "example": {
                "order_id": 1,
                "amount": 25.98,
                "currency": "USD",
                "payment_method": "credit_card",
                "payment_status": "PENDING"
            }
        }

class Notification(BaseModel):
    id: Optional[int] = None
    recipient_id: int
    recipient_type: str = "customer"  # customer, restaurant, driver
    type: NotificationType
    title: str
    message: str
    data: Optional[Dict[str, Any]] = None
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    
    class Config:
        schema_extra = {
            "example": {
                "recipient_id": 1,
                "recipient_type": "customer",
                "type": "ORDER_CONFIRMATION",
                "title": "Order Confirmed",
                "message": "Your order has been confirmed and is being prepared.",
                "data": {"order_id": 1}
            }
        }

# Request/Response Models
class CreateOrderRequest(BaseModel):
    customer_id: int
    restaurant_id: int
    items: List[OrderItem]
    delivery_address: Address
    special_instructions: Optional[str] = None

class UpdateOrderStatusRequest(BaseModel):
    status: OrderStatus
    estimated_delivery_time: Optional[datetime] = None

class CreateDeliveryRequest(BaseModel):
    order_id: int
    pickup_address: Address
    delivery_address: Address
    pickup_location: Location
    delivery_location: Location

class AssignDriverRequest(BaseModel):
    driver_id: int

class CreatePaymentRequest(BaseModel):
    order_id: int
    amount: Decimal
    payment_method: str
    currency: str = "USD"

class ProcessPaymentRequest(BaseModel):
    payment_id: int
    transaction_id: str

class SendNotificationRequest(BaseModel):
    recipient_id: int
    recipient_type: str
    type: NotificationType
    title: str
    message: str
    data: Optional[Dict[str, Any]] = None

# Health Check Model
class HealthCheck(BaseModel):
    service: str
    status: str = "healthy"
    timestamp: datetime
    version: str = "1.0.0"
    dependencies: Optional[Dict[str, str]] = None