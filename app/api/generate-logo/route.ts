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
      userAPIKey: z.string().optional(),
      companyName: z.string(),
      // selectedLayout: z.string(),
      selectedStyle: z.string(),
      selectedPrimaryColor: z.string(),
      selectedBackgroundColor: z.string(),
      additionalInfo: z.string().optional(),
    })
    .parse(json);

  // Add rate limiting if Upstash API keys are set & no BYOK, otherwise skip
  // 只在配置了Clerk和Upstash时应用速率限制
  if (hasClerkConfig && process.env.UPSTASH_REDIS_REST_URL && !data.userAPIKey) {
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

  // 创建Replicate客户端实例
  if (!process.env.REPLICATE_API_TOKEN && !data.userAPIKey) {
    return new Response(
      "Missing Replicate API token. Please provide your own API key or set REPLICATE_API_TOKEN environment variable.",
      {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      }
    );
  }

  const replicate = new Replicate({
    auth: data.userAPIKey || process.env.REPLICATE_API_TOKEN,
  });

  // 只在有Clerk配置时更新用户元数据
  if (hasClerkConfig && user && data.userAPIKey) {
    try {
      (await clerkClient()).users.updateUserMetadata(user.id, {
        unsafeMetadata: {
          remaining: "BYOK",
        },
      });
    } catch (error) {
      console.error("Failed to update user metadata:", error);
    }
  }

  // 应用速率限制（仅当配置了Clerk和ratelimit且有用户时）
  if (hasClerkConfig && user && ratelimit) {
    try {
      const identifier = user.id;
      const { success, remaining } = await ratelimit.limit(identifier);
      
      try {
        (await clerkClient()).users.updateUserMetadata(user.id, {
          unsafeMetadata: {
            remaining,
          },
        });
      } catch (error) {
        console.error("Failed to update user remaining:", error);
      }

      if (!success) {
        return new Response(
          "You've used up all your credits. Enter your own Replicate API Key to generate more logos.",
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
    "Flashy, attention grabbing, bold, futuristic, and eye-catching. Use vibrant neon colors with metallic, shiny, and glossy accents.";

  const techStyle =
    "highly detailed, sharp focus, cinematic, photorealistic, Minimalist, clean, sleek, neutral color pallete with subtle accents, clean lines, shadows, and flat.";

  const modernStyle =
    "modern, forward-thinking, flat design, geometric shapes, clean lines, natural colors with subtle accents, use strategic negative space to create visual interest.";

  const playfulStyle =
    "playful, lighthearted, bright bold colors, rounded shapes, lively.";

  const abstractStyle =
    "abstract, artistic, creative, unique shapes, patterns, and textures to create a visually interesting and wild logo.";

  const minimalStyle =
    "minimal, simple, timeless, versatile, single color logo, use negative space, flat design with minimal details, Light, soft, and subtle.";

  const styleLookup: Record<string, string> = {
    Flashy: flashyStyle,
    Tech: techStyle,
    Modern: modernStyle,
    Playful: playfulStyle,
    Abstract: abstractStyle,
    Minimal: minimalStyle,
  };

  const prompt = dedent`A single logo, high-quality, award-winning professional design, made for both digital and print media, only contains a few vector shapes, ${styleLookup[data.selectedStyle]}

  Primary color is ${data.selectedPrimaryColor.toLowerCase()} and background color is ${data.selectedBackgroundColor.toLowerCase()}. The company name is ${data.companyName}, make sure to include the company name in the logo. ${data.additionalInfo ? `Additional info: ${data.additionalInfo}` : ""}`;

  try {
    console.log("Generating logo with Replicate...");
    // 使用Replicate API生成图像
    const model = "black-forest-labs/flux-1.1-pro";
    const input = {
      prompt: prompt,
      prompt_upsampling: true,  // 优化提示词
      width: 768,
      height: 768,
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
    
    console.log("Got image URL:", imageUrl);
    
    // 上传到ImgBB获取永久链接
    try {
      // 获取环境变量中的ImgBB API密钥
      const imgbbApiKey = process.env.IMGBB_API_KEY;
      
      if (!imgbbApiKey) {
        console.warn("未找到ImgBB API密钥，将直接返回Replicate URL");
        return Response.json({ image_url: imageUrl, is_temporary: true }, { status: 200 });
      }
      
      console.log("正在上传图片到ImgBB...");
      
      // 尝试获取图像数据
      const imageController = new AbortController();
      const imageTimeoutId = setTimeout(() => imageController.abort(), 15000);
      
      try {
        const imageResponse = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          signal: imageController.signal
        });
        
        clearTimeout(imageTimeoutId);
        
        if (!imageResponse.ok) {
          console.error(`无法获取Replicate图像: ${imageResponse.status}`);
          return Response.json({ image_url: imageUrl, is_temporary: true }, { status: 200 });
        }
        
        // 将图像转换为Blob
        const imageBlob = await imageResponse.blob();
        
        // 创建FormData用于上传
        const formData = new FormData();
        formData.append('key', imgbbApiKey);
        formData.append('image', imageBlob);
        
        // 上传到ImgBB
        const imgbbController = new AbortController();
        const imgbbTimeoutId = setTimeout(() => imgbbController.abort(), 15000);
        
        const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
          signal: imgbbController.signal
        });
        
        clearTimeout(imgbbTimeoutId);
        
        if (!imgbbResponse.ok) {
          console.error(`ImgBB上传失败: ${imgbbResponse.status}`);
          return Response.json({ image_url: imageUrl, is_temporary: true }, { status: 200 });
        }
        
        const imgbbData = await imgbbResponse.json();
        
        if (imgbbData.success) {
          console.log("图像成功上传到ImgBB:", imgbbData.data.url);
          return Response.json({ 
            image_url: imgbbData.data.url,
            display_url: imgbbData.data.display_url,
            thumb_url: imgbbData.data.thumb.url,
            delete_url: imgbbData.data.delete_url,
            is_temporary: false
          }, { status: 200 });
        } else {
          console.error("ImgBB上传响应错误:", imgbbData);
          return Response.json({ image_url: imageUrl, is_temporary: true }, { status: 200 });
        }
      } catch (fetchError) {
        console.error("获取或上传图像时出错:", fetchError);
        return Response.json({ image_url: imageUrl, is_temporary: true }, { status: 200 });
      }
    } catch (uploadError) {
      console.error("上传到ImgBB时出错:", uploadError);
      // 失败时返回原始Replicate URL
      return Response.json({ image_url: imageUrl, is_temporary: true }, { status: 200 });
    }
  } catch (error) {
    // 处理API密钥错误
    if (error instanceof Error && error.message.includes("Authentication error")) {
      console.error("Authentication error with Replicate:", error.message);
      return new Response("Your API key is invalid.", {
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
