import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextFetchEvent } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(
  req: NextRequest,
  evt: NextFetchEvent,
) {
  const country = req.geo?.country;
  // Check for Russian traffic first as there's too much spam from Russia
  if (country === "RU") {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // 检查是否配置了Clerk环境变量
  const hasClerkConfig = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.CLERK_SECRET_KEY;

  // 如果未配置Clerk，则跳过认证
  if (!hasClerkConfig) {
    console.warn("Clerk authentication is not configured. Skipping authentication middleware.");
    return NextResponse.next();
  }

  // 临时变量，记录是否已经尝试过Clerk中间件
  let clerkAttempted = false;

  // If not from Russia and Clerk is configured, proceed with Clerk authentication
  try {
    clerkAttempted = true;
    // 使用宽松错误处理的方式包装Clerk中间件
    const clerkResponse = await Promise.resolve().then(() => {
      try {
        return clerkMiddleware()(req, evt);
      } catch (innerError) {
        console.error("Clerk middleware inner error:", innerError);
        return null; // 内部错误时返回null
      }
    });
    
    // 如果Clerk中间件成功处理了请求并返回了响应，就使用它
    if (clerkResponse) {
      return clerkResponse;
    }
    
    // 否则回退到默认行为
    console.warn("Clerk middleware did not return a response, continuing...");
    return NextResponse.next();
  } catch (error) {
    console.error("Clerk middleware outer error:", error);
    
    // 即使Clerk中间件失败，也继续处理请求
    if (clerkAttempted) {
      console.warn("Bypassing Clerk authentication due to error");
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
