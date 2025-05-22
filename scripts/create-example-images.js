const fs = require('fs');
const path = require('path');

// 样式列表
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

// 每种样式的颜色配置
const styleConfig = {
  modern: { color: '#3B82F6', color2: '#6366F1', text: 'Modern Co' },
  abstract: { color: '#8B5CF6', color2: '#EC4899', text: 'Abstract Inc' },
  tech: { color: '#10B981', color2: '#3B82F6', text: 'TechLabs' },
  minimal: { color: '#6B7280', color2: '#9CA3AF', text: 'Minimal' },
  playful: { color: '#F59E0B', color2: '#EC4899', text: 'PlayFun' },
  elegant: { color: '#8B5CF6', color2: '#6366F1', text: 'Elegance' },
  professional: { color: '#1E40AF', color2: '#3B82F6', text: 'ProCorp' },
  flashy: { color: '#EF4444', color2: '#F59E0B', text: 'FlashBrand' },
  vintage: { color: '#92400E', color2: '#B45309', text: 'Est. 1920' },
  luxury: { color: '#92400E', color2: '#D4AF37', text: 'Luxe' },
  artdeco: { color: '#4F46E5', color2: '#EC4899', text: 'ArtDeco' },
  organic: { color: '#047857', color2: '#10B981', text: 'Organica' }
};

// 确保examples目录存在
const examplesDir = path.join(__dirname, '..', 'public', 'examples');
if (!fs.existsSync(examplesDir)) {
  fs.mkdirSync(examplesDir, { recursive: true });
}

// 为每种样式生成3个示例图像
styles.forEach(style => {
  const config = styleConfig[style];
  
  for (let i = 1; i <= 3; i++) {
    // 为每个样式生成不同的示例变体
    const svgContent = generateSvgForStyle(style, config, i);
    
    const fileName = `${style}-${i}.svg`;
    fs.writeFileSync(path.join(examplesDir, fileName), svgContent);
    console.log(`已创建 ${fileName}`);
  }
});

console.log('所有示例Logo已生成!');

