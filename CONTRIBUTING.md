# 贡献指南

感谢您对食品配送平台微服务项目的关注！我们欢迎所有形式的贡献。

## 如何贡献

### 报告问题

如果您发现了bug或有功能建议，请：

1. 检查是否已存在相关的issue
2. 如果没有，请创建新的issue
3. 提供尽可能详细的信息：
   - 问题描述
   - 重现步骤
   - 期望结果
   - 实际结果
   - 环境信息（操作系统、Java版本、Docker版本等）

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/msa-9IN1.git
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行开发**
   - 遵循代码规范
   - 添加适当的测试
   - 更新相关文档

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **推送到远程仓库**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 提供清晰的PR描述
   - 引用相关的issue
   - 确保所有检查通过

## 代码规范

### Java代码
- 遵循Google Java Style Guide
- 使用有意义的变量和方法名
- 添加适当的注释
- 保持方法简洁（一般不超过30行）

### JavaScript/React代码
- 使用ESLint和Prettier
- 使用函数式组件和Hooks
- 保持组件单一职责
- 添加PropTypes或TypeScript类型

### 提交信息格式

使用Conventional Commits格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

类型包括：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式修改
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat(order): add order cancellation feature

Allow customers to cancel orders within 5 minutes of placement.
This includes updating the order status and sending notifications.

Closes #123
```

## 开发环境设置

1. **系统要求**
   - Java 11+
   - Node.js 16+
   - Docker 20.0+
   - Maven 3.6+

2. **安装依赖**
   ```bash
   # 后端依赖（在每个服务目录下）
   ./mvnw install
   
   # 前端依赖
   cd restaurant-web-ui
   npm install
   ```

3. **启动开发环境**
   ```bash
   # 启动基础服务
   ./scripts/start-dev.sh
   
   # 启动特定微服务
   cd order-service
   ./mvnw spring-boot:run
   ```

## 测试

### 运行测试

```bash
# Java单元测试
./mvnw test

# 前端测试
npm test

# 集成测试
./scripts/run-integration-tests.sh
```

### 编写测试

- 为新功能添加单元测试
- 为API端点添加集成测试
- 为前端组件添加组件测试
- 保持测试覆盖率在80%以上

## 文档

### 更新文档

- API变更需要更新`docs/API.md`
- 新功能需要更新README和相关文档
- 架构变更需要更新架构图

### 文档规范

- 使用Markdown格式
- 提供代码示例
- 包含屏幕截图（如适用）
- 保持文档同步更新

## 发布流程

1. **版本规划**
   - 在issue中讨论新版本内容
   - 创建里程碑
   - 分配任务

2. **代码冻结**
   - 完成所有功能开发
   - 通过所有测试
   - 更新文档

3. **发布准备**
   - 更新版本号
   - 更新CHANGELOG.md
   - 创建发布分支

4. **发布**
   - 创建Git标签
   - 发布到Docker Hub
   - 更新GitHub Release

## 社区准则

### 行为准则

- 尊重所有贡献者
- 保持友好和专业的态度
- 欢迎新贡献者
- 提供建设性的反馈

### 沟通渠道

- GitHub Issues: 问题报告和功能请求
- GitHub Discussions: 技术讨论和问答
- Pull Request: 代码审查和讨论

## 获得帮助

如果您需要帮助，可以：

1. 查看现有文档
2. 搜索已有的issues
3. 创建新的issue询问
4. 参与GitHub Discussions

## 认可贡献者

我们感谢所有的贡献者！贡献者将被添加到项目的贡献者列表中。

## 许可证

通过贡献代码，您同意您的贡献将在MIT许可证下发布。

---

再次感谢您的贡献！🎉