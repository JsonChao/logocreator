import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dedent from "dedent";
import Replicate from "replicate";
import { z } from "zod";

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

  // 创建Replicate客户端实例
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  // 应用速率限制（仅当配置了Clerk和ratelimit且有用户时）
  let success = true;

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

  const styleLookup: Record<string, string> = {
    flashy: flashyStyle,
    tech: techStyle,
    modern: modernStyle,
    playful: playfulStyle,
    abstract: abstractStyle,
    minimal: minimalStyle,
    elegant: elegantStyle,
    professional: professionalStyle,
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
    const batchSize = Math.min(6, desiredImageCount); // Adjust batch size based on requested count
    const batches = Math.ceil(desiredImageCount / batchSize);
    
    console.log(`将生成 ${desiredImageCount} 张Logo图片，分 ${batches} 批次处理`);
    
    let allImageUrls: string[] = [];
    
    // 按批次并行生成多张图片
    for (let batch = 0; batch < batches; batch++) {
      console.log(`开始生成第${batch + 1}/${batches}批图片...`);
      
      const batchPromises = [];
      for (let i = 0; i < batchSize && (batch * batchSize + i) < desiredImageCount; i++) {
        // 为每个请求添加轻微变化，确保生成的图片各不相同
        const uniqueSuffix = [
          ", modern perspective", 
          ", minimalist approach", 
          ", elegant design", 
          ", creative concept", 
          ", bold appearance", 
          ", professional look"
        ][i % 6];
        
        const input = {
          prompt: basePrompt + uniqueSuffix,
          seed: Math.floor(Math.random() * 1000000) // 随机种子增加多样性
        };
        
        // 创建一个函数来处理单次预测，包括重试逻辑
        const createSinglePrediction = async () => {
          const maxCreateRetries = 3;
          let prediction = null;
          let createError = null;
          
          for (let retry = 0; retry < maxCreateRetries; retry++) {
            try {
              console.log(`尝试创建预测 (批次 ${batch + 1}, 图片 ${i + 1}, 尝试 ${retry + 1}/${maxCreateRetries})...`);
              
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
          
          return outputUrl;
        };
        
        // 添加到批处理数组
        batchPromises.push(createSinglePrediction());
      }
      
      // 等待当前批次的所有请求完成
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        
        // 筛选成功的结果
        const successfulUrls = batchResults
          .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
          .map(result => result.value);
        
        // 记录失败数量
        const failedCount = batchResults.filter(result => result.status === 'rejected').length;
        if (failedCount > 0) {
          console.log(`本批次中有 ${failedCount} 张图片生成失败`);
        }
        
        // 将成功生成的图片URL添加到结果集
        allImageUrls = [...allImageUrls, ...successfulUrls];
        console.log(`批次 ${batch + 1} 完成，当前已成功生成 ${allImageUrls.length} 张图片`);
      } catch (error) {
        console.error(`批次 ${batch + 1} 处理失败:`, error);
      }
      
      // 如果已生成足够多的图片，可以提前退出
      if (allImageUrls.length >= Math.floor(desiredImageCount * 0.75)) {
        // 如果已经生成了至少75%的请求数量，就提前结束
        console.log(`已生成足够数量的图片 (${allImageUrls.length}/${desiredImageCount})，提前结束生成过程`);
        break;
      }
    }
    
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
    
    console.log(`成功生成 ${timestampedUrls.length} 张Logo图片!`);
    
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
