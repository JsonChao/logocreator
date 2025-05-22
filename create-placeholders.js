const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 要创建的预览场景图片
const scenes = [
  { name: 'business-card', width: 1000, height: 670, color: '#f8f9fa', text: '名片背景' },
  { name: 'tshirt', width: 1000, height: 800, color: '#e9ecef', text: 'T恤背景' },
  { name: 'coffee-cup', width: 1000, height: 800, color: '#dee2e6', text: '咖啡杯背景' },
  { name: 'shopping-bag', width: 1000, height: 800, color: '#ced4da', text: '购物袋背景' },
  { name: 'billboard', width: 1200, height: 800, color: '#adb5bd', text: '广告牌背景' },
  { name: 'signage', width: 1000, height: 800, color: '#6c757d', text: '门牌背景' },
  { name: 'website', width: 1200, height: 800, color: '#495057', text: '网站背景' },
];

// 确保目录存在
const outputDir = path.join(__dirname, 'public', 'preview-scenes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 创建每个场景的图片
scenes.forEach(scene => {
  console.log(`创建场景: ${scene.name}`);
  
  // 创建画布
  const canvas = createCanvas(scene.width, scene.height);
  const ctx = canvas.getContext('2d');
  
  // 填充背景
  ctx.fillStyle = scene.color;
  ctx.fillRect(0, 0, scene.width, scene.height);
  
  // 添加文字
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(scene.text, scene.width / 2, scene.height / 2);
  
  // 添加边框线条，表示这是一个占位图
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 10;
  ctx.strokeRect(50, 50, scene.width - 100, scene.height - 100);
  
  // 保存为JPEG文件
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(outputDir, `${scene.name}.jpg`), buffer);
  
  console.log(`✅ 已创建: ${scene.name}.jpg`);
});

console.log('所有预览场景背景图片已创建完成！'); 