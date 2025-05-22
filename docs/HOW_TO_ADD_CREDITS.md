# LogoCreator应用：如何给用户增加生成额度指南

## 1. 额度系统工作原理

LogoCreator应用使用Upstash Redis进行用户额度管理，但有两种不同的键存储格式：

- **脚本使用的键格式**：`logocreator:${userId}:rlflw`
- **@upstash/ratelimit库使用的键格式**：`ratelimit:logocreator:${userId}`

系统优先使用@upstash/ratelimit库的数据，这是前端显示和生成API检查时使用的数据。

## 2. 给用户增加生成额度的方法

### 方法一：使用fix-ratelimit.js脚本（推荐）

这是最可靠的方法，直接修改@upstash/ratelimit库使用的数据：

```bash
node scripts/fix-ratelimit.js <用户ID> <剩余额度>

# 例如，给用户增加50次额度：
node scripts/fix-ratelimit.js user_abc123 50
```

### 方法二：使用add-credits.js + fix-credits-all.js脚本组合

这种方法先增加额度，然后尝试同步两个键格式：

```bash
# 步骤1：增加额度
node scripts/add-credits.js <用户ID> <增加数量>

# 步骤2：修复显示问题
node scripts/fix-credits-all.js <用户ID>
```

### 方法三：使用API重置额度

在用户已登录的情况下，可以通过API重置额度：

```
GET /api/user-credits?resetCredits=true
```

## 3. 测试额度是否增加成功

### 测试脚本

可以使用以下脚本查看用户当前额度状态：

```bash
# 查看完整调试信息
node scripts/check-user-credits-debug.js <用户ID>

# 查看简洁信息
node scripts/check-user-credits.js <用户ID>
```

### API测试

如果用户已登录，可以通过API查询：

```bash
curl "http://localhost:3000/api/user-credits"
```

## 4. 常见问题与解决方案

### 问题1：增加额度后前端仍显示0次

**原因**：`add-credits.js`只修改了`logocreator:${userId}:rlflw`键，而没有更新`ratelimit:logocreator:${userId}`键。

**解决方案**：使用`fix-ratelimit.js`脚本直接设置正确的额度：

```bash
node scripts/fix-ratelimit.js <用户ID> <剩余额度>
```

### 问题2：无法通过API重置用户额度

**原因**：用户权限不足或未正确登录。

**解决方案**：
- 确保用户已登录
- 使用`fix-ratelimit.js`脚本直接修改

### 问题3：Clerk用户元数据同步失败

**原因**：可能是Clerk API配置问题或用户不存在。

**解决方案**：
- 检查Clerk配置
- 直接使用`fix-ratelimit.js`修改Redis数据

## 5. 代码结构和注意事项

### 相关文件

- `/app/api/user-credits/route.ts`：用户额度API
- `/app/api/generate-logo/route.ts`：Logo生成API，包含额度检查逻辑
- `/scripts/add-credits.js`：增加用户额度脚本（旧方法）
- `/scripts/fix-ratelimit.js`：直接修复额度脚本（推荐）
- `/scripts/check-user-credits-debug.js`：调试用户额度状态

### 重要注意事项

1. **优先使用fix-ratelimit.js**：此脚本直接修改前端和API使用的键格式

2. **限制值设置**：系统默认限制为每60天3次，在修改用户额度时注意不要修改limit值（保持为3）

3. **批量操作**：可以创建循环脚本处理多个用户

4. **环境变量**：确保.env.local中包含正确的Upstash Redis凭证：
   ```
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

5. **权限控制**：API路由中有权限检查，脚本方式更适合管理员使用

## 6. 建议改进

1. 修改`add-credits.js`脚本，使其同时更新两种键格式

2. 在前端添加管理员界面，方便直接管理用户额度

3. 创建定期备份Redis数据的脚本，防止数据丢失

通过以上方法，可以可靠地管理用户的Logo生成额度，确保系统正常运行。 