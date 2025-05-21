// 将Redis中的用户额度同步到Clerk用户元数据中
// 使用方法: node scripts/sync-clerk-metadata.js <用户ID>

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');
const { Clerk } = require('@clerk/clerk-sdk-node');

// 检查所需参数
if (process.argv.length < 3) {
  console.error('用法: node scripts/sync-clerk-metadata.js <用户ID>');
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
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "";

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.error('错误: 未能从环境变量文件中获取Upstash Redis凭证!');
  console.error('请确保您的.env.local或.env文件中包含以下环境变量:');
  console.error('UPSTASH_REDIS_REST_URL=您的Upstash_REST_URL');
  console.error('UPSTASH_REDIS_REST_TOKEN=您的Upstash_REST_TOKEN');
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error('错误: 未能从环境变量文件中获取Clerk Secret Key!');
  console.error('请确保您的.env.local或.env文件中包含以下环境变量:');
  console.error('CLERK_SECRET_KEY=您的Clerk私钥');
  process.exit(1);
}

// 初始化Redis客户端
const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

// 初始化Clerk客户端
const clerk = Clerk({ secretKey: CLERK_SECRET_KEY });

async function syncClerkMetadata() {
  try {
    console.log(`正在将Redis中的用户 ${userId} 额度同步到Clerk元数据...`);
    
    // 构建限流键名（与应用程序中使用的格式相同）
    const rateLimitKey = `logocreator:${userId}:rlflw`;
    
    // 获取当前限流值
    const currentLimitData = await redis.get(rateLimitKey);
    
    if (!currentLimitData) {
      console.log(`未找到用户 ${userId} 的限流记录，使用默认3次额度`);
      
      // 更新用户元数据，默认3次额度
      await clerk.users.updateUser(userId, {
        unsafeMetadata: {
          remaining: 3,
        },
      });
      
      console.log('已成功更新Clerk用户元数据，设置默认3次额度');
      return;
    }
    
    console.log('获取到的当前限流数据:', currentLimitData);
    
    // 尝试解析当前限流数据
    let remainingCredits = 3; // 默认额度
    
    try {
      let currentUsage;
      
      // 根据数据类型解析
      if (typeof currentLimitData === 'string') {
        try {
          // 尝试解析为JSON
          const parsed = JSON.parse(currentLimitData);
          if (Array.isArray(parsed) && parsed.length === 2) {
            currentUsage = parsed[1]; // 第二个元素是使用量
          }
        } catch (parseError) {
          // 如果JSON解析失败，尝试手动分割
          const parts = currentLimitData.split(',');
          if (parts.length === 2) {
            currentUsage = parseInt(parts[1], 10);
          }
        }
      } else if (Array.isArray(currentLimitData) && currentLimitData.length === 2) {
        currentUsage = currentLimitData[1];
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
    
    // 更新用户元数据
    try {
      await clerk.users.updateUser(userId, {
        unsafeMetadata: {
          remaining: remainingCredits,
        },
      });
      
      console.log(`已成功更新Clerk用户元数据，设置剩余额度为: ${remainingCredits} 次`);
    } catch (clerkError) {
      console.error('更新Clerk用户元数据失败:', clerkError);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('同步用户额度失败:', error);
    process.exit(1);
  }
}

syncClerkMetadata(); 