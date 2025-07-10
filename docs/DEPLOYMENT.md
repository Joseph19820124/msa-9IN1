# 部署指南

## 本地开发环境

### 1. 环境要求
- Docker 20.0+
- Docker Compose 2.0+
- JDK 11+ (本地开发)
- Node.js 16+ (前端开发)
- Maven 3.6+

### 2. 快速启动

```bash
# 克隆项目
git clone https://github.com/Joseph19820124/msa-9IN1.git
cd msa-9IN1

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入真实的API密钥

# 构建所有服务
chmod +x scripts/build-all.sh
./scripts/build-all.sh

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

### 3. 本地开发

```bash
# 启动基础服务（数据库、Eureka）
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh

# 启动单个微服务（以订单服务为例）
cd order-service
./mvnw spring-boot:run

# 启动前端开发服务器
cd restaurant-web-ui
npm install
npm start
```

## 生产环境部署

### 1. Docker Compose 部署

```bash
# 生产环境配置
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Kubernetes 部署

```bash
# 创建命名空间
kubectl create namespace food-delivery

# 部署服务
kubectl apply -f k8s/ -n food-delivery

# 查看部署状态
kubectl get pods -n food-delivery
```

### 3. 环境变量配置

生产环境需要配置以下环境变量：

```bash
# Stripe配置
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio配置
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_PHONE=...

# AWS SES配置
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...
AWS_REGION=...
SES_FROM_EMAIL=...
```

## 监控和日志

### 1. 健康检查

```bash
# 检查所有服务健康状态
curl http://localhost:8081/actuator/health  # 订单服务
curl http://localhost:8085/actuator/health  # 会计服务
curl http://localhost:8086/actuator/health  # 通知服务
```

### 2. 日志查看

```bash
# 查看服务日志
docker-compose logs -f order-service
docker-compose logs -f api-gateway

# 查看所有服务日志
docker-compose logs
```

### 3. 性能监控

- Eureka控制台: http://localhost:8761
- API Gateway: http://localhost:8080
- 餐厅管理界面: http://localhost:3000

## 扩容和负载均衡

### 1. 水平扩容

```bash
# 扩容订单服务到3个实例
docker-compose up -d --scale order-service=3

# 扩容会计服务
docker-compose up -d --scale accounting-service=2
```

### 2. 负载均衡

API Gateway自动提供负载均衡功能，通过Eureka服务发现进行路由。

## 故障排除

### 1. 常见问题

- **服务无法启动**: 检查端口是否被占用
- **数据库连接失败**: 确认数据库容器已启动
- **API Gateway 502错误**: 检查目标服务是否注册到Eureka

### 2. 日志分析

```bash
# 查看错误日志
docker-compose logs | grep ERROR

# 查看特定服务的详细日志
docker-compose logs --tail=100 order-service
```