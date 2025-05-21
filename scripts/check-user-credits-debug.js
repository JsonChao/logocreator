// 查询用户当前Logo生成额度状态的调试脚本 - 显示详细信息
// 使用方法: node scripts/check-user-credits-debug.js <用户ID>

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// 检查所需参数
if (process.argv.length < 3) {
  console.error('用法: node scripts/check-user-credits-debug.js <用户ID>');
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

async function checkUserCredits() {
  try {
    console.log(`正在查询用户 ${userId} 的额度状态...`);
    
    // 构建限流键名（与应用程序中使用的格式相同）
    const rateLimitKey = `logocreator:${userId}:rlflw`;
    
    console.log(`使用的Redis键名: ${rateLimitKey}`);
    
    // 获取当前限流值（原始数据）
    const currentLimitData = await redis.get(rateLimitKey);
    
    if (!currentLimitData) {
      console.log(`未找到用户 ${userId} 的限流记录`);
      console.log('默认情况下，用户有3次免费生成额度');
      return;
    }
    
    // 显示原始数据
    console.log('从Redis获取的原始数据:');
    console.log(typeof currentLimitData, currentLimitData);
    
    // 尝试解析数据 - 详细调试
    let timestamp, currentUsage;
    let remainingCredits = 3; // 默认额度
    
    console.log('\n尝试解析数据:');
    
    if (typeof currentLimitData === 'string') {
      console.log('数据类型: 字符串');
      
      try {
        // 尝试解析为JSON
        console.log('尝试JSON解析...');
        const parsed = JSON.parse(currentLimitData);
        console.log('JSON解析结果:', parsed);
        
        if (Array.isArray(parsed) && parsed.length === 2) {
          [timestamp, currentUsage] = parsed;
          console.log('成功提取数据: [timestamp, currentUsage] =', [timestamp, currentUsage]);
        } else {
          console.log('JSON格式不符合预期: 不是含有2个元素的数组');
        }
      } catch (parseError) {
        console.log('JSON解析失败:', parseError.message);
        
        // 尝试手动分割字符串
        console.log('尝试手动分割字符串...');
        
        // 移除可能的括号
        const cleanedStr = currentLimitData.replace(/^\[|\]$/g, '');
        console.log('清理后的字符串:', cleanedStr);
        
        const parts = cleanedStr.split(',');
        console.log('分割结果:', parts);
        
        if (parts.length === 2) {
          timestamp = parseInt(parts[0].trim(), 10);
          currentUsage = parseInt(parts[1].trim(), 10);
          
          if (!isNaN(timestamp) && !isNaN(currentUsage)) {
            console.log('成功通过手动分割提取数据: [timestamp, currentUsage] =', [timestamp, currentUsage]);
          } else {
            console.log('数值解析失败: 无法转换为整数');
          }
        } else {
          console.log('手动分割失败: 不是包含2个元素的字符串');
        }
      }
    } else if (Array.isArray(currentLimitData)) {
      console.log('数据类型: 数组');
      
      if (currentLimitData.length === 2) {
        [timestamp, currentUsage] = currentLimitData;
        console.log('成功提取数据: [timestamp, currentUsage] =', [timestamp, currentUsage]);
      } else {
        console.log('数组长度不正确，预期2个元素，实际为', currentLimitData.length);
      }
    } else {
      console.log('未知的数据类型:', typeof currentLimitData);
      console.log('数据内容:', currentLimitData);
    }
    
    // 如果成功解析数据
    if (timestamp !== undefined && currentUsage !== undefined) {
      console.log('\n解析成功，计算剩余额度:');
      
      // 计算剩余额度
      if (currentUsage < 0) {
        // 负值表示预设额度
        remainingCredits = -currentUsage;
        console.log(`使用量是负值 (${currentUsage})，表示预设额度 = ${remainingCredits}`);
      } else {
        // 正值表示已使用次数
        remainingCredits = Math.max(0, 3 - currentUsage);
        console.log(`使用量是正值 (${currentUsage})，表示已使用次数，剩余额度 = max(0, 3 - ${currentUsage}) = ${remainingCredits}`);
      }
      
      console.log('\n用户额度摘要:');
      console.log(`用户ID: ${userId}`);
      console.log(`时间窗口开始于: ${new Date(timestamp).toLocaleString()}`);
      
      if (currentUsage < 0) {
        console.log(`剩余额度: ${remainingCredits} 次`);
      } else {
        console.log(`已使用额度: ${currentUsage} 次`);
        console.log(`剩余额度: ${remainingCredits} 次`);
      }
    } else {
      console.log('\n无法解析数据，无法计算剩余额度');
    }
    
  } catch (error) {
    console.error('查询用户额度时出错:', error);
    process.exit(1);
  }
}

checkUserCredits(); 