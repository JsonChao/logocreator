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
    
    // 计算剩余额度
    let remainingCredits = 3; // 默认额度
    let didUpdateRedis = false;
    let dataSource = "default";
    
    if (currentLimitData) {
      try {
        let currentUsage: number | undefined;
        
        // 处理各种可能的数据格式
        if (Array.isArray(currentLimitData) && currentLimitData.length === 2) {
          // 原生数组格式
          currentUsage = currentLimitData[1];
          dataSource = "redis_array";
        } else if (typeof currentLimitData === 'string') {
          try {
            // JSON字符串格式
            const parsed = JSON.parse(currentLimitData);
            if (Array.isArray(parsed) && parsed.length === 2) {
              currentUsage = parsed[1];
              dataSource = "redis_json";
            }
          } catch (_) {
            // 逗号分隔字符串格式
            const parts = currentLimitData.split(',');
            if (parts.length === 2) {
              currentUsage = parseInt(parts[1], 10);
              if (!isNaN(currentUsage)) {
                dataSource = "redis_string";
              }
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
      } catch (error) {
        console.error("解析限流数据失败:", error);
        dataSource = "parse_error";
      }
    }
    
    // 如果强制刷新且Redis中数据格式有问题，重写Redis数据确保格式正确
    if (forceRefresh && currentLimitData) {
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