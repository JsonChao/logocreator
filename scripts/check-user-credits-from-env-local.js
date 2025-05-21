// 从.env.local读取凭证并查看用户当前Logo生成额度状态的脚本
// 使用方法: node scripts/check-user-credits-from-env-local.js <用户ID>

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// 尝试从.env.local文件加载配置
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('从 .env.local 文件加载配置...');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = envContent.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) {
          acc[key.trim()] = value.trim();
        }
        return acc;
      }, {});
    
    // 设置环境变量
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
    
    console.log('已成功加载环境变量配置');
  } else {
    console.log('未找到 .env.local 文件');
    process.exit(1);
  }
} catch (error) {
  console.error('加载 .env.local 文件失败:', error.message);
  process.exit(1);
}

// 从环境变量获取Upstash Redis凭证
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// 检查所需参数
if (process.argv.length < 3) {
  console.error('用法: node scripts/check-user-credits-from-env-local.js <用户ID>');
  process.exit(1);
}

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.error('错误: 在.env.local中未找到Upstash Redis凭证!');
  console.error('请确保.env.local文件包含以下变量:');
  console.error('UPSTASH_REDIS_REST_URL=您的Upstash_REST_URL');
  console.error('UPSTASH_REDIS_REST_TOKEN=您的Upstash_REST_TOKEN');
  process.exit(1);
}

const userId = process.argv[2];

// 初始化Redis客户端
const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

async function checkUserCredits() {
  try {
    // 构建限流键名（与应用程序中使用的格式相同）
    const rateLimitKey = `logocreator:${userId}:rlflw`;
    
    // 获取当前限流值
    const currentLimitData = await redis.get(rateLimitKey);
    
    if (!currentLimitData) {
      console.log(`未找到用户 ${userId} 的限流记录。`);
      console.log('这意味着用户尚未使用过Logo生成功能，或者记录已过期。');
      console.log('当用户首次使用Logo生成功能时，系统将自动创建新记录，默认拥有3次额度。');
      return;
    }
    
    // 解析当前限流数据
    const [timestamp, currentUsage] = JSON.parse(currentLimitData);
    const timestampDate = new Date(timestamp);
    
    console.log(`用户 ${userId} 的额度状态:`);
    console.log(`时间窗口开始于: ${timestampDate.toLocaleString()}`);
    
    // 计算剩余额度
    // 在Upstash Ratelimit系统中，currentUsage为正表示已使用次数，负值表示剩余可用额度
    if (currentUsage < 0) {
      // 负值表示预先设置的额度（通过脚本添加的）
      console.log(`当前状态: 用户还有 ${-currentUsage} 次生成额度可用`);
    } else {
      // 正值表示已使用次数，默认限制是3次
      const defaultLimit = 3; // 系统默认的额度限制
      const remainingCredits = defaultLimit - currentUsage;
      
      if (remainingCredits > 0) {
        console.log(`当前状态: 用户还有 ${remainingCredits} 次生成额度可用（基于默认额度）`);
      } else {
        console.log(`当前状态: 用户已用完所有生成额度（已使用 ${currentUsage} 次）`);
      }
    }
    
  } catch (error) {
    console.error('查询用户额度时出错:', error);
    process.exit(1);
  }
}

checkUserCredits(); 