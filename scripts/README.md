# LogoCraftAI 管理脚本工具

这个目录包含了用于管理LogoCraftAI应用的实用脚本工具，主要用于管理用户额度和系统维护。

## 用户额度管理脚本

以下脚本用于管理用户的Logo生成额度：

1. **add-10-credits.js** - 为用户添加10次Logo生成额度
2. **add-10-credits-from-env-local.js** - 同上，但从项目根目录的.env.local读取凭证
3. **add-credits.js** - 为用户添加自定义数量的Logo生成额度
4. **check-user-credits.js** - 查询用户当前的额度状态
5. **check-user-credits-fixed.js** - 改进版查询脚本，从项目根目录的.env.local读取凭证
6. **reset-user-limits.js** - 重置用户的额度限制，恢复到默认状态

## 使用指南

详细的使用说明请参见 [USAGE_GUIDE.md](./USAGE_GUIDE.md)。

## 环境要求

- Node.js 14+
- Upstash Redis账户和凭证
- 项目根目录的.env.local或.env文件中配置的环境变量

## 安全说明

这些脚本包含对用户数据和系统设置的操作，应当仅由管理员使用，并妥善保管相关凭证。

## 示例

为用户添加10次额度：
```bash
node scripts/add-10-credits-from-env-local.js user_2xLtrfmlFE6TmJJqrukPljlmKwS
```

查询用户当前额度：
```bash
node scripts/check-user-credits-fixed.js user_2xLtrfmlFE6TmJJqrukPljlmKwS
```

重置用户额度：
```bash
node scripts/reset-user-limits.js user_2xLtrfmlFE6TmJJqrukPljlmKwS
``` 