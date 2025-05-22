const fs = require('fs');
const path = require('path');

// 样式列表，包括新添加的样式
const styles = [
  'modern',
  'abstract',
  'tech',
  'minimal',
  'playful',
  'elegant',
  'professional',
  'flashy',
  'vintage',
  'luxury',
  'artdeco',
  'organic'
];

// 样式对应的颜色和描述
const styleConfig = {
  modern: { color: '#3B82F6', color2: '#6366F1', text: '现代' },
  abstract: { color: '#8B5CF6', color2: '#EC4899', text: '抽象' },
  tech: { color: '#10B981', color2: '#3B82F6', text: '科技' },
  minimal: { color: '#6B7280', color2: '#9CA3AF', text: '极简' },
  playful: { color: '#F59E0B', color2: '#EC4899', text: '活泼' },
  elegant: { color: '#8B5CF6', color2: '#6366F1', text: '优雅' },
  professional: { color: '#1E40AF', color2: '#3B82F6', text: '专业' },
  flashy: { color: '#EF4444', color2: '#F59E0B', text: '炫酷' },
  vintage: { color: '#92400E', color2: '#B45309', text: '复古' },
  luxury: { color: '#92400E', color2: '#D4AF37', text: '奢华' },
  artdeco: { color: '#4F46E5', color2: '#EC4899', text: '装饰艺术' },
  organic: { color: '#047857', color2: '#10B981', text: '自然' }
};

// 确保公共目录存在
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// 为每种样式生成一个占位SVG
styles.forEach(style => {
  const config = styleConfig[style];
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="white"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${config.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${config.color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- 样式特定的形状 -->
  ${getStyleSpecificShape(style)}
  <!-- 文本 -->
  <text x="200" y="220" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#333333">${config.text}</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#666666">样式预览</text>
</svg>`;

  fs.writeFileSync(path.join(publicDir, `${style}.svg`), svgContent);
  console.log(`已创建 ${style}.svg`);
});

console.log('所有SVG样式占位图已生成!');

// 为不同样式生成不同的形状
function getStyleSpecificShape(style) {
  const config = styleConfig[style];
  
  switch (style) {
    case 'modern':
      return `<rect x="100" y="80" width="200" height="100" rx="10" fill="url(#grad)"/>`;
    
    case 'abstract':
      return `<path d="M150,80 L250,80 L280,130 L200,180 L120,130 Z" fill="url(#grad)"/>`;
    
    case 'tech':
      return `<circle cx="200" cy="130" r="60" fill="url(#grad)"/>
      <rect x="170" y="100" width="60" height="60" fill="white"/>`;
    
    case 'minimal':
      return `<rect x="120" y="100" width="160" height="60" fill="url(#grad)"/>`;
    
    case 'playful':
      return `<circle cx="170" cy="130" r="40" fill="url(#grad)"/>
      <circle cx="230" cy="130" r="40" fill="url(#grad)"/>`;
    
    case 'elegant':
      return `<path d="M200,80 L230,130 L200,180 L170,130 Z" fill="url(#grad)" stroke="#8B5CF6" stroke-width="2"/>`;
    
    case 'professional':
      return `<rect x="120" y="100" width="160" height="60" fill="url(#grad)"/>
      <rect x="140" y="120" width="120" height="20" fill="white"/>`;
    
    case 'flashy':
      return `<polygon points="200,80 230,110 260,90 240,140 280,170 220,170 200,210 180,170 120,170 160,140 140,90 170,110" fill="url(#grad)"/>`;
    
    case 'vintage':
      return `<circle cx="200" cy="130" r="50" fill="url(#grad)" stroke="#92400E" stroke-width="3" stroke-dasharray="5,3"/>
      <rect x="180" y="110" width="40" height="40" fill="white"/>`;
    
    case 'luxury':
      return `<circle cx="200" cy="130" r="50" fill="url(#grad)" stroke="#D4AF37" stroke-width="3"/>
      <circle cx="200" cy="130" r="35" fill="white" stroke="#D4AF37" stroke-width="1"/>`;
    
    case 'artdeco':
      return `<path d="M150,80 L250,80 L270,130 L250,180 L150,180 L130,130 Z" fill="url(#grad)" stroke="#4F46E5" stroke-width="2"/>
      <rect x="170" y="100" width="60" height="60" fill="white"/>`;
    
    case 'organic':
      return `<path d="M150,90 C180,70 220,70 250,90 C270,110 270,150 250,170 C220,190 180,190 150,170 C130,150 130,110 150,90 Z" fill="url(#grad)"/>`;
    
    default:
      return `<circle cx="200" cy="130" r="50" fill="url(#grad)"/>`;
  }
} 