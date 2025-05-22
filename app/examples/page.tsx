import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Logo Examples | LogocraftAI',
  description: '查看由LogocraftAI生成的精彩Logo示例，激发您自己的logo创意。',
};

const LogoExample = ({ 
  src, 
  alt, 
  style 
}: { 
  src: string; 
  alt: string; 
  style: string;
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="p-4 bg-gray-50 aspect-square flex items-center justify-center">
      <Image 
        src={src} 
        alt={alt} 
        width={300} 
        height={300} 
        className="object-contain" 
      />
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-900">{alt}</h3>
      <p className="text-sm text-gray-500 mt-1">{style}风格</p>
    </div>
  </div>
);

export default function ExamplesPage() {
  // 在实际项目中，这些数据可能来自API或CMS
  const examples = [
    { src: '/examples/logo1.png', alt: 'Tech公司Logo', style: '科技' },
    { src: '/examples/logo2.png', alt: 'Food品牌Logo', style: '现代' },
    { src: '/examples/logo3.png', alt: 'Creative工作室Logo', style: '创意' },
    { src: '/examples/logo4.png', alt: 'Fitness应用Logo', style: '活力' },
    { src: '/examples/logo5.png', alt: 'Fashion品牌Logo', style: '时尚' },
    { src: '/examples/logo6.png', alt: 'Finance公司Logo', style: '专业' },
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Logo示例展示</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            查看由LogocraftAI生成的各种风格Logo示例，帮助您找到适合自己品牌的灵感。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {examples.map((example, index) => (
            <LogoExample 
              key={index}
              src={example.src}
              alt={example.alt}
              style={example.style}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">想要创建您自己的专属Logo？</p>
          <a 
            href="/create" 
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            立即创建您的Logo
          </a>
        </div>
      </div>
    </main>
  );
} 