// 根据样式和变体生成SVG内容
function generateSvgForStyle(style, config, variant) {
  const baseSize = 400;
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${baseSize}" viewBox="0 0 ${baseSize} ${baseSize}">
    <rect width="${baseSize}" height="${baseSize}" fill="white"/>
    
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${config.color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${config.color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- 特定于样式和变体的内容 -->
    ${getStyleSpecificShape(style, config, variant)}
    
    <!-- 品牌名称 -->
    <text x="200" y="250" font-family="Arial, sans-serif" font-size="${style === 'minimal' ? '24' : '20'}" 
          font-weight="bold" text-anchor="middle" 
          fill="${style === 'minimal' ? config.color : '#333'}">${config.text}</text>
  </svg>`;
  
  return svgContent;
}

// 为不同风格和变体生成形状
function getStyleSpecificShape(style, config, variant) {
  switch (style) {
    case 'modern':
      if (variant === 1) {
        return `<rect x="100" y="80" width="200" height="100" rx="10" fill="url(#grad)"/>`;
      } else if (variant === 2) {
        return `<circle cx="200" cy="130" r="80" fill="url(#grad)"/>`;
      } else {
        return `<polygon points="120,80 280,80 240,180 160,180" fill="url(#grad)"/>`;
      }
      
    case 'abstract':
      if (variant === 1) {
        return `<path d="M150,80 L250,80 L280,130 L200,180 L120,130 Z" fill="url(#grad)"/>`;
      } else if (variant === 2) {
        return `<path d="M200,60 C250,60 280,100 280,150 C280,200 250,240 200,240 C150,240 120,200 120,150 C120,100 150,60 200,60 Z" fill="url(#grad)"/>`;
      } else {
        return `<path d="M120,90 L200,60 L280,90 L250,190 L150,190 Z" fill="url(#grad)"/>`;
      }
      
    case 'tech':
      if (variant === 1) {
        return `<circle cx="200" cy="130" r="60" fill="url(#grad)"/>
                <rect x="170" y="100" width="60" height="60" fill="white"/>`;
      } else if (variant === 2) {
        return `<polygon points="140,80 260,80 260,130 200,180 140,130" fill="url(#grad)"/>`;
      } else {
        return `<rect x="120" y="90" width="160" height="80" fill="url(#grad)"/>
                <circle cx="200" cy="130" r="30" fill="white"/>`;
      }
      
    case 'minimal':
      if (variant === 1) {
        return `<rect x="120" y="100" width="160" height="60" fill="url(#grad)"/>`;
      } else if (variant === 2) {
        return `<circle cx="200" cy="130" r="60" fill="url(#grad)"/>`;
      } else {
        return `<line x1="120" y1="130" x2="280" y2="130" stroke="url(#grad)" stroke-width="15"/>`;
      }
      
    // 其他样式的形状生成...
    case 'playful':
      if (variant === 1) {
        return `<circle cx="170" cy="130" r="40" fill="url(#grad)"/>
                <circle cx="230" cy="130" r="40" fill="url(#grad)"/>`;
      } else if (variant === 2) {
        return `<path d="M150,90 C200,40 240,90 250,130 C260,170 220,190 200,190 C180,190 140,170 150,130 Z" fill="url(#grad)"/>`;
      } else {
        return `<circle cx="180" cy="110" r="35" fill="${config.color}"/>
                <circle cx="220" cy="110" r="35" fill="${config.color2}"/>
                <circle cx="200" cy="150" r="35" fill="url(#grad)"/>`;
      }
      
    case 'elegant':
      if (variant === 1) {
        return `<path d="M200,80 L230,130 L200,180 L170,130 Z" fill="url(#grad)" stroke="#8B5CF6" stroke-width="2"/>`;
      } else if (variant === 2) {
        return `<ellipse cx="200" cy="130" rx="80" ry="50" fill="url(#grad)" stroke="#8B5CF6" stroke-width="2"/>`;
      } else {
        return `<path d="M150,90 C200,70 250,90 250,130 C250,170 200,190 150,170 Z" fill="url(#grad)" stroke="#8B5CF6" stroke-width="2"/>`;
      }
      
    case 'professional':
      if (variant === 1) {
        return `<rect x="120" y="100" width="160" height="60" fill="url(#grad)"/>
                <rect x="140" y="120" width="120" height="20" fill="white"/>`;
      } else if (variant === 2) {
        return `<circle cx="200" cy="130" r="60" fill="url(#grad)"/>
                <rect x="180" y="110" width="40" height="40" fill="white"/>`;
      } else {
        return `<polygon points="120,100 280,100 250,160 150,160" fill="url(#grad)"/>
                <rect x="170" y="120" width="60" height="20" fill="white"/>`;
      }
      
    case 'flashy':
      if (variant === 1) {
        return `<polygon points="200,80 230,110 260,90 240,140 280,170 220,170 200,210 180,170 120,170 160,140 140,90 170,110" fill="url(#grad)"/>`;
      } else if (variant === 2) {
        return `<path d="M140,90 L260,90 L260,170 L200,190 L140,170 Z" fill="url(#grad)"/>
                <path d="M170,90 L230,90 L210,170 L190,170 Z" fill="white"/>`;
      } else {
        return `<circle cx="200" cy="130" r="70" fill="url(#grad)"/>
                <polygon points="170,100 230,100 230,160 200,180 170,160" fill="white"/>`;
      }
      
    case 'vintage':
      if (variant === 1) {
        return `<circle cx="200" cy="130" r="50" fill="url(#grad)" stroke="#92400E" stroke-width="3" stroke-dasharray="5,3"/>
                <rect x="180" y="110" width="40" height="40" fill="white"/>`;
      } else if (variant === 2) {
        return `<polygon points="150,90 250,90 230,170 170,170" fill="url(#grad)" stroke="#92400E" stroke-width="3" stroke-dasharray="5,3"/>`;
      } else {
        return `<ellipse cx="200" cy="130" rx="70" ry="50" fill="url(#grad)" stroke="#92400E" stroke-width="3" stroke-dasharray="5,3"/>`;
      }
      
    case 'luxury':
      if (variant === 1) {
        return `<circle cx="200" cy="130" r="50" fill="url(#grad)" stroke="#D4AF37" stroke-width="3"/>
                <circle cx="200" cy="130" r="35" fill="white" stroke="#D4AF37" stroke-width="1"/>`;
      } else if (variant === 2) {
        return `<polygon points="150,90 250,90 280,130 250,170 150,170 120,130" fill="url(#grad)" stroke="#D4AF37" stroke-width="3"/>`;
      } else {
        return `<rect x="150" y="90" width="100" height="80" rx="10" fill="url(#grad)" stroke="#D4AF37" stroke-width="3"/>`;
      }
      
    case 'artdeco':
      if (variant === 1) {
        return `<path d="M150,80 L250,80 L270,130 L250,180 L150,180 L130,130 Z" fill="url(#grad)" stroke="#4F46E5" stroke-width="2"/>
                <rect x="170" y="100" width="60" height="60" fill="white"/>`;
      } else if (variant === 2) {
        return `<circle cx="200" cy="130" r="60" fill="url(#grad)" stroke="#4F46E5" stroke-width="2"/>
                <polygon points="180,100 220,100 220,160 200,180 180,160" fill="white"/>`;
      } else {
        return `<rect x="130" y="80" width="140" height="100" rx="5" fill="url(#grad)" stroke="#4F46E5" stroke-width="2"/>
                <rect x="150" y="100" width="100" height="60" fill="white" stroke="#4F46E5" stroke-width="1"/>`;
      }
      
    case 'organic':
      if (variant === 1) {
        return `<path d="M150,90 C180,70 220,70 250,90 C270,110 270,150 250,170 C220,190 180,190 150,170 C130,150 130,110 150,90 Z" fill="url(#grad)"/>`;
      } else if (variant === 2) {
        return `<path d="M140,100 C180,80 220,90 260,120 C280,150 260,180 220,190 C180,200 130,180 120,140 C110,100 140,100 140,100 Z" fill="url(#grad)"/>`;
      } else {
        return `<path d="M170,70 C200,60 230,70 250,100 C270,130 270,160 240,180 C210,200 180,190 150,170 C120,150 120,110 140,90 C160,70 170,70 170,70 Z" fill="url(#grad)"/>`;
      }
      
    default:
      return `<circle cx="200" cy="130" r="50" fill="url(#grad)"/>`;
  }
} 