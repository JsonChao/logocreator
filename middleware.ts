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

  // If not from Russia and Clerk is configured, proceed with Clerk authentication
  try {
    return clerkMiddleware()(req, evt);
  } catch (error) {
    console.error("Clerk middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
