// 测试Replicate API连接的脚本
const Replicate = require('replicate');
const fs = require('fs');
const https = require('https');
const http = require('http');
const url = require('url');

// 全局变量，用于存储生成的图像URL
let generatedImageUrl = null;
let downloadSuccess = false;

async function testReplicateAPI() {
  // 从环境变量获取API令牌
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    console.error('缺少REPLICATE_API_TOKEN环境变量');
    return;
  }
  
  console.log(`使用API令牌: ${apiToken.slice(0, 5)}...`);
  
  // 创建Replicate客户端
  const replicate = new Replicate({
    auth: apiToken,
  });
  
  try {
    // 定义模型和输入参数
    const model = "black-forest-labs/flux-1.1-pro";
    const input = {
      prompt: "A simple red logo with the text 'Test'",
      prompt_upsampling: true,
      width: 512,
      height: 512,
    };
    
    console.log(`测试Replicate API，使用模型: ${model}`);
    console.log("创建预测...");
    
    // 创建预测
    const prediction = await replicate.predictions.create({
      version: model,
      input: input
    });
    
    console.log("✅ 预测创建成功!");
    console.log("预测ID:", prediction.id);
    console.log("初始状态:", prediction.status);
    
    // 轮询等待预测完成
    let finalPrediction = prediction;
    let retries = 0;
    const maxRetries = 30; // 最多尝试30次，大约1分钟
    
    console.log("等待预测完成...");
    
    while (
      finalPrediction.status !== "succeeded" && 
      finalPrediction.status !== "failed" && 
      finalPrediction.status !== "canceled" && 
      retries < maxRetries
    ) {
      process.stdout.write(`.`); // 显示进度指示器
      await new Promise(resolve => setTimeout(resolve, 2000)); // 每2秒检查一次
      finalPrediction = await replicate.predictions.get(prediction.id);
      retries++;
    }
    
    console.log("\n最终状态:", finalPrediction.status);
    
    if (finalPrediction.status === "failed" || finalPrediction.status === "canceled") {
      console.error("❌ 预测失败或被取消");
      console.error("错误:", finalPrediction.error);
      return;
    }
    
    if (retries >= maxRetries) {
      console.error("❌ 预测超时");
      return;
    }
    
    // 处理输出 - 可能是数组或单个字符串
    console.log("输出类型:", typeof finalPrediction.output);
    console.log("原始输出:", finalPrediction.output);
    
    let imageUrl;
    
    // 处理成功的预测结果
    if (finalPrediction.output) {
      if (Array.isArray(finalPrediction.output) && finalPrediction.output.length > 0) {
        // 处理数组输出
        imageUrl = finalPrediction.output[0];
      } else if (typeof finalPrediction.output === 'string' && finalPrediction.output.startsWith('http')) {
        // 处理字符串URL输出
        imageUrl = finalPrediction.output;
      }
      
      if (imageUrl) {
        console.log("✅ 预测完成!");
        console.log("生成的图像URL:", imageUrl);
        generatedImageUrl = imageUrl;
        
        // 使用不同的方法下载图像
        console.log("\n=== 测试不同的图像下载方法 ===");
        
        // 方法1: 使用fetch API
        try {
          console.log("\n1. 测试使用Node Fetch下载...");
          await downloadImageFetch(imageUrl, 'test-logo-fetch.png');
          downloadSuccess = true;
        } catch (fetchError) {
          console.error("❌ Fetch下载失败:", fetchError.message);
        }
        
        // 方法2: 使用http/https模块
        try {
          console.log("\n2. 测试使用http/https模块下载...");
          await downloadImage(imageUrl, 'test-logo-https.png');
          downloadSuccess = true;
        } catch (httpError) {
          console.error("❌ HTTP下载失败:", httpError.message);
        }
        
        if (downloadSuccess) {
          console.log("\n✅ 成功使用至少一种方法下载图像");
        } else {
          console.error("\n❌ 所有下载方法均失败");
          console.log("图像URL可能需要直接在客户端使用，而不是在服务器端下载");
        }
      } else {
        console.error("❌ 在输出中找不到有效的图像URL");
      }
    } else {
      console.error("❌ 没有收到预测输出");
    }
    
    // 获取最近的预测列表
    console.log("\n获取最近的预测...");
    try {
      const recentPredictions = await replicate.predictions.list();
      
      if (Array.isArray(recentPredictions)) {
        console.log(`找到 ${recentPredictions.length} 个最近的预测`);
        
        if (recentPredictions.length > 0) {
          console.log("最近的预测:");
          console.log("- ID:", recentPredictions[0].id);
          console.log("- 状态:", recentPredictions[0].status);
          console.log("- 创建时间:", new Date(recentPredictions[0].created_at).toLocaleString());
        }
      } else {
        console.log("返回的预测:", recentPredictions);
      }
    } catch (listError) {
      console.error("获取预测列表出错:", listError);
    }
    
  } catch (error) {
    console.error("❌ Replicate API测试失败:", error);
    
    if (error.message && error.message.includes("Authentication")) {
      console.error("API密钥似乎无效或已过期");
    }
  }
  
  // 如果我们有URL但无法下载，建议直接在客户端使用URL
  if (generatedImageUrl && !downloadSuccess) {
    console.log("\n=== 建议 ===");
    console.log("由于无法在服务器端下载图像，建议修改API以直接返回图像URL给客户端");
    console.log("将API响应格式修改为: { image_url: '" + generatedImageUrl + "' }");
    console.log("然后在前端使用<img src={response.image_url} />直接显示图像");
  }
}

// 辅助函数：使用fetch下载图像
async function downloadImageFetch(imageUrl, filename) {
  console.log(`使用fetch下载图像: ${imageUrl}`);
  
  try {
    const timeout = 15000; // 15秒超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(imageUrl, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filename, Buffer.from(buffer));
    console.log(`✅ 图像已保存到 ${filename}`);
    return true;
  } catch (error) {
    console.error(`下载失败: ${error.message}`);
    throw error;
  }
}

// 辅助函数：使用http/https模块下载图像
function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    console.log(`使用http/https下载图像: ${imageUrl}`);
    
    const parsedUrl = url.parse(imageUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000 // 15秒超时
    };
    
    const request = protocol.get(options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP错误: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filename);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ 图像已保存到 ${filename}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filename, () => {}); // 删除部分下载的文件
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('请求超时'));
    });
  });
}

testReplicateAPI(); 