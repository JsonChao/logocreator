// lib/imageStorage.ts
import { Redis } from '@upstash/redis';

// 初始化Redis客户端
const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? Redis.fromEnv() 
  : null;

/**
 * 将图片URL上传到ImgBB
 * @param imageUrl Replicate生成的图片URL
 * @returns 上传成功后的ImgBB URL或null
 */
export async function uploadToImgBB(imageUrl: string): Promise<string | null> {
  try {
    // 检查是否配置了ImgBB API密钥
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error("未配置IMGBB_API_KEY环境变量");
      return null;
    }

    // 从原始URL获取图片数据
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`获取原始图片失败: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    
    // 获取图片Blob
    const imageBlob = await imageResponse.blob();
    
    // 使用Web API的ArrayBuffer
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    // 创建FormData对象
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64Image);
    
    // 可选：添加图片名称
    formData.append('name', `logo_${Date.now()}`);

    // 发送请求到ImgBB
    const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`ImgBB上传失败: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    
    // 检查上传结果
    if (uploadResult.success && uploadResult.data && uploadResult.data.url) {
      console.log("图片成功上传到ImgBB:", uploadResult.data.url);
      return uploadResult.data.url;
    } else {
      console.error("ImgBB上传响应格式不符合预期:", uploadResult);
      return null;
    }
  } catch (error) {
    console.error("上传图片到ImgBB时发生错误:", error);
    return null;
  }
}

/**
 * 存储Logo URL映射到Redis
 * @param replicateUrl Replicate原始URL
 * @param imgbbUrl ImgBB永久URL
 * @returns 操作是否成功
 */
export async function storeLogoUrlMapping(replicateUrl: string, imgbbUrl: string): Promise<boolean> {
  try {
    // 如果Redis未初始化，则返回失败
    if (!redis) {
      console.error("Redis未初始化 - 未提供UPSTASH_REDIS_REST_URL");
      return false;
    }

    // 保存URL映射到Redis
    // 设置过期时间为30天（以秒为单位）
    const expirationTime = 30 * 24 * 60 * 60;
    
    // 创建一个唯一键，使用URL的最后部分作为键的一部分
    const urlParts = replicateUrl.split('/');
    const urlIdentifier = urlParts[urlParts.length - 1].replace(/\?.*$/, '');
    const redisKey = `logo:url:${urlIdentifier}`;

    // 存储映射
    await redis.set(redisKey, imgbbUrl, { ex: expirationTime });
    console.log(`成功存储URL映射到Redis，键: ${redisKey}`);
    
    return true;
  } catch (error) {
    console.error("存储URL映射到Redis时发生错误:", error);
    return false;
  }
}

/**
 * 从Redis获取持久化的Logo URL
 * @param replicateUrl Replicate原始URL
 * @returns ImgBB永久URL或null
 */
export async function getPermanentLogoUrl(replicateUrl: string): Promise<string | null> {
  try {
    // 如果Redis未初始化，则返回null
    if (!redis) {
      console.error("Redis未初始化 - 未提供UPSTASH_REDIS_REST_URL");
      return null;
    }

    // 获取映射键
    const urlParts = replicateUrl.split('/');
    const urlIdentifier = urlParts[urlParts.length - 1].replace(/\?.*$/, '');
    const redisKey = `logo:url:${urlIdentifier}`;

    // 从Redis获取映射
    const imgbbUrl = await redis.get<string>(redisKey);
    
    if (imgbbUrl) {
      console.log(`从Redis获取到映射URL: ${imgbbUrl}`);
      return imgbbUrl;
    }
    
    return null;
  } catch (error) {
    console.error("从Redis获取URL映射时发生错误:", error);
    return null;
  }
}

/**
 * 确保Logo URL是永久的（如果是Replicate URL则转换为ImgBB URL）
 * @param logoUrl 可能是临时的Replicate URL
 * @returns 永久的Logo URL
 */
export async function ensurePermanentLogoUrl(logoUrl: string): Promise<string> {
  // 检查是否为Replicate URL
  if (logoUrl.includes('replicate.delivery')) {
    try {
      // 尝试从Redis获取现有的映射
      let permanentUrl = await getPermanentLogoUrl(logoUrl);
      
      // 如果没有现有映射，则上传到ImgBB并存储映射
      if (!permanentUrl) {
        console.log(`未在Redis中找到映射，正在上传到ImgBB: ${logoUrl}`);
        permanentUrl = await uploadToImgBB(logoUrl);
        
        if (permanentUrl) {
          await storeLogoUrlMapping(logoUrl, permanentUrl);
        } else {
          console.error(`无法上传到ImgBB，将返回原始URL: ${logoUrl}`);
          return logoUrl;
        }
      }
      
      return permanentUrl || logoUrl;
    } catch (error) {
      console.error("处理Logo URL时发生错误:", error);
      return logoUrl;
    }
  }
  
  // 非Replicate URL直接返回
  return logoUrl;
} 