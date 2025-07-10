# 开发指南

## 项目结构

```
food-delivery-microservices/
├── api-gateway/              # API网关
├── order-service/            # 订单服务
├── restaurant-service/       # 餐厅服务
├── kitchen-service/          # 厨房服务
├── delivery-service/         # 配送服务
├── accounting-service/       # 会计服务（Stripe集成）
├── notification-service/     # 通知服务（Twilio + SES）
├── restaurant-web-ui/        # 餐厅管理前端
├── scripts/                  # 构建和部署脚本
├── docs/                     # 文档
└── docker-compose.yml        # Docker编排配置
```

## 技术栈

### 后端
- **框架**: Spring Boot 2.7.0
- **服务发现**: Netflix Eureka
- **API网关**: Spring Cloud Gateway
- **数据库**: PostgreSQL
- **ORM**: Spring Data JPA
- **容器化**: Docker

### 前端
- **框架**: React 18
- **UI库**: Ant Design
- **路由**: React Router
- **HTTP客户端**: Axios

### 第三方集成
- **支付**: Stripe
- **短信**: Twilio
- **邮件**: Amazon SES

## 开发环境设置

### 1. 克隆项目

```bash
git clone https://github.com/Joseph19820124/msa-9IN1.git
cd msa-9IN1
```

### 2. 环境变量配置

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的API密钥。

### 3. 启动开发环境

```bash
# 启动基础设施（数据库、Eureka）
./scripts/start-dev.sh

# 本地启动微服务
cd order-service
./mvnw spring-boot:run

# 另开终端启动前端
cd restaurant-web-ui
npm install
npm start
```

## 开发规范

### 1. 代码规范

- **Java**: 遵循Google Java Style Guide
- **JavaScript**: 使用ESLint + Prettier
- **数据库**: 使用驼峰命名转下划线

### 2. API设计规范

- **REST**: 遵循RESTful设计原则
- **路径**: `/api/{service}/{resource}`
- **状态码**: 正确使用HTTP状态码
- **错误处理**: 统一错误响应格式

### 3. 提交规范

使用Conventional Commits格式：

```
feat: 添加订单支付功能
fix: 修复订单状态更新问题
docs: 更新API文档
refactor: 重构通知服务
```

## 测试

### 1. 单元测试

```bash
# Java服务测试
cd order-service
./mvnw test

# 前端测试
cd restaurant-web-ui
npm test
```

### 2. 集成测试

```bash
# 启动测试环境
docker-compose -f docker-compose.test.yml up -d

# 运行集成测试
./scripts/run-integration-tests.sh
```

### 3. API测试

使用Postman或curl测试API端点：

```bash
# 创建订单
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer123",
    "restaurantId": "restaurant456",
    "totalAmount": 35.50,
    "items": [...]
  }'
```

## 新增服务指南

### 1. 创建新的微服务

```bash
# 1. 创建服务目录
mkdir new-service
cd new-service

# 2. 复制模板结构
cp -r ../order-service/* .

# 3. 修改配置
# - 更新pom.xml中的artifactId
# - 修改application.yml中的端口和数据库
# - 更新Docker配置
```

### 2. 添加到API Gateway

在`api-gateway/src/main/java/com/fooddelivery/gateway/config/GatewayConfig.java`中添加路由：

```java
.route("new-service", r -> r.path("/api/newservice/**")
        .uri("lb://new-service"))
```

### 3. 更新Docker Compose

在`docker-compose.yml`中添加新服务配置。

## 数据库管理

### 1. 数据库迁移

每个服务使用独立的数据库，通过JPA自动创建表结构。

### 2. 数据初始化

在`src/main/resources/data.sql`中添加初始数据。

### 3. 数据库监控

```bash
# 连接到数据库
docker exec -it orderdb psql -U admin -d orderdb

# 查看表结构
\dt
\d orders
```

## 部署和发布

### 1. 构建镜像

```bash
# 构建所有服务
./scripts/build-all.sh

# 构建Docker镜像
docker-compose build
```

### 2. 版本管理

- 使用语义化版本号（Semantic Versioning）
- 每次发布打标签
- 维护CHANGELOG.md

### 3. CI/CD

推荐使用GitHub Actions进行自动化构建和部署。

## 监控和调试

### 1. 日志管理

- 使用统一的日志格式
- 配置适当的日志级别
- 使用结构化日志

### 2. 性能监控

- 使用Spring Boot Actuator
- 监控关键指标（响应时间、错误率等）
- 配置告警机制

### 3. 调试技巧

```bash
# 查看服务注册情况
curl http://localhost:8761/eureka/apps

# 检查服务健康状态
curl http://localhost:8081/actuator/health

# 查看配置信息
curl http://localhost:8081/actuator/configprops
```