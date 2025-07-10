# 食品配送平台微服务架构

这是一个基于微服务架构的食品配送平台，包含订单服务、餐厅服务、厨房服务、配送服务、会计服务和通知服务。

## 🏗️ 架构概览

### 系统组件
- **API Gateway**: 路由所有客户端请求到对应的微服务
- **订单服务**: 处理订单的创建、更新和管理
- **餐厅服务**: 管理餐厅信息和菜单
- **厨房服务**: 处理订单的制作流程
- **配送服务**: 管理订单的配送
- **会计服务**: 处理支付和财务（集成Stripe）
- **通知服务**: 发送短信和邮件通知（集成Twilio和SES）
- **餐厅Web界面**: 餐厅管理前端应用

### 技术栈
- **后端**: Spring Boot + Spring Cloud Gateway
- **数据库**: PostgreSQL (每个服务独立数据库)
- **服务发现**: Netflix Eureka
- **前端**: React + Ant Design
- **容器化**: Docker + Docker Compose
- **第三方集成**: Stripe (支付), Twilio (短信), Amazon SES (邮件)

## 🚀 快速开始

### 环境要求
- Docker 20.0+
- Docker Compose 2.0+
- JDK 11+ (本地开发)
- Node.js 16+ (前端开发)

### 1. 克隆项目
```bash
git clone https://github.com/Joseph19820124/msa-9IN1.git
cd msa-9IN1
```

### 2. 配置环境变量
创建 `.env` 文件：
```bash
# Stripe配置
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Twilio配置
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_PHONE=+1234567890

# AWS SES配置
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@fooddelivery.com
```

### 3. 构建和启动服务
```bash
# 构建所有服务
docker-compose build

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

### 4. 验证服务
等待所有服务启动完成（约2-3分钟），然后访问：

- **API Gateway**: http://localhost:8080
- **Eureka控制台**: http://localhost:8761
- **餐厅Web界面**: http://localhost:3000
- **订单服务**: http://localhost:8081/api/orders
- **会计服务**: http://localhost:8085/api/accounting
- **通知服务**: http://localhost:8086/api/notifications

## 📚 API 文档

### 订单服务 API
```bash
# 创建订单
POST /api/orders
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

# 获取订单列表
GET /api/orders

# 更新订单状态
PUT /api/orders/{orderId}/status?status=CONFIRMED
```

### 会计服务 API
```bash
# 创建支付
POST /api/accounting/payments
{
  "orderId": "123",
  "customerId": "customer123",
  "amount": 35.50,
  "currency": "USD",
  "method": "CREDIT_CARD"
}

# 确认支付
POST /api/accounting/payments/{paymentId}/confirm

# 退款
POST /api/accounting/payments/{paymentId}/refund?amount=35.50
```

### 通知服务 API
```bash
# 发送短信
POST /api/notifications/sms
{
  "phoneNumber": "+1234567890",
  "content": "您的订单已确认",
  "orderId": "123",
  "customerId": "customer123"
}

# 发送邮件
POST /api/notifications/email
{
  "email": "user@example.com",
  "subject": "订单确认",
  "content": "您的订单已确认，正在准备中",
  "orderId": "123",
  "customerId": "customer123"
}
```

## 🔧 开发指南

### 本地开发环境搭建

1. **启动基础服务**（数据库、Eureka）：
```bash
docker-compose up -d eureka-server order-db restaurant-db kitchen-db delivery-db accounting-db notification-db
```

2. **本地运行微服务**：
```bash
# 进入服务目录
cd order-service

# 编译并运行
./mvnw spring-boot:run
```

3. **前端开发**：
```bash
cd restaurant-web-ui
npm install
npm start
```

## 🏛️ 架构图

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Courier   │    │  Consumer   │    │ Restaurant  │
│   Mobile    │    │   Mobile    │    │   Web UI    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                   ┌──────▼──────┐
                   │ API Gateway │
                   └──────┬──────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ Order   │       │Restaurant│       │Kitchen  │
   │Service  │       │Service   │       │Service  │
   └─────────┘       └─────────┘       └─────────┘
        │                                    │
   ┌────▼────┐                          ┌────▼────┐
   │Delivery │                          │Accounting│
   │Service  │                          │Service   │
   └─────────┘                          └─────────┘
                                             │
                                        ┌────▼────┐
                                        │Notification│
                                        │Service     │
                                        └────────────┘
```

## 📦 许可证

MIT License

## 🤝 贡献

欢迎提交 Pull Request 和 Issue！