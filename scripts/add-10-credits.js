// 为用户增加10次Logo生成额度的脚本
// 使用方法: node scripts/add-10-credits.js <用户ID>

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// 尝试从.env文件加载配置
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    console.log('从 .env 文件加载配置...');
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
    console.log('未找到 .env 文件，将使用环境变量或脚本中的默认值');
  }
} catch (error) {
  console.error('加载 .env 文件失败:', error.message);
}

// 请在运行脚本前添加您的Upstash Redis凭证
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || ""; // 填入您的Upstash Redis REST URL
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ""; // 填入您的Upstash Redis REST Token

// 设置要增加的固定额度数量
const CREDITS_TO_ADD = 10;

// 检查所需参数
if (process.argv.length < 3) {
  console.error('用法: node scripts/add-10-credits.js <用户ID>');
  process.exit(1);
}

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.error('错误: 请设置Upstash Redis凭证!');
  console.error('您可以通过以下方式设置凭证:');
  console.error('1. 在脚本目录创建 .env 文件并添加以下内容:');
  console.error('   UPSTASH_REDIS_REST_URL=您的Upstash_REST_URL');
  console.error('   UPSTASH_REDIS_REST_TOKEN=您的Upstash_REST_TOKEN');
  console.error('2. 设置环境变量 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN');
  console.error('3. 直接在脚本中填入这些值');
  process.exit(1);
}

const userId = process.argv[2];

// 初始化Redis客户端
const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

async function add10Credits() {
  try {
    // 构建限流键名（与应用程序中使用的格式相同）
    const rateLimitKey = `logocreator:${userId}:rlflw`;
    
    // 获取当前限流值
    const currentLimitData = await redis.get(rateLimitKey);
    
    if (!currentLimitData) {
      console.log('未找到该用户的限流记录，将创建新记录并添加10次额度');
      
      // 创建新的限流记录，设置为允许用户有10次使用机会
      // 格式：[时间窗口开始时间戳, 已使用次数]
      const newLimitData = [Date.now(), -CREDITS_TO_ADD]; // 负值表示用户还有额度可用
      await redis.set(rateLimitKey, JSON.stringify(newLimitData));
      
      console.log(`成功为用户 ${userId} 添加了 ${CREDITS_TO_ADD} 次生成额度`);
      return;
    }
    
    // 解析当前限流数据
    const [timestamp, currentUsage] = JSON.parse(currentLimitData);
    
    // 计算新的使用次数（减少使用次数相当于增加额度）
    const newUsage = currentUsage - CREDITS_TO_ADD;
    
    // 更新限流数据
    await redis.set(rateLimitKey, JSON.stringify([timestamp, newUsage]));
    
    console.log(`成功为用户 ${userId} 添加了 ${CREDITS_TO_ADD} 次生成额度`);
    console.log(`当前状态: 时间窗口开始于 ${new Date(timestamp).toLocaleString()}, 剩余额度: ${-newUsage} 次`);
    
  } catch (error) {
    console.error('增加额度时出错:', error);
    process.exit(1);
  }
}

add10Credits(); 