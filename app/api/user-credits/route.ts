import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// 创建Redis客户端实例
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// 检查Clerk配置
const hasClerkConfig = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY;

export async function GET(req: NextRequest) {
  try {
    // 获取当前登录用户
    const user = hasClerkConfig ? await currentUser() : null;

    // 获取URL中的参数
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");
    const forceRefresh = url.searchParams.get("forceRefresh") === "true";
    
    // 如果查询的是自己的信息，或者未提供ID，则使用当前用户ID或'anonymous'
    const userId = queryUserId || user?.id || 'anonymous';
    
    // 如果没有用户ID，返回错误 (现在不应该发生了，因为有anonymous兜底)
    if (!userId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    // 权限验证：只允许查询自己的额度信息，除非是管理员
    if (queryUserId && user?.id !== queryUserId && queryUserId !== 'anonymous') {
      // 检查当前用户是否为管理员
      const isAdmin = user?.publicMetadata?.role === "admin";
      
      if (!isAdmin) {
        return NextResponse.json({ error: "无权查询其他用户的额度信息" }, { status: 403 });
      }
    }

    // 构建限流键名
    const rateLimitKey = `logocreator:${userId}:rlflw`;
    
    // 获取当前限流值
    const currentLimitData = await redis.get(rateLimitKey);
    console.log(`获取到的Redis数据: ${JSON.stringify(currentLimitData)}`);
    
    // 计算剩余额度
    let remainingCredits = 3; // 默认额度
    let didUpdateRedis = false;
    let dataSource = "default";
    
    // 先尝试直接获取Upstash Ratelimit的原始数据
    // 这是直接使用@upstash/ratelimit库生成的键
    try {
      const directRatelimitKey = `ratelimit:logocreator:${userId}`;
      const upstashRatelimitData = await redis.get(directRatelimitKey);
      console.log(`尝试直接获取Upstash Ratelimit数据: ${JSON.stringify(upstashRatelimitData)}`);
      
      if (upstashRatelimitData && typeof upstashRatelimitData === 'object' && upstashRatelimitData !== null) {
        if ('remaining' in upstashRatelimitData) {
          remainingCredits = Number(upstashRatelimitData.remaining);
          dataSource = "direct_upstash_ratelimit";
          console.log(`直接从Upstash Ratelimit获取剩余额度: ${remainingCredits}`);
          
          // 成功从直接的ratelimit数据获取额度，不需要继续处理
          return NextResponse.json({ 
            remainingCredits,
            updatedRedis: false,
            dataSource,
            userId,
            rawData: JSON.stringify(upstashRatelimitData)
          });
        }
      }
    } catch (error) {
      console.error("尝试直接获取Upstash Ratelimit数据失败:", error);
      // 继续使用备用方法
    }
    
    // 如果直接获取失败，使用原有的解析逻辑
    if (currentLimitData) {
      try {
        let currentUsage: number | undefined;
        
        // 处理各种可能的数据格式
        if (Array.isArray(currentLimitData) && currentLimitData.length === 2) {
          // 原生数组格式 [timestamp, usage]
          currentUsage = currentLimitData[1];
          dataSource = "redis_array";
          console.log(`解析为数组格式: [${currentLimitData[0]}, ${currentLimitData[1]}]`);
        } else if (typeof currentLimitData === 'string') {
          try {
            // JSON字符串格式
            const parsed = JSON.parse(currentLimitData);
            if (Array.isArray(parsed) && parsed.length === 2) {
              currentUsage = parsed[1];
              dataSource = "redis_json";
              console.log(`解析为JSON格式: [${parsed[0]}, ${parsed[1]}]`);
            }
          } catch {
            // 逗号分隔字符串格式
            const parts = currentLimitData.split(',');
            if (parts.length === 2) {
              currentUsage = parseInt(parts[1], 10);
              if (!isNaN(currentUsage)) {
                dataSource = "redis_string";
                console.log(`解析为字符串格式: [${parts[0]}, ${parts[1]}]`);
              }
            }
          }
        } else if (typeof currentLimitData === 'object' && currentLimitData !== null) {
          // 处理可能的对象格式
          if ('remaining' in currentLimitData) {
            // 直接包含remaining字段的对象
            const remaining = Number(currentLimitData.remaining);
            if (!isNaN(remaining)) {
              remainingCredits = remaining;
              dataSource = "redis_object";
              console.log(`解析为对象格式，直接包含remaining: ${remaining}`);
            }
          }
        } else if (typeof currentLimitData === 'number') {
          // 直接是数字（可能是剩余次数或使用次数）
          if (currentLimitData < 0) {
            // 负数表示直接的剩余额度
            remainingCredits = -currentLimitData;
          } else {
            // 正数表示已使用次数
            remainingCredits = Math.max(0, 3 - currentLimitData);
          }
          dataSource = "redis_number";
          console.log(`解析为数字格式: ${currentLimitData}, 计算剩余额度: ${remainingCredits}`);
        }
        
        // 根据使用量计算剩余额度
        if (currentUsage !== undefined) {
          if (currentUsage < 0) {
            // 负值表示预先设置的额度
            remainingCredits = -currentUsage;
            console.log(`负值使用量，直接表示剩余额度: ${remainingCredits}`);
          } else {
            // 正值表示已使用次数
            remainingCredits = Math.max(0, 3 - currentUsage);
            console.log(`正值使用量 ${currentUsage}，计算剩余额度: ${remainingCredits}`);
          }
        }
      } catch (error) {
        console.error("解析限流数据失败:", error);
        dataSource = "parse_error";
      }
    }
    
    // 如果强制刷新或Redis中数据格式有问题，重写Redis数据确保格式正确
    if (forceRefresh || dataSource === "parse_error") {
      try {
        const newLimitData = [Date.now(), -remainingCredits]; // 使用新的时间戳和负值表示剩余额度
        await redis.set(rateLimitKey, JSON.stringify(newLimitData));
        didUpdateRedis = true;
        console.log(`已重写Redis数据: ${JSON.stringify(newLimitData)}`);
      } catch (redisError) {
        console.error("重写Redis数据失败:", redisError);
      }
    }
    
    // 返回剩余额度和调试信息
    return NextResponse.json({ 
      remainingCredits,
      updatedRedis: didUpdateRedis,
      dataSource,
      userId,
      rawData: typeof currentLimitData === 'object' ? JSON.stringify(currentLimitData) : String(currentLimitData)
    });
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("获取用户额度失败:", errorMsg);
    return NextResponse.json(
      { error: "获取用户额度失败", message: errorMsg },
      { status: 500 }
    );
  }
}

export const runtime = "edge"; 