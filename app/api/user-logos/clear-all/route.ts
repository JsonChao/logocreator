import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// 修改导入路径指向api/lib目录
import { userLogos } from "../../lib/store";
// 导入共享变量模块
import { setClearLogosMark } from "../../lib/shared-state";

// 清除用户的所有Logo记录
export async function POST() {
  try {
    const user = await currentUser();
    
    // 验证用户是否已登录
    if (!user) {
      return new NextResponse("未授权", { status: 401 });
    }
    
    // 检查用户是否是指定的邮箱账户
    const isTargetUser = user.emailAddresses.some(
      email => email.emailAddress === "chao.qu521@gmail.com"
    );
    
    if (!isTargetUser) {
      return new NextResponse("没有权限删除此账户的Logo", { status: 403 });
    }
    
    const userId = user.id;
    
    // 检查用户是否有Logo
    if (!userLogos[userId] || userLogos[userId].length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "用户没有Logo记录" 
      });
    }
    
    // 强制清空用户的Logo数组
    const deletedCount = userLogos[userId].length;
    userLogos[userId] = [];
    
    // 设置一个特殊标记，确保下次获取时重新初始化
    // 这是一个内存中的标记，但有助于解决部分清空问题
    setClearLogosMark(userId);
    
    return NextResponse.json({ 
      success: true, 
      message: `成功删除 ${deletedCount} 个Logo记录` 
    });
  } catch (error) {
    console.error("删除所有Logo失败:", error);
    return new NextResponse("删除Logo时发生错误", { status: 500 });
  }
}

export const runtime = "edge"; 