import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensurePermanentLogoUrl } from "@/app/lib/imageStorage";
import { userLogos } from "@/app/lib/store";

// 声明全局变量，用于跨实例标记
declare global {
  var __FORCE_CLEAR_LOGOS_FOR_USER: string | undefined;
}

// 获取用户的所有Logo
export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("未授权", { status: 401 });
    }
    
    const userId = user.id;
    
    // 检查是否有清除标记，如果有则确保数据被清除
    if (global.__FORCE_CLEAR_LOGOS_FOR_USER === userId) {
      console.log(`检测到用户 ${userId} 的清除标记，确保数据被清除`);
      userLogos[userId] = [];
      // 清除标记
      global.__FORCE_CLEAR_LOGOS_FOR_USER = undefined;
    }
    
    // 如果用户在我们的"数据库"中没有Logo，返回空数组
    if (!userLogos[userId]) {
      userLogos[userId] = [];
    }
    
    // 处理所有Logo URL，确保是永久URL
    const userLogosWithPermanentUrls = await Promise.all(
      userLogos[userId].map(async (logo) => {
        // 检查并更新图片URL为永久URL
        const permanentUrl = await ensurePermanentLogoUrl(logo.imageUrl);
        
        // 如果URL发生变化，更新存储中的URL
        if (permanentUrl !== logo.imageUrl) {
          logo.imageUrl = permanentUrl;
        }
        
        return logo;
      })
    );
    
    return NextResponse.json(userLogosWithPermanentUrls);
  } catch (error) {
    console.error("获取用户Logo失败:", error);
    return new NextResponse("获取用户Logo时发生错误", { status: 500 });
  }
}

// 保存新Logo
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("未授权", { status: 401 });
    }
    
    const userId = user.id;
    const data = await req.json();
    
    // 验证请求数据
    if (!data.companyName || !data.style || !data.primaryColor || !data.backgroundColor || !data.imageUrl) {
      return new NextResponse("缺少必要的Logo信息", { status: 400 });
    }
    
    // 确保图片URL是永久的
    const permanentImageUrl = await ensurePermanentLogoUrl(data.imageUrl);
    
    // 创建新Logo记录
    const newLogo = {
      id: Date.now().toString(), // 在实际项目中使用UUID或数据库自增ID
      userId,
      createdAt: new Date().toISOString(),
      companyName: data.companyName,
      style: data.style,
      primaryColor: data.primaryColor,
      backgroundColor: data.backgroundColor,
      imageUrl: permanentImageUrl, // 使用永久URL
      liked: data.liked || false
    };
    
    // 确保用户在"数据库"中有一个数组
    if (!userLogos[userId]) {
      userLogos[userId] = [];
    }
    
    // 将新Logo添加到用户的Logo列表中
    userLogos[userId].push(newLogo);
    
    return NextResponse.json(newLogo);
  } catch (error) {
    console.error("保存Logo失败:", error);
    return new NextResponse("保存Logo时发生错误", { status: 500 });
  }
}

// 更新Logo（切换收藏状态）
export async function PUT(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("未授权", { status: 401 });
    }
    
    const userId = user.id;
    const data = await req.json();
    
    // 验证请求数据
    if (!data.id) {
      return new NextResponse("缺少Logo ID", { status: 400 });
    }
    
    // 如果用户没有Logo列表，返回错误
    if (!userLogos[userId]) {
      return new NextResponse("Logo不存在", { status: 404 });
    }
    
    // 查找并更新Logo
    const logoIndex = userLogos[userId].findIndex(logo => logo.id === data.id);
    
    if (logoIndex === -1) {
      return new NextResponse("Logo不存在", { status: 404 });
    }
    
    // 如果包含imageUrl，确保它是永久URL
    if (data.imageUrl) {
      data.imageUrl = await ensurePermanentLogoUrl(data.imageUrl);
    }
    
    // 更新Logo属性
    userLogos[userId][logoIndex] = {
      ...userLogos[userId][logoIndex],
      ...data,
    };
    
    return NextResponse.json(userLogos[userId][logoIndex]);
  } catch (error) {
    console.error("更新Logo失败:", error);
    return new NextResponse("更新Logo时发生错误", { status: 500 });
  }
}

// 删除Logo
export async function DELETE(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("未授权", { status: 401 });
    }
    
    const userId = user.id;
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return new NextResponse("缺少Logo ID", { status: 400 });
    }
    
    // 如果用户没有Logo列表，返回错误
    if (!userLogos[userId]) {
      return new NextResponse("Logo不存在", { status: 404 });
    }
    
    // 查找并删除Logo
    const initialLength = userLogos[userId].length;
    userLogos[userId] = userLogos[userId].filter(logo => logo.id !== id);
    
    // 检查是否删除了Logo
    if (userLogos[userId].length === initialLength) {
      return new NextResponse("Logo不存在", { status: 404 });
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("删除Logo失败:", error);
    return new NextResponse("删除Logo时发生错误", { status: 500 });
  }
}

export const runtime = "edge"; 