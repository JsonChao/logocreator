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
  const data = z
    .object({
      companyName: z.string(),
      // selectedLayout: z.string(),
      selectedStyle: z.string(),
      selectedPrimaryColor: z.string(),
      selectedBackgroundColor: z.string(),
      additionalInfo: z.string().optional(),
      width: z.number().default(768),
      height: z.number().default(768),
    })
    .parse(json);

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
      console.error("Failed to initialize rate limiting:", error);
    }
  }

  // 检查是否配置了Replicate API令牌
  if (!process.env.REPLICATE_API_TOKEN) {
    return new Response(
      "Missing Replicate API token. Please set REPLICATE_API_TOKEN environment variable.",
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
  let remainingCredits = 0;
  if (hasClerkConfig && user && ratelimit) {
    try {
    const identifier = user.id;
    const { success, remaining } = await ratelimit.limit(identifier);
      remainingCredits = remaining;
      
      console.log(`用户 ${user.id} 已应用速率限制，剩余Credits: ${remaining}`);
      
      try {
        await (await clerkClient()).users.updateUserMetadata(user.id, {
      unsafeMetadata: {
        remaining,
      },
    });
        console.log(`已更新用户 ${user.id} 的元数据，剩余Credits: ${remaining}`);
      } catch (error) {
        console.error("Failed to update user remaining:", error);
      }

    if (!success) {
      return new Response(
          "You've used up all your credits.",
        {
          status: 429,
          headers: { "Content-Type": "text/plain" },
        },
      );
      }
    } catch (error) {
      console.error("Rate limiting error:", error);
      // 继续处理而不是失败，让用户至少能使用服务
    }
  }

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

  const vintageStyle =
    "Retro style logo with classic nostalgic feel, using aged textures, heritage-inspired design, vintage aesthetics, and soft retro color schemes. Design should evoke the beauty of a specific era while meeting modern usage requirements. Font choices should align with the vintage theme, considering serif fonts.";

  const corporateStyle =
    "Professional corporate logo design, business style, neat, structured, with a conservative color scheme conveying trust and stability. Design should be formal and professional, suitable for business environments. Fonts should be bold and standardized sans-serif, with overall layout balanced and easily recognizable. Ensures professional image is maintained across various application scenarios.";

  const styleLookup: Record<string, string> = {
    Flashy: flashyStyle,
    Tech: techStyle,
    Modern: modernStyle,
    Playful: playfulStyle,
    Abstract: abstractStyle,
    Minimal: minimalStyle,
    Vintage: vintageStyle,
    Corporate: corporateStyle,
  };

  const prompt = dedent`Create a single iconic logo with high-end professional design quality, award-winning level professional effects. The logo should be suitable for both digital and print media, containing minimal vector graphic elements to ensure clarity and scalability.

  Design Style: ${styleLookup[data.selectedStyle]}
  
  Primary Color: ${data.selectedPrimaryColor}
  Background Color: ${data.selectedBackgroundColor}
  Company Name: ${data.companyName}
  
  Please ensure the company name is included in the logo design and harmoniously integrated with graphic elements. The design should be concise and powerful, with memorable uniqueness, maintaining recognizability in different sizes and backgrounds. The logo should reflect the brand personality, be easily identifiable, and remain effective in black and white mode.
  
  ${data.additionalInfo ? `Additional Design Requirements: ${data.additionalInfo}` : ""}
  
  Please avoid overly complex design elements, ensuring the logo design meets modern design standards and can be easily used on websites, social media, business cards, and other brand application scenarios.`;

  try {
    console.log("Generating logo with Replicate...");
    console.log("配置信息: ", {
      style: data.selectedStyle,
      primaryColor: data.selectedPrimaryColor,
      backgroundColor: data.selectedBackgroundColor,
      width: data.width,
      height: data.height,
    });
    
    // 使用Replicate API生成图像
    const model = "black-forest-labs/flux-1.1-pro";
    const input = {
      prompt: prompt,
      prompt_upsampling: true,  // 优化提示词
      width: data.width,
      height: data.height,
      num_outputs: 18,  // 修改为生成18张图片
    };
    
    console.log(`Running model: ${model} with prompt: "${prompt.substring(0, 100)}..."`);
    
    // 创建预测
    const prediction = await replicate.predictions.create({
      version: model,
      input: input
    });
    
    console.log("Prediction created:", prediction.id);
    
    // 等待预测完成
    let finalPrediction = prediction;
    let retries = 0;
    const predictionMaxRetries = 60; // 最多尝试60次，大约10分钟
    
    while (
      finalPrediction.status !== "succeeded" && 
      finalPrediction.status !== "failed" && 
      finalPrediction.status !== "canceled" && 
      retries < predictionMaxRetries
    ) {
      console.log(`Waiting for prediction (${retries+1}/${predictionMaxRetries}), current status: ${finalPrediction.status}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 每2秒检查一次
      finalPrediction = await replicate.predictions.get(prediction.id);
      retries++;
    }
    
    if (finalPrediction.status === "failed" || finalPrediction.status === "canceled") {
      console.error("Prediction failed or canceled:", finalPrediction);
      return new Response(
        `Image generation failed: ${finalPrediction.error || "Unknown error"}`,
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }
    
    if (retries >= predictionMaxRetries) {
      console.error("Prediction timed out after multiple retries");
      return new Response(
        "Image generation timed out. Please try again later.",
        {
          status: 504,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }
    
    console.log("Prediction completed successfully, status:", finalPrediction.status);
    
    // 处理输出 - 可能是字符串URL或URL数组
    let imageUrls: string[] = [];
    console.log("Output type:", typeof finalPrediction.output);
    
    // 检查输出是否有效并提取图像URL
    if (finalPrediction.output) {
      if (Array.isArray(finalPrediction.output)) {
        // 处理数组输出
        imageUrls = finalPrediction.output;
      } else if (typeof finalPrediction.output === 'string' && finalPrediction.output.startsWith('http')) {
        // 处理单个字符串URL输出
        imageUrls = [finalPrediction.output];
      }
    }
    
    if (imageUrls.length === 0) {
      console.error("Invalid prediction output:", finalPrediction.output);
      return new Response(
        "Failed to generate images. No valid image URLs received from AI model.",
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }
    
    // 确保在成功生成图像后更新用户Credits
    if (hasClerkConfig && user && ratelimit) {
      try {
        // 再次获取用户最新Credits
        const currentUserData = await (await clerkClient()).users.getUser(user.id);
        const currentRemaining = currentUserData.unsafeMetadata?.remaining;
        
        console.log(`生成后检查：用户 ${user.id} 当前Credits: ${currentRemaining}`);
        
        // 如果Credits没有更新，强制更新
        if (typeof currentRemaining === 'number' && currentRemaining > remainingCredits) {
          await (await clerkClient()).users.updateUserMetadata(user.id, {
            unsafeMetadata: {
              remaining: remainingCredits,
            },
          });
          console.log(`强制更新用户Credits到 ${remainingCredits}`);
        }
      } catch (updateError) {
        console.error("更新用户Credits失败:", updateError);
      }
    }
    
    // 上传到ImgBB获取永久链接
    try {
      // 获取环境变量中的ImgBB API密钥
      const imgbbApiKey = process.env.IMGBB_API_KEY;
      
      if (!imgbbApiKey) {
        console.warn("未找到ImgBB API密钥，将直接返回Replicate URL");
        return Response.json({ 
          image_urls: imageUrls,
          display_urls: imageUrls,
          is_temporary: true 
        }, { status: 200 });
      }
      
      console.log("正在上传图片到ImgBB...");
      console.log("使用ImgBB API密钥前4位:", imgbbApiKey.substring(0, 4) + "...");
      
      // 尝试获取图像数据 - 增加重试机制
      const imageBlobs = await Promise.all(
        imageUrls.map(async (url) => {
          const response = await fetch(url);
          return response.blob();
        })
      );
      
      if (imageBlobs.length === 0) {
        console.error(`无法获取Replicate图像，最终状态码: unknown`);
        return Response.json({ 
          image_urls: imageUrls,
          display_urls: imageUrls,
          is_temporary: true,
          error: "Could not download the generated images"
        }, { status: 200 });
      }
      
      // 尝试上传到ImgBB - 增加重试机制
      const maxUploadRetries = 3;
      
      for (let i = 0; i < maxUploadRetries; i++) {
        try {
          console.log(`尝试上传到ImgBB (${i+1}/${maxUploadRetries})...`);
          
          // 创建FormData用于上传
          const formData = new FormData();
          formData.append('key', imgbbApiKey);
          for (let j = 0; j < imageBlobs.length; j++) {
            formData.append('image', imageBlobs[j]);
          }
          
          // 上传到ImgBB
          const imgbbController = new AbortController();
          const imgbbTimeoutId = setTimeout(() => imgbbController.abort(), 30000); // 增加到30秒
          
          const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
            signal: imgbbController.signal
          });
          
          clearTimeout(imgbbTimeoutId);
          
          if (!imgbbResponse.ok) {
            console.error(`ImgBB上传尝试 ${i+1} 失败: ${imgbbResponse.status}`);
            continue;
          }
          
          interface ImgbbResponse {
            data: {
              url: string;
              delete_url: string;
            };
            success: boolean;
            status: number;
          }

          const imgbbData = await imgbbResponse.json() as ImgbbResponse;
          console.log("ImgBB上传成功，获取到永久URL");
          
          // 确保返回的URL是数组格式
          const permanentUrl = imgbbData.data.url;
          const displayUrls = Array.isArray(permanentUrl) ? permanentUrl : [permanentUrl];
          
          // 返回成功响应
          return Response.json({
            image_urls: imageUrls,
            display_urls: displayUrls, // 确保始终是数组格式
            backup_urls: imgbbData.data.delete_url,
            original_urls: imageUrls,
            is_temporary: false
          }, { status: 200 });
        } catch (uploadError) {
          console.error(`ImgBB上传尝试 ${i+1} 失败: `, uploadError);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 失败后等待2秒再重试
        }
      }
      
      // 如果所有上传尝试都失败，则返回临时URL
      console.error("所有ImgBB上传尝试都失败，返回临时URL");
      return Response.json({ 
        image_urls: imageUrls,
        display_urls: imageUrls,
        is_temporary: true,
        error: "All attempts to upload to ImgBB failed"
      }, { status: 200 });
      
    } catch (imgbbError) {
      console.error("ImgBB处理过程中发生错误:", imgbbError);
      
      // 返回带有原始URL的响应
      return Response.json({ 
        image_urls: imageUrls,
        display_urls: imageUrls,
        is_temporary: true,
        error: "Error processing ImgBB upload"
      }, { status: 200 });
    }
    
  } catch (error) {
    // 处理API密钥错误
    if (error instanceof Error && error.message.includes("Authentication error")) {
      console.error("Authentication error with Replicate:", error.message);
      return new Response("Invalid Replicate API configuration.", {
        status: 401,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // 处理其他可能的错误
    console.error("Error generating images:", error);
    if (error instanceof Error) {
      return new Response(
        `Error generating logos: ${error.message}`,
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }

    return new Response(
      "An unexpected error occurred while generating the logos.",
      {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      }
    );
  }
}

export const runtime = "edge";
