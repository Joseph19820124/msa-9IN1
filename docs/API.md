# API 文档

## 订单服务 API (Port: 8081)

### 创建订单
```http
POST /api/orders
Content-Type: application/json

{
  "customerId": "customer123",
  "restaurantId": "restaurant456",
  "totalAmount": 35.50,
  "items": [
    {
      "itemId": "item1",
      "itemName": "汉堡",
      "quantity": 2,
      "price": 15.99
    }
  ],
  "deliveryAddress": "123 Main St"
}
```

### 获取订单列表
```http
GET /api/orders
```

### 获取特定订单
```http
GET /api/orders/{orderId}
```

### 更新订单状态
```http
PUT /api/orders/{orderId}/status?status=CONFIRMED
```

## 会计服务 API (Port: 8085)

### 创建支付
```http
POST /api/accounting/payments
Content-Type: application/json

{
  "orderId": "123",
  "customerId": "customer123",
  "amount": 35.50,
  "currency": "USD",
  "method": "CREDIT_CARD"
}
```

### 确认支付
```http
POST /api/accounting/payments/{paymentId}/confirm
```

### 退款
```http
POST /api/accounting/payments/{paymentId}/refund?amount=35.50
```

## 通知服务 API (Port: 8086)

### 发送短信
```http
POST /api/notifications/sms
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "content": "您的订单已确认",
  "orderId": "123",
  "customerId": "customer123"
}
```

### 发送邮件
```http
POST /api/notifications/email
Content-Type: application/json

{
  "email": "user@example.com",
  "subject": "订单确认",
  "content": "您的订单已确认，正在准备中",
  "orderId": "123",
  "customerId": "customer123"
}
```