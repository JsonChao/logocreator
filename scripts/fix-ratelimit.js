// 直接修复用户的@upstash/ratelimit数据的脚本
// 使用方法: node scripts/fix-ratelimit.js <用户ID> <剩余额度>

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// 检查所需参数
if (process.argv.length < 4) {
  console.error('用法: node scripts/fix-ratelimit.js <用户ID> <剩余额度>');
  console.error('例如: node scripts/fix-ratelimit.js user_123456 10  # 设置剩余额度为10次');
  process.exit(1);
}

const userId = process.argv[2];
const remainingCredits = parseInt(process.argv[3], 10);

// 验证额度数量
if (isNaN(remainingCredits) || remainingCredits < 0) {
  console.error('错误: 剩余额度必须是大于或等于0的数字');
  process.exit(1);
}

// 从.env.local文件加载配置
try {
  // 项目根目录的.env.local路径
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (fs.existsSync(envPath)) {
    console.log('从 .env.local 文件加载配置...');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = envContent.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          // 处理值可能包含等号的情况
          const value = valueParts.join('=');
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
    console.log('未找到 .env.local 文件，检查其他可能的环境变量文件...');
    
    // 尝试加载.env文件
    const defaultEnvPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(defaultEnvPath)) {
      console.log('从 .env 文件加载配置...');
      const envContent = fs.readFileSync(defaultEnvPath, 'utf-8');
      const envVars = envContent.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .reduce((acc, line) => {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            acc[key.trim()] = value.trim();
          }
          return acc;
        }, {});
      
      Object.entries(envVars).forEach(([key, value]) => {
        process.env[key] = value;
      });
      
      console.log('已成功从.env加载环境变量配置');
    } else {
      console.log('未找到任何环境变量文件，将使用环境变量或脚本中的默认值');
    }
  }
} catch (error) {
  console.error('加载环境变量文件失败:', error.message);
}

// 获取Redis凭证
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.error('错误: 未能从环境变量文件中获取Upstash Redis凭证!');
  console.error('请确保您的.env.local或.env文件中包含以下环境变量:');
  console.error('UPSTASH_REDIS_REST_URL=您的Upstash_REST_URL');
  console.error('UPSTASH_REDIS_REST_TOKEN=您的Upstash_REST_TOKEN');
  process.exit(1);
}

// 初始化Redis客户端
const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

async function fixRateLimit() {
  try {
    console.log(`正在为用户 ${userId} 设置剩余额度为 ${remainingCredits} 次...`);
    
    // 构建@upstash/ratelimit库使用的键名
    const ratelimitKey = `ratelimit:logocreator:${userId}`;
    console.log(`使用的Redis键名: ${ratelimitKey}`);
    
    // 获取当前限流值
    const currentLimitData = await redis.get(ratelimitKey);
    
    // 设置限制、重置时间和剩余次数
    const limit = 3; // 默认限制
    const reset = Date.now() + 60 * 24 * 60 * 60 * 1000; // 60天后重置
    
    if (!currentLimitData) {
      console.log('未找到该用户的@upstash/ratelimit记录，将创建新记录');
      
      // 创建新的限流记录
      const newLimitData = {
        limit,
        remaining: remainingCredits,
        reset
      };
      
      await redis.set(ratelimitKey, newLimitData);
      console.log(`成功创建新记录: ${JSON.stringify(newLimitData)}`);
    } else {
      console.log('找到现有记录:', currentLimitData);
      
      // 更新现有记录的剩余额度
      let updatedData;
      
      if (typeof currentLimitData === 'object' && currentLimitData !== null) {
        // 如果是对象格式，直接更新remaining字段
        updatedData = {
          ...currentLimitData,
          remaining: remainingCredits
        };
        
        // 确保有limit和reset字段
        if (!updatedData.limit) updatedData.limit = limit;
        if (!updatedData.reset) updatedData.reset = reset;
        
      } else {
        // 如果是其他格式，创建新的对象
        updatedData = {
          limit,
          remaining: remainingCredits,
          reset
        };
      }
      
      await redis.set(ratelimitKey, updatedData);
      console.log(`成功更新记录: ${JSON.stringify(updatedData)}`);
    }
    
    // 再次读取数据验证更新是否成功
    const updatedData = await redis.get(ratelimitKey);
    console.log(`验证更新结果: ${JSON.stringify(updatedData)}`);
    
    console.log(`操作完成! 用户 ${userId} 的剩余额度已设置为 ${remainingCredits} 次`);
    
  } catch (error) {
    console.error('设置用户额度时出错:', error);
    process.exit(1);
  }
}

fixRateLimit(); 