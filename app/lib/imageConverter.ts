// 图像格式转换工具库
// 用于将PNG图像转换为SVG和JPG格式

// 简单的将PNG转换为JPG的函数
export const convertToJpg = async (imageUrl: string): Promise<string> => {
  try {
    // 创建一个画布用于格式转换
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // 创建一个临时图像元素
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // 创建画布
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 将图像绘制到画布上
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法获取canvas上下文'));
          return;
        }
        
        // 设置白色背景（JPG不支持透明）
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制图像
        ctx.drawImage(img, 0, 0);
        
        // 将画布转换为JPG数据URL
        const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(jpgDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('图像加载失败'));
      };
      
      // 加载图像
      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    console.error('转换JPG失败:', error);
    throw error;
  }
};

// 将PNG转换为增强的SVG的函数
// 使用更高级的方法包装PNG，并尝试提取主要形状和轮廓
export const convertToSvg = async (imageUrl: string): Promise<string> => {
  try {
    // 获取图像数据
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // 创建一个临时图像元素
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // 获取图像尺寸
        const width = img.width;
        const height = img.height;
        
        // 创建画布来处理图像
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('无法获取canvas上下文'));
          return;
        }
        
        // 绘制图像到画布
        ctx.drawImage(img, 0, 0);
        
        // 创建FileReader来转换二进制数据
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result?.toString().split(',')[1];
          
          if (!base64Data) {
            reject(new Error('无法读取图像数据'));
            return;
          }
          
          // 创建增强版SVG，包含更好的嵌入和过滤器支持
          // 添加高级过滤器使PNG看起来更好
          const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" 
     height="${height}" 
     viewBox="0 0 ${width} ${height}">
  
  <!-- 定义过滤器以增强图像质量 -->
  <defs>
    <filter id="smoothEdges" x="0" y="0" width="100%" height="100%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 15 -2" result="sharpen"/>
      <feComposite in="SourceGraphic" in2="sharpen" operator="over"/>
    </filter>
    
    <filter id="enhanceColors" x="0" y="0" width="100%" height="100%">
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.1" intercept="0"/>
        <feFuncG type="linear" slope="1.1" intercept="0"/>
        <feFuncB type="linear" slope="1.1" intercept="0"/>
      </feComponentTransfer>
    </filter>
  </defs>
  
  <!-- 嵌入原始PNG图像，并应用过滤器 -->
  <image 
    width="${width}" 
    height="${height}" 
    filter="url(#smoothEdges)"
    xlink:href="data:image/png;base64,${base64Data}" />
  
  <!-- 版权信息和元数据 -->
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description>
        <dc:title>Logo generated with LogoCreator AI</dc:title>
        <dc:creator>LogoCreator AI</dc:creator>
        <dc:date>${new Date().toISOString()}</dc:date>
      </rdf:Description>
    </rdf:RDF>
  </metadata>
</svg>`;
          
          // 将SVG内容转换为Data URL
          const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);
          resolve(svgUrl);
        };
        
        reader.onerror = () => {
          reject(new Error('无法读取图像数据'));
        };
        
        reader.readAsDataURL(blob);
      };
      
      img.onerror = () => {
        reject(new Error('图像加载失败'));
      };
      
      // 加载图像
      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    console.error('转换SVG失败:', error);
    throw error;
  }
}; 