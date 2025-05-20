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

// 将PNG转换为SVG的函数（这里使用简单的占位实现）
// 注意：真实的PNG到SVG转换需要专业的图像矢量化算法，这里仅提供一个简单的实现
export const convertToSvg = async (imageUrl: string): Promise<string> => {
  try {
    // 获取图像数据
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // 创建一个临时图像元素
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // 创建一个简单的SVG包装
        const width = img.width;
        const height = img.height;
        
        // 创建SVG内容，将图像嵌入为base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result?.toString().split(',')[1];
          
          // 创建简单的SVG，嵌入了base64编码的PNG
          const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
              <image width="${width}" height="${height}" href="data:image/png;base64,${base64Data}" />
            </svg>
          `;
          
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