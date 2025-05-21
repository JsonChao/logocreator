// 为用户增加10次Logo生成额度的脚本，从项目根目录的.env.local读取Redis凭证
// 使用方法: node scripts/add-10-credits-from-env-local.js <用户ID>

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// 设置要增加的固定额度数量
const CREDITS_TO_ADD = 10;

// 检查所需参数
if (process.argv.length < 3) {
  console.error('用法: node scripts/add-10-credits-from-env-local.js <用户ID>');
  process.exit(1);
}

const userId = process.argv[2];

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

async function add10Credits() {
  try {
    console.log(`正在为用户 ${userId} 添加 ${CREDITS_TO_ADD} 次额度...`);
    
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
    
    console.log('获取到的当前限流数据:', currentLimitData);
    
    // 尝试解析当前限流数据
    let timestamp, currentUsage;
    
    if (typeof currentLimitData === 'string') {
      try {
        // 先尝试解析为JSON
        const parsed = JSON.parse(currentLimitData);
        if (Array.isArray(parsed) && parsed.length === 2) {
          [timestamp, currentUsage] = parsed;
        } else {
          throw new Error('无效的数据格式');
        }
      } catch (parseError) {
        // 如果JSON解析失败，尝试手动分割字符串
        console.log('JSON解析失败，尝试手动解析字符串...');
        const parts = currentLimitData.split(',');
        if (parts.length === 2) {
          timestamp = parseInt(parts[0], 10);
          currentUsage = parseInt(parts[1], 10);
          
          if (isNaN(timestamp) || isNaN(currentUsage)) {
            throw new Error('无法解析限流数据');
          }
        } else {
          throw new Error('无法解析限流数据');
        }
      }
    } else if (Array.isArray(currentLimitData) && currentLimitData.length === 2) {
      // 如果直接是数组格式
      [timestamp, currentUsage] = currentLimitData;
    } else {
      throw new Error('无效的限流数据格式');
    }
    
    console.log(`当前状态: 时间窗口开始于 ${new Date(timestamp).toLocaleString()}, 使用量: ${currentUsage}`);
    
    // 计算新的使用次数（减少使用次数相当于增加额度）
    const newUsage = currentUsage - CREDITS_TO_ADD;
    
    // 更新限流数据
    await redis.set(rateLimitKey, JSON.stringify([timestamp, newUsage]));
    
    console.log(`成功为用户 ${userId} 添加了 ${CREDITS_TO_ADD} 次生成额度`);
    
    if (newUsage < 0) {
      console.log(`当前状态: 剩余额度: ${-newUsage} 次`);
    } else {
      console.log(`当前状态: 已使用 ${newUsage} 次，默认额度上限为3次`);
    }
    
  } catch (error) {
    console.error('增加额度时出错:', error);
    process.exit(1);
  }
}

add10Credits(); 