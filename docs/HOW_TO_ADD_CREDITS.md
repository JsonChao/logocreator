# LogoCreator应用：如何给用户增加生成额度指南

## 1. 额度系统工作原理

LogoCreator应用使用Upstash Redis进行用户额度管理，但有两种不同的键存储格式：

- **脚本使用的键格式**：`logocreator:${userId}:rlflw`
- **@upstash/ratelimit库使用的键格式**：`ratelimit:logocreator:${userId}`

系统优先使用@upstash/ratelimit库的数据，这是前端显示和生成API检查时使用的数据。

## 2. 给用户增加生成额度的方法

### 方法一：使用fix-redis-keys.js脚本（最推荐）

这是最可靠的方法，直接修复两种Redis键格式：

```bash
node scripts/fix-redis-keys.js <用户ID>

# 例如：
node scripts/fix-redis-keys.js user_abc123
```

该脚本会自动同步两种格式的键，确保它们有相同的额度值。

### 方法二：使用fix-ratelimit.js脚本（推荐）

这是较可靠的方法，直接修改@upstash/ratelimit库使用的数据：

```bash
node scripts/fix-ratelimit.js <用户ID> <剩余额度>

# 例如，给用户设置50次额度：
node scripts/fix-ratelimit.js user_abc123 50
```

### 方法三：使用add-credits.js + fix-credits-all.js脚本组合

这种方法先增加额度，然后尝试同步两个键格式：

```bash
# 步骤1：增加额度
node scripts/add-credits.js <用户ID> <增加数量>

# 步骤2：修复显示问题
node scripts/fix-credits-all.js <用户ID>
```

### 方法四：使用API重置额度

在用户已登录的情况下，可以通过API重置额度：

```
GET /api/user-credits?resetCredits=true
```

## 3. 测试额度是否增加成功

### 测试脚本

可以使用以下脚本检查用户的额度状态：

```bash
# 检查用户额度
node scripts/check-user-credits.js <用户ID>

# 详细检查用户额度（包括两种键格式）
node scripts/check-user-credits-debug.js <用户ID>
```

### 通过API测试

可以通过以下API端点查询用户额度：

```
GET /api/user-credits?userId=<用户ID>&forceRefresh=true
```

## 4. 常见问题和解决方案

### 显示额度与实际额度不一致

这是因为两种不同的Redis键格式导致的不一致：

1. `/api/user-credits` 使用正确的额度
2. 但 `/api/generate-logo` 可能显示错误的额度

**解决方案：**
- 使用 `fix-redis-keys.js` 脚本同步两种键格式
- 或重新部署API服务，确保全局ratelimit对象正确初始化

### 增加额度后仍然显示不足

这可能是由于缓存或并发访问导致的问题。

**解决方案：**
- 在用户额度API请求中添加 `forceRefresh=true` 参数
- 确保使用最新版本的API代码，包含额度同步逻辑
- 等待几分钟让系统缓存刷新

### API返回错误

如果API返回错误，检查以下可能的原因：

- Upstash Redis连接问题
- 用户ID格式不正确
- 额度格式不正确（必须是整数）

## 5. 最佳实践

- **定期备份**：定期备份Redis数据，防止数据丢失
- **监控额度**：定期检查用户额度状态，确保系统正常运行
- **版本控制**：保持脚本和API代码的版本一致
- **日志记录**：启用详细日志，方便排查问题
- **测试验证**：修改额度后，测试生成功能确保正常工作

## 6. 额度系统架构

当前系统使用Upstash Redis作为额度存储，@upstash/ratelimit库作为额度限制实现。系统架构如下：

1. **用户认证**：使用Clerk进行用户认证
2. **额度检查**：在Logo生成API中检查用户额度
3. **额度扣减**：生成Logo成功后扣减用户额度
4. **额度展示**：在用户界面显示剩余额度

未来可考虑改进：
- 统一Redis键格式
- 实现更灵活的额度管理（如不同用户组不同额度）
- 添加额度自动恢复机制

通过以上方法，可以可靠地管理用户的Logo生成额度，确保系统正常运行。 