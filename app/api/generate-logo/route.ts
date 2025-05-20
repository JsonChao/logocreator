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
    "专业级别的Logo设计，引人注目，大胆创新，未来感十足，令人印象深刻。使用鲜艳的霓虹色彩，配以金属质感、光泽和闪亮的点缀效果。确保文字清晰可辨，适合品牌在各种媒体上使用。设计要简洁有力，避免过于复杂的元素。";

  const techStyle =
    "高度精细的科技风格Logo，锐利清晰，具有电影感和照片级真实感。极简主义设计，干净流畅，采用中性色调配以微妙的强调色，纯净的线条，适当的阴影，扁平化设计。确保Logo在小尺寸下仍然清晰可辨，适合科技公司使用。";

  const modernStyle =
    "现代前卫的Logo设计，采用扁平化设计风格，几何形状，简洁线条，自然色彩搭配微妙的点缀色。巧妙利用负空间创造视觉趣味。设计要简约而不简单，传达品牌的前瞻性和创新精神。确保设计可在各种尺寸和媒介中保持一致性。";

  const playfulStyle =
    "充满活力的俏皮Logo，使用明亮大胆的色彩，圆润的形状，活泼的设计元素。设计应该引人微笑，具有亲和力和趣味性，同时保持专业水准。适合面向年轻受众或创意行业的品牌。确保字体选择与整体风格协调一致。";

  const abstractStyle =
    "抽象艺术风格的Logo，富有创意，使用独特的形状、图案和纹理创造视觉上引人入胜的设计。设计要大胆创新且有辨识度，能够传达品牌的独特个性。抽象元素应当与品牌名称巧妙融合，形成和谐的整体。";

  const minimalStyle =
    "极简主义Logo设计，简约、永恒、多用途。采用单色设计，巧妙利用负空间，扁平设计风格，细节极少。轻盈、柔和、微妙的视觉效果。确保设计在极简的同时仍具有品牌辨识度，可在各种背景和场景中使用。关注字体的精确排版。";

  const vintageStyle =
    "复古风格Logo，带有经典怀旧感，使用做旧纹理，传承灵感设计，呈现年代感，采用柔和的复古色调。设计应当唤起特定时代的美感，同时满足现代使用需求。字体选择要符合复古主题，可考虑使用衬线字体。";

  const corporateStyle =
    "专业的企业级Logo设计，商务风格，整洁，结构化，保守配色方案，传达信任感和稳定性。设计要正式且专业，适合商业环境使用。字体要选择大气规范的无衬线字体，整体布局要平衡且易于识别。确保在各种应用场景中均可保持专业形象。";

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

  const prompt = dedent`创建一个单一的标志性Logo，高端专业的设计品质，荣获设计大奖级别的专业效果。该Logo应同时适用于数字媒体和印刷媒体，包含少量矢量图形元素以确保清晰度和可扩展性。

  设计风格: ${styleLookup[data.selectedStyle]}
  
  主色调: ${data.selectedPrimaryColor}
  背景色: ${data.selectedBackgroundColor}
  公司名称: ${data.companyName}
  
  请确保Logo设计中包含公司名称，并让名称与图形元素和谐融合。设计要简洁有力，具有令人难忘的独特性，在不同尺寸和背景下都能保持辨识度。Logo应当反映品牌个性，易于识别，并且在黑白模式下仍然有效。
  
  ${data.additionalInfo ? `额外设计要求: ${data.additionalInfo}` : ""}
  
  请避免过度复杂的设计元素，确保Logo设计符合现代设计标准，可轻松用于网站、社交媒体、名片和其他品牌应用场景。`;

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
    let imageUrl: string | null = null;
    console.log("Output type:", typeof finalPrediction.output);
    
    // 检查输出是否有效并提取图像URL
    if (finalPrediction.output) {
      if (Array.isArray(finalPrediction.output) && finalPrediction.output.length > 0) {
        // 处理数组输出
        imageUrl = finalPrediction.output[0];
      } else if (typeof finalPrediction.output === 'string' && finalPrediction.output.startsWith('http')) {
        // 处理字符串URL输出
        imageUrl = finalPrediction.output;
      }
    }
    
    if (!imageUrl) {
      console.error("Invalid prediction output:", finalPrediction.output);
      return new Response(
        "Failed to generate image. No valid image URL received from AI model.",
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
          image_url: imageUrl, 
          display_url: imageUrl,
          is_temporary: true 
        }, { status: 200 });
      }
      
      console.log("正在上传图片到ImgBB...");
      console.log("使用ImgBB API密钥前4位:", imgbbApiKey.substring(0, 4) + "...");
      
      // 尝试获取图像数据 - 增加重试机制
      const maxFetchRetries = 3;
      let imageBlob = null;
      
      for (let i = 0; i < maxFetchRetries; i++) {
        try {
          console.log(`尝试获取图像 (${i+1}/${maxFetchRetries})...`);
          const imageController = new AbortController();
          const imageTimeoutId = setTimeout(() => imageController.abort(), 30000); // 增加到30秒
          
          const imageResponse = await fetch(imageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            signal: imageController.signal
          });
          
          clearTimeout(imageTimeoutId);
          
          if (!imageResponse.ok) {
            console.error(`获取图像尝试 ${i+1} 失败: ${imageResponse.status}`);
            continue;
          }
          
          // 将图像转换为Blob
          imageBlob = await imageResponse.blob();
          break; // 成功获取图像，跳出循环
        } catch (fetchError) {
          console.error(`获取图像尝试 ${i+1} 失败: `, fetchError);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 失败后等待2秒再重试
        }
      }
      
      if (!imageBlob) {
        console.error(`无法获取Replicate图像，最终状态码: unknown`);
        return Response.json({ 
          image_url: imageUrl, 
          display_url: imageUrl,
          is_temporary: true,
          error: "Could not download the generated image"
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
          formData.append('image', imageBlob);
          
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
          
          const imgbbData = await imgbbResponse.json();
          console.log("ImgBB上传成功，获取到永久URL");
          
          // 返回成功响应
          return Response.json({
            image_url: imageUrl, // 原始Replicate URL
            display_url: imgbbData.data.url, // 永久URL
            backup_url: imgbbData.data.thumb.url, // 缩略图URL
            original_url: imgbbData.data.image.url, // 原始上传图像URL
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
        image_url: imageUrl, 
        display_url: imageUrl, 
        is_temporary: true,
        error: "All attempts to upload to ImgBB failed"
      }, { status: 200 });
      
    } catch (imgbbError) {
      console.error("ImgBB处理过程中发生错误:", imgbbError);
      
      // 返回带有原始URL的响应
      return Response.json({ 
        image_url: imageUrl, 
        display_url: imageUrl, 
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
    console.error("Error generating image:", error);
    if (error instanceof Error) {
      return new Response(
        `Error generating logo: ${error.message}`,
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }

    return new Response(
      "An unexpected error occurred while generating the logo.",
      {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      }
    );
  }
}

export const runtime = "edge";
