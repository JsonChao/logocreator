// 修复Redis键不一致问题的脚本
// 使用方法: node scripts/fix-redis-keys.js <用户ID>

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// 检查所需参数
if (process.argv.length < 3) {
  console.error('用法: node scripts/fix-redis-keys.js <用户ID>');
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

async function fixRedisKeys() {
  try {
    console.log(`正在修复用户 ${userId} 的Redis键不一致问题...`);
    
    // 构建两种格式的键名
    const oldFormatKey = `logocreator:${userId}:rlflw`;
    const newFormatKey = `ratelimit:logocreator:${userId}`;
    
    console.log(`正在检查旧格式键: ${oldFormatKey}`);
    const oldFormatData = await redis.get(oldFormatKey);
    
    console.log(`正在检查新格式键: ${newFormatKey}`);
    const newFormatData = await redis.get(newFormatKey);
    
    // 显示找到的数据
    console.log('\n当前Redis键值:');
    console.log(`旧格式键(${oldFormatKey}):`, oldFormatData);
    console.log(`新格式键(${newFormatKey}):`, newFormatData);
    
    // 计算剩余额度
    let remainingCredits = 3; // 默认额度
    
    // 从旧格式键提取剩余额度
    if (oldFormatData) {
      try {
        let currentUsage;
        
        if (Array.isArray(oldFormatData) && oldFormatData.length === 2) {
          currentUsage = oldFormatData[1];
        } else if (typeof oldFormatData === 'string') {
          try {
            const parsed = JSON.parse(oldFormatData);
            if (Array.isArray(parsed) && parsed.length === 2) {
              currentUsage = parsed[1];
            }
          } catch {
            const parts = oldFormatData.split(',');
            if (parts.length === 2) {
              currentUsage = parseInt(parts[1], 10);
            }
          }
        }
        
        // 根据使用量计算剩余额度
        if (currentUsage !== undefined) {
          if (currentUsage < 0) {
            // 负值表示预先设置的额度
            remainingCredits = -currentUsage;
          } else {
            // 正值表示已使用次数
            remainingCredits = Math.max(0, 3 - currentUsage);
          }
        }
        
        console.log(`\n从旧格式键解析出的剩余额度: ${remainingCredits}`);
      } catch (error) {
        console.error('解析旧格式键数据失败:', error);
      }
    } else {
      console.log('未找到旧格式键，将使用默认额度 (3)');
    }
    
    // 从新格式键提取剩余额度
    let newFormatRemaining = undefined;
    
    if (newFormatData) {
      try {
        if (typeof newFormatData === 'object' && newFormatData !== null && 'remaining' in newFormatData) {
          newFormatRemaining = Number(newFormatData.remaining);
          console.log(`从新格式键解析出的剩余额度: ${newFormatRemaining}`);
        }
      } catch (error) {
        console.error('解析新格式键数据失败:', error);
      }
    } else {
      console.log('未找到新格式键');
    }
    
    // 确定最终使用的剩余额度值
    const finalRemainingCredits = newFormatRemaining !== undefined ? newFormatRemaining : remainingCredits;
    console.log(`\n最终确定的剩余额度: ${finalRemainingCredits}`);
    
    // 确定是否需要更新
    let needsUpdate = false;
    
    if (!newFormatData) {
      console.log('需要创建新格式键');
      needsUpdate = true;
    } else if (newFormatRemaining !== finalRemainingCredits) {
      console.log(`需要更新新格式键中的剩余额度 (${newFormatRemaining} -> ${finalRemainingCredits})`);
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      // 设置限制、重置时间和剩余次数
      const limit = 3; // 默认限制
      const reset = Date.now() + 60 * 24 * 60 * 60 * 1000; // 60天后重置
      
      // 创建或更新新格式键
      const updatedData = {
        limit,
        remaining: finalRemainingCredits,
        reset
      };
      
      console.log(`\n正在更新新格式键(${newFormatKey})为:`, updatedData);
      await redis.set(newFormatKey, updatedData);
      
      // 验证更新
      const verifyData = await redis.get(newFormatKey);
      console.log('更新后的数据:', verifyData);
      
      console.log(`\n成功更新Redis键！用户 ${userId} 的剩余额度现在是 ${finalRemainingCredits} 次`);
    } else {
      console.log('\n无需更新，Redis键已一致');
    }
    
    // 强制重置Ratelimit库使用的键
    console.log('\n强制重置@upstash/ratelimit库使用的键以确保正常工作...');
    // 删除现有键
    await redis.del(newFormatKey);
    
    // 创建新键
    const resetData = {
      limit: 3,
      remaining: finalRemainingCredits,
      reset: Date.now() + 60 * 24 * 60 * 60 * 1000
    };
    await redis.set(newFormatKey, resetData);
    
    // 验证重置
    const finalData = await redis.get(newFormatKey);
    console.log('最终数据:', finalData);
    
    console.log(`\n操作完成！请刷新页面并尝试生成Logo`);
    
  } catch (error) {
    console.error('修复Redis键时出错:', error);
    process.exit(1);
  }
}

fixRedisKeys(); 