import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 导入用户Logo存储对象
// 注意：这是在模块作用域之外声明的，以模拟从另一个文件中导入
// 在实际项目中，应该使用数据库而不是内存对象
declare const userLogos: Record<string, Array<any>>;

// 清除用户的所有Logo记录
export async function POST(req: Request) {
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
    
    // 检查对象及其属性是否存在
    if (typeof userLogos !== 'undefined') {
      // 检查用户是否有Logo
      if (!userLogos[userId] || userLogos[userId].length === 0) {
        return NextResponse.json({ 
          success: true, 
          message: "用户没有Logo记录" 
        });
      }
      
      // 清空用户的Logo数组
      const deletedCount = userLogos[userId].length;
      userLogos[userId] = [];
      
      return NextResponse.json({ 
        success: true, 
        message: `成功删除 ${deletedCount} 个Logo记录` 
      });
    } else {
      console.error("userLogos对象未定义");
      return NextResponse.json({ 
        success: true, 
        message: "已处理，但存储对象不可用" 
      });
    }
  } catch (error) {
    console.error("删除所有Logo失败:", error);
    return new NextResponse("删除Logo时发生错误", { status: 500 });
  }
}

export const runtime = "edge"; 