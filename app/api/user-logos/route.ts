import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensurePermanentLogoUrl } from "@/app/lib/imageStorage";

// 模拟数据库存储
// 在实际项目中，这应该使用真实的数据库，如Prisma + PostgreSQL
const userLogos: Record<string, Array<{
  id: string;
  userId: string;
  createdAt: string;
  companyName: string;
  style: string;
  primaryColor: string;
  backgroundColor: string;
  imageUrl: string;
  liked: boolean;
}>> = {};

// 获取用户的所有Logo
export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("未授权", { status: 401 });
    }
    
    const userId = user.id;
    
    // 如果用户在我们的"数据库"中没有Logo，返回空数组
    if (!userLogos[userId]) {
      // 创建模拟数据用于演示
      userLogos[userId] = [
        {
          id: "1",
          userId,
          createdAt: "2023-05-20T10:30:00Z",
          companyName: "TechWave",
          style: "tech",
          primaryColor: "#0288D1",
          backgroundColor: "#FFFFFF",
          imageUrl: "https://replicate.delivery/pbxt/IRXdmLGaXlMGLsE2ov7gm1Rn57VDKpbsXMC93j4NQLwZQIjIA/output.png",
          liked: true
        },
        {
          id: "2",
          userId,
          createdAt: "2023-05-18T14:20:00Z",
          companyName: "EcoLeaf",
          style: "minimal",
          primaryColor: "#388E3C",
          backgroundColor: "#FFFFFF",
          imageUrl: "https://replicate.delivery/pbxt/W3Fde4F0D4kHFGriqfuNgpkK6OOh4PGZfg2W2z0LhyuJGPdFC/output.png",
          liked: false
        },
        {
          id: "3",
          userId,
          createdAt: "2023-05-15T09:45:00Z",
          companyName: "ArtDeco",
          style: "playful",
          primaryColor: "#E53935",
          backgroundColor: "#FFFFFF",
          imageUrl: "https://replicate.delivery/pbxt/oGw43xMF2VZYElXGQYORJAkwcaWdamdTHkpA2wXHxpgwu7NJA/out-0.png",
          liked: true
        },
        {
          id: "4",
          userId,
          createdAt: "2023-05-10T16:30:00Z",
          companyName: "CloudSync",
          style: "modern",
          primaryColor: "#2D2DFF",
          backgroundColor: "#FFFFFF",
          imageUrl: "https://replicate.delivery/pbxt/X3b71qPHVoEMRpnYVrQk32tlUCNpNH7Cs0bKyH7G6Dqr2cRJA/out-0.png",
          liked: false
        },
      ];
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