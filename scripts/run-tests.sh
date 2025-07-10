#!/bin/bash

# 运行所有测试的脚本

echo "Running all tests..."

# 设置退出标志
TEST_FAILED=0

# 运行Java服务测试
echo "\n=== Running Java Service Tests ==="

services=("api-gateway" "order-service" "restaurant-service" "kitchen-service" "delivery-service" "accounting-service" "notification-service")

for service in "${services[@]}"; do
    echo "\nTesting $service..."
    cd $service
    
    # 检查是否有Maven包装器
    if [ -f "./mvnw" ]; then
        ./mvnw test
        if [ $? -ne 0 ]; then
            echo "❌ Tests failed for $service"
            TEST_FAILED=1
        else
            echo "✅ Tests passed for $service"
        fi
    else
        echo "⚠️  No Maven wrapper found for $service"
    fi
    
    cd ..
done

# 运行前端测试
echo "\n=== Running Frontend Tests ==="
cd restaurant-web-ui

if [ -f "package.json" ]; then
    # 检查是否已安装依赖
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    npm test -- --coverage --watchAll=false
    if [ $? -ne 0 ]; then
        echo "❌ Frontend tests failed"
        TEST_FAILED=1
    else
        echo "✅ Frontend tests passed"
    fi
else
    echo "⚠️  No package.json found for frontend"
fi

cd ..

# 运行代码质量检查
echo "\n=== Running Code Quality Checks ==="

# 检查Java代码格式（如果有spotless插件）
for service in "${services[@]}"; do
    cd $service
    if [ -f "./mvnw" ]; then
        echo "Checking code format for $service..."
        ./mvnw spotless:check 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "✅ Code format check passed for $service"
        fi
    fi
    cd ..
done

# 检查前端代码格式
cd restaurant-web-ui
if [ -f "package.json" ] && npm list eslint >/dev/null 2>&1; then
    echo "Running ESLint for frontend..."
    npm run lint 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ ESLint check passed for frontend"
    fi
fi
cd ..

# 输出测试结果
echo "\n=== Test Summary ==="
if [ $TEST_FAILED -eq 0 ]; then
    echo "🎉 All tests passed successfully!"
    exit 0
else
    echo "❌ Some tests failed. Please check the output above."
    exit 1
fi