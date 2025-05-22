import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dedent from "dedent";
import Replicate from "replicate";
import { z } from "zod";
import { uploadToImgBB, storeLogoUrlMapping, ensurePermanentLogoUrl } from "@/app/lib/imageStorage";

let ratelimit: Ratelimit | undefined;

// 检查Clerk配置
const hasClerkConfig = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY;

export async function POST(req: Request) {
  // 只在配置了Clerk时获取当前用户
  const user = hasClerkConfig ? await currentUser() : null;

  // 如果配置了Clerk但未登录，返回404
  if (hasClerkConfig && !user) {
    return new Response("", { status: 404 });
  }

  const json = await req.json();
  const schema = z.object({
    companyName: z.string(),
    selectedStyle: z.string(),
    selectedPrimaryColor: z.string(),
    selectedBackgroundColor: z.string(),
    additionalInfo: z.string().optional(),
    width: z.number().default(768),
    height: z.number().default(768),
    logoCount: z.number().default(6).pipe(z.number().min(1).max(12)), // Fixed min/max validation
  });

  const data = schema.parse(json);

  // 应用速率限制（如果配置了Clerk和Upstash）
  if (hasClerkConfig && process.env.UPSTASH_REDIS_REST_URL) {
    try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      // Allow 3 requests per 2 months on prod
      limiter: Ratelimit.fixedWindow(3, "60 d"),
      analytics: true,
      prefix: "logocreator",
    });
    } catch (error) {
      console.error("初始化速率限制失败:", error);
    }
  }

  // 检查是否配置了Replicate API令牌
  if (!process.env.REPLICATE_API_TOKEN) {
    return new Response(
      "缺少Replicate API令牌。请设置REPLICATE_API_TOKEN环境变量。",
      {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      }
    );
  }

  // 应用速率限制（仅当配置了Clerk和ratelimit且有用户时）
  let success = true;
  
  // 检查用户额度（仅当配置了Clerk和ratelimit且有用户时）
  if (hasClerkConfig && user && ratelimit) {
    try {
      const { success: hasCredits, limit, reset, remaining } = await ratelimit.limit(user.id);
      console.log(`用户 ${user.id} 额度状态: 剩余=${remaining}, 总额=${limit}, 重置时间=${new Date(reset).toLocaleString()}`);
      
      if (!hasCredits) {
        return new Response(
          "您的Logo生成额度已用完。请等待下个月或升级套餐获取更多额度。",
          {
            status: 429, // Too Many Requests
            headers: { "Content-Type": "text/plain" },
          }
        );
      }
      
      success = hasCredits;
    } catch (error) {
      console.error("检查用户额度失败:", error);
      // 继续处理，但记录错误
    }
  } else {
    console.log("用户额度检查跳过: hasClerkConfig=", hasClerkConfig, ", user=", !!user, ", ratelimit=", !!ratelimit);
  }

  // 创建Replicate客户端实例
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const flashyStyle =
    "Professional level logo design, eye-catching, bold, innovative, futuristic, and impressive. Uses vibrant neon colors, complemented by metallic textures, gloss, and shiny accent effects. Ensures text is clearly legible, suitable for brand use across various media. Design should be concise and powerful, avoiding overly complex elements.";

  const techStyle =
    "Highly refined tech-style logo, sharp and clear, with a cinematic feel and photorealistic quality. Minimalist design, clean and fluid, using neutral tones with subtle accent colors, pure lines, appropriate shadows, and flat design. Ensures the logo remains clear and legible at small sizes, suitable for tech companies.";

  const modernStyle =
    "Modern, cutting-edge logo design using flat design style, geometric shapes, clean lines, and natural color combinations with subtle accent colors. Cleverly utilizes negative space to create visual interest. Design should be simple yet not simplistic, conveying the brand's forward-thinking and innovative spirit. Ensures design maintains consistency across various sizes and media.";

  const playfulStyle =
    "Energetic and playful logo using bright, bold colors, rounded shapes, and lively design elements. Design should inspire smiles, with approachability and fun while maintaining professional standards. Suitable for brands targeting younger audiences or creative industries. Ensures font choices align with the overall style.";

  const abstractStyle =
    "Abstract artistic logo style, creative, using unique shapes, patterns, and textures to create visually engaging designs. Design should be bold, innovative, and distinctive, capable of conveying the unique personality of the brand. Abstract elements should blend cleverly with the brand name, forming a harmonious whole.";

  const minimalStyle =
    "Minimalist logo design, simple, timeless, and versatile. Uses monochrome design, cleverly utilizes negative space, flat design style, and minimal details. Light, soft, subtle visual effects. Ensures the design maintains brand recognizability while remaining minimal, usable in various backgrounds and scenarios. Focuses on precise typography.";

  const elegantStyle =
    "Elegant and sophisticated logo design with refined aesthetics, careful attention to detail, and balanced proportions. Uses subtle gradients, delicate lines, and refined typography. The design should convey luxury, quality, and timelessness, suitable for premium brands and services. Ensures a sense of beauty and grace in the overall composition.";

  const professionalStyle =
    "Professional corporate logo design, business style, neat, structured, with a conservative color scheme conveying trust and stability. Design should be formal and professional, suitable for business environments. Fonts should be bold and standardized sans-serif, with overall layout balanced and easily recognizable. Ensures professional image is maintained across various application scenarios.";

  const vintageStyle =
    "Vintage or retro logo design that evokes nostalgia and classic aesthetics. Features handcrafted look, aged textures, and classic typography styles inspired by specific eras like the 50s, 60s, or 70s. Uses muted color palettes, distressed effects, and classic iconography. Perfect for brands wanting to convey heritage, tradition, or timeless craftsmanship.";

  const luxuryStyle =
    "Premium luxury logo design with exquisite details and opulent aesthetics. Features gold or metallic accents, sophisticated color scheme primarily using black, gold, and deep rich colors. Uses refined typography, often with custom letterforms. May incorporate subtle patterns or emblems. Ensures a sense of exclusivity and high-end positioning suitable for luxury brands.";

  const artDecoStyle =
    "Art Deco inspired logo design characterized by geometric symmetry, bold lines, and decorative elements. Features distinctive aesthetic drawing from the 1920s and 30s with strong vertical lines, zigzag forms, and bold geometric patterns. Uses rich colors with metallic accents of gold, silver, or bronze. Perfect for brands seeking to convey glamour and artistic sophistication.";

  const organicStyle =
    "Natural and organic logo design with flowing lines and nature-inspired elements. Features botanical motifs, hand-drawn aesthetics, and earthy color palettes. Avoids rigid geometry in favor of fluid, asymmetrical forms that suggest growth and natural movement. Suitable for eco-friendly brands, wellness products, or businesses connected to nature.";

  const styleLookup: Record<string, string> = {
    flashy: flashyStyle,
    tech: techStyle,
    modern: modernStyle,
    playful: playfulStyle,
    abstract: abstractStyle,
    minimal: minimalStyle,
    elegant: elegantStyle,
    professional: professionalStyle,
    vintage: vintageStyle,
    luxury: luxuryStyle,
    artdeco: artDecoStyle,
    organic: organicStyle,
  };

  // 确保风格名称小写以匹配字典键
  const selectedStyle = data.selectedStyle.toLowerCase();
  const styleDescription = styleLookup[selectedStyle] || modernStyle;

  const prompt = dedent`Create a single iconic logo with high-end professional design quality, award-winning level professional effects. The logo should be suitable for both digital and print media, containing minimal vector graphic elements to ensure clarity and scalability.

  Design Style: ${styleDescription}
  
  Primary Color: ${data.selectedPrimaryColor}
  Background Color: ${data.selectedBackgroundColor}
  Company Name: ${data.companyName}
  
  Please ensure the company name is included in the logo design and harmoniously integrated with graphic elements. The design should be concise and powerful, with memorable uniqueness, maintaining recognizability in different sizes and backgrounds. The logo should reflect the brand personality, be easily identifiable, and remain effective in black and white mode.
  
  ${data.additionalInfo ? `Additional Design Requirements: ${data.additionalInfo}` : ""}
  
  Please avoid overly complex design elements, ensuring the logo design meets modern design standards and can be easily used on websites, social media, business cards, and other brand application scenarios.`;

  try {
    console.log("使用Replicate生成Logo...");
    console.log("配置信息: ", {
      style: data.selectedStyle,
      primaryColor: data.selectedPrimaryColor,
      backgroundColor: data.selectedBackgroundColor,
      width: data.width,
      height: data.height,
      logoCount: data.logoCount, // Log the requested logo count
    });
    
    // 使用Replicate API生成图像 - 替换为更经济的模型
    const model = "black-forest-labs/flux-schnell";
    
    // 根据提供的品牌信息构建提示词
    const basePrompt = `${data.companyName} logo, ${styleDescription}, 
      primary color: ${data.selectedPrimaryColor}, 
      background color: ${data.selectedBackgroundColor}, 
      professional design, high quality, clean lines, vector style
      ${data.additionalInfo ? `Additional details: ${data.additionalInfo}` : ""}`;
    
    console.log(`运行模型: ${model}`);
    console.log(`基础提示词: "${basePrompt.substring(0, 100)}..."`);
    
    // 批量生成多张图片 - 使用用户选择的数量
    const desiredImageCount = data.logoCount; // Use user-selected count
    const batchSize = 1; // 每个请求只能生成1张图片
    const batches = desiredImageCount; // 总批次等于要生成的图片数量
    
    console.log(`将生成 ${desiredImageCount} 张Logo图片，需要发送 ${batches} 个独立请求`);
    
    let allImageUrls: string[] = [];
    
    // 并行发送多个请求，每个请求生成一张图片
    const allPromises = [];
    
    for (let i = 0; i < desiredImageCount; i++) {
      // 为每个请求添加轻微变化，确保生成的图片各不相同
      const uniqueSuffix = [
        ", modern perspective", 
        ", minimalist approach", 
        ", elegant design", 
        ", creative concept", 
        ", bold appearance", 
        ", professional look",
        ", distinctive brand", 
        ", geometric style", 
        ", artistic approach",
        ", dynamic feel",
        ", sleek finish",
        ", premium quality"
      ][i % 12];
      
      const input = {
        prompt: basePrompt + uniqueSuffix,
        seed: Math.floor(Math.random() * 1000000) // 随机种子增加多样性
      };
      
      console.log(`准备生成第 ${i + 1}/${desiredImageCount} 张图片`);
      
      // 创建一个函数来处理单次预测，包括重试逻辑
      const createSinglePrediction = async () => {
        const maxCreateRetries = 3;
        let prediction = null;
        let createError = null;
        
        for (let retry = 0; retry < maxCreateRetries; retry++) {
          try {
            console.log(`尝试创建预测 (图片 ${i + 1}, 尝试 ${retry + 1}/${maxCreateRetries})...`);
            
            // 创建预测
            prediction = await replicate.predictions.create({
              version: model,
              input: input,
              webhook: undefined,
              webhook_events_filter: undefined
            });
            
            if (prediction && prediction.id) {
              console.log(`成功创建预测: ${prediction.id}`);
              break; // 成功创建，跳出循环
            }
          } catch (error) {
            createError = error;
            console.error(`创建预测尝试 ${retry + 1} 失败:`, error);
            
            // 如果是队列满的错误，等待后重试
            if (error instanceof Error && 
                (error.message.includes("Queue is full") || error.message.includes("wait and retry"))) {
              console.log("队列已满，等待后重试...");
              await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒后重试
            } else {
              // 其他错误直接抛出
              break;
            }
          }
        }
        
        if (!prediction) {
          throw new Error(createError instanceof Error 
            ? createError.message 
            : "创建预测失败，请稍后重试");
        }
        
        // 等待预测完成 - flux-schnell更快，可以减少等待时间
        let finalPrediction = prediction;
        let retries = 0;
        const maxRetries = 15;
        const retryInterval = 1500; // 1.5秒检查一次状态
        
        while (
          finalPrediction.status !== "succeeded" && 
          finalPrediction.status !== "failed" &&
          retries < maxRetries
        ) {
          // 暂停执行
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
          
          // 获取预测状态
          try {
            finalPrediction = await replicate.predictions.get(finalPrediction.id);
            retries++;
          } catch (error) {
            console.error("获取预测状态失败:", error);
            retries++;
            
            if (error instanceof Error && error.message.includes("network")) {
              continue;
            }
            
            throw error;
          }
        }
        
        if (retries >= maxRetries && finalPrediction.status !== "succeeded") {
          throw new Error("生成Logo超时，请稍后重试。");
        }
        
        if (finalPrediction.status === "failed") {
          throw new Error(finalPrediction.error || "生成Logo失败，但未提供具体错误原因");
        }
        
        // 处理输出 - 可能是字符串或数组
        let outputUrl = "";
        if (finalPrediction.output) {
          if (Array.isArray(finalPrediction.output)) {
            outputUrl = finalPrediction.output[0];
          } else if (typeof finalPrediction.output === 'string') {
            outputUrl = finalPrediction.output;
          }
        }
        
        if (!outputUrl) {
          throw new Error("预测成功但没有返回有效的图片URL");
        }
        
        // 将Replicate临时URL上传到ImgBB以获取永久URL
        console.log(`将Replicate临时URL上传到ImgBB: ${outputUrl}`);
        let permanentUrl = outputUrl;
        
        try {
          // 检查是否配置了ImgBB API密钥
          if (process.env.IMGBB_API_KEY) {
            // 上传到ImgBB
            const imgbbUrl = await uploadToImgBB(outputUrl);
            
            if (imgbbUrl) {
              console.log(`成功上传到ImgBB，永久URL: ${imgbbUrl}`);
              
              // 存储URL映射到Redis
              if (process.env.UPSTASH_REDIS_REST_URL) {
                await storeLogoUrlMapping(outputUrl, imgbbUrl);
              }
              
              permanentUrl = imgbbUrl;
            } else {
              console.warn("上传到ImgBB失败，将使用原始Replicate URL");
            }
          } else {
            console.warn("未配置IMGBB_API_KEY，无法上传到ImgBB获取永久URL");
          }
        } catch (error) {
          console.error("处理永久URL时出错:", error);
        }
        
        return permanentUrl;
      };
      
      // 将这个请求添加到Promise数组
      allPromises.push(createSinglePrediction());
    }
    
    // 等待所有请求完成，收集所有成功生成的图片
    const results = await Promise.allSettled(allPromises);
    
    // 筛选成功的结果
    const successfulUrls = results
      .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
      .map(result => result.value);
    
    // 记录失败数量
    const failedCount = results.filter(result => result.status === 'rejected').length;
    if (failedCount > 0) {
      console.log(`共有 ${failedCount} 张图片生成失败`);
    }
    
    // 添加所有成功的图片URL
    allImageUrls = [...allImageUrls, ...successfulUrls];
    console.log(`成功生成 ${allImageUrls.length}/${desiredImageCount} 张图片`);
    
    // 检查是否至少生成了一张图片
    if (allImageUrls.length === 0) {
      return new Response(
        "未能成功生成任何Logo图片，请稍后重试。",
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }
    
    // 为URLs添加时间戳以防止缓存问题
    const timestampedUrls = allImageUrls.map(url => {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}t=${Date.now()}`;
    });
    
    console.log(`最终返回 ${timestampedUrls.length} 张Logo图片!`);
    
    // 如果用户已登录，将生成的Logo保存到历史记录
    if (user) {
      try {
        // 保存第一张Logo到用户历史记录
        const mainLogoUrl = timestampedUrls[0];
        
        // 调用保存Logo的API
        const saveResponse = await fetch(new URL('/api/user-logos', req.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyName: data.companyName,
            style: data.selectedStyle,
            primaryColor: data.selectedPrimaryColor,
            backgroundColor: data.selectedBackgroundColor,
            imageUrl: mainLogoUrl,
            liked: false
          }),
        });
        
        if (!saveResponse.ok) {
          console.error("保存Logo到历史记录失败:", await saveResponse.text());
        } else {
          console.log("成功保存Logo到用户历史记录");
        }
      } catch (error) {
        console.error("保存Logo到历史记录时出错:", error);
        // 不阻止API返回成功生成的图片
      }
    }
    
    return new Response(
      JSON.stringify({
        display_urls: timestampedUrls,
        company_name: data.companyName,
        style: data.selectedStyle,
        primary_color: data.selectedPrimaryColor,
        background_color: data.selectedBackgroundColor,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("生成Logo时发生错误:", error);
    
    // 构建错误消息
    let errorMessage = "生成Logo时发生未知错误";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // 检查是否是超时错误
      if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
        statusCode = 504; // Gateway Timeout
        errorMessage = "生成Logo请求超时，请稍后重试。";
      }
      
      // 检查是否是队列满错误
      if (errorMessage.includes("Queue is full") || errorMessage.includes("wait and retry")) {
        statusCode = 503; // Service Unavailable
        errorMessage = "Replicate服务暂时繁忙，请等待几分钟后再试。";
      }
    }
    
    return new Response(
      errorMessage,
      {
        status: statusCode,
        headers: { "Content-Type": "text/plain" },
      }
    );
  }
}

export const runtime = "edge";
