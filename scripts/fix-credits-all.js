// 修复用户额度显示的脚本，直接强制更新前端显示的剩余额度
// 使用方法: node scripts/fix-credits-all.js <用户ID>

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// 检查所需参数
if (process.argv.length < 3) {
  console.error('用法: node scripts/fix-credits-all.js <用户ID>');
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

async function fixCreditsDisplay() {
  try {
    console.log(`开始全方位修复用户 ${userId} 的额度显示问题...`);
    
    // 构建限流键名（与应用程序中使用的格式相同）
    const rateLimitKey = `logocreator:${userId}:rlflw`;
    
    // 获取当前限流值
    const currentLimitData = await redis.get(rateLimitKey);
    
    if (!currentLimitData) {
      console.log(`未找到用户 ${userId} 的限流记录，无法修复`);
      return;
    }
    
    console.log('Redis中的当前限流数据:', currentLimitData);
    
    // 尝试解析当前限流数据
    let remainingCredits = 3; // 默认额度
    let timestamp, currentUsage;
    
    try {
      // 根据数据类型解析
      if (typeof currentLimitData === 'object' && Array.isArray(currentLimitData)) {
        [timestamp, currentUsage] = currentLimitData;
      } else if (typeof currentLimitData === 'string') {
        try {
          // 尝试解析为JSON
          const parsed = JSON.parse(currentLimitData);
          if (Array.isArray(parsed) && parsed.length === 2) {
            [timestamp, currentUsage] = parsed;
          }
        } catch (parseError) {
          // 如果JSON解析失败，尝试手动分割
          const parts = currentLimitData.split(',');
          if (parts.length === 2) {
            timestamp = parseInt(parts[0], 10);
            currentUsage = parseInt(parts[1], 10);
          }
        }
      }
      
      // 计算剩余额度
      if (currentUsage !== undefined) {
        if (currentUsage < 0) {
          // 负值表示预先设置的额度
          remainingCredits = -currentUsage;
        } else {
          // 正值表示已使用次数
          remainingCredits = Math.max(0, 3 - currentUsage);
        }
      }
    } catch (error) {
      console.error('解析限流数据失败:', error);
      // 使用默认值
    }
    
    console.log(`计算出的剩余额度: ${remainingCredits} 次`);
    
    // 方法1: 尝试强制重写Redis数据，确保格式正确
    try {
      const newLimitData = [Date.now(), -remainingCredits]; // 使用新的时间戳和负值表示剩余额度
      await redis.set(rateLimitKey, JSON.stringify(newLimitData));
      console.log(`方法1: 已重写Redis数据为: ${JSON.stringify(newLimitData)}`);
    } catch (redisError) {
      console.error('重写Redis数据失败:', redisError);
    }
    
    // 方法2: 尝试直接更新用户Clerk元数据
    try {
      console.log('方法2: 尝试使用sync-clerk-metadata.js更新Clerk元数据...');
      const { stdout, stderr } = await exec(`node ${path.join(__dirname, 'sync-clerk-metadata.js')} ${userId}`);
      console.log('sync-clerk-metadata.js输出:', stdout);
      if (stderr) console.error('sync-clerk-metadata.js错误:', stderr);
    } catch (execError) {
      console.log('sync-clerk-metadata.js输出:', execError.stdout);
      console.error('sync-clerk-metadata.js错误:', execError.stderr);
    }
    
    // 方法3: 模拟API请求，强制刷新缓存
    try {
      console.log('方法3: 调用API强制刷新用户额度缓存...');
      
      // 模拟API请求刷新缓存
      const { stdout, stderr } = await exec(`curl -X GET "${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user-credits?userId=${userId}&forceRefresh=true" -H "Content-Type: application/json"`);
      
      console.log('API响应:', stdout);
      if (stderr) console.error('API请求错误:', stderr);
      
      // 解析API响应
      try {
        const apiResponse = JSON.parse(stdout);
        console.log(`API返回的剩余额度: ${apiResponse.remainingCredits}`);
      } catch (parseError) {
        console.error('解析API响应失败:', parseError);
      }
    } catch (curlError) {
      console.error('执行curl请求失败:', curlError);
    }
    
    console.log('\n修复完成! 请刷新网页查看结果。如果仍然不正确，请尝试以下操作:');
    console.log('1. 清除浏览器缓存并重新登录');
    console.log('2. 检查API是否正常工作（运行curl命令）');
    console.log('3. 如果问题仍然存在，请检查前端代码或数据库连接');
    
  } catch (error) {
    console.error('修复用户额度显示时出错:', error);
    process.exit(1);
  }
}

fixCreditsDisplay(); 