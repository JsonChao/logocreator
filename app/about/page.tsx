import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '关于我们 | LogocraftAI',
  description: '了解LogocraftAI的故事、使命和我们如何利用AI技术帮助创业者和企业创建专业品牌标识。',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            让每个品牌都拥有专业Logo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            LogocraftAI致力于利用尖端AI技术，使专业级别的Logo设计变得简单易行且人人可及。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              我们的故事
            </h2>
            <div className="prose prose-lg">
              <p>
                LogocraftAI源于一个简单的观察：创业者和小企业主往往难以获得高质量的Logo设计，而不需要支付高昂的设计费用或掌握复杂的设计软件。
              </p>
              <p>
                2023年，我们的创始团队决定利用最新的AI生成模型，创建一个直观的平台，让每个人都能轻松设计专业的Logo。我们的目标是民主化Logo设计过程，同时保持创意和个性化。
              </p>
              <p>
                今天，LogocraftAI已经帮助数千名企业家和企业创建了独特而专业的品牌标识，我们的使命仍在继续扩展。
              </p>
            </div>
          </div>
          <div className="relative h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
            {/* 在实际项目中，这里应该放置公司照片 */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">公司图片</div>
            {/* <Image
              src="/about/team.jpg"
              alt="LogocraftAI团队"
              fill
              className="object-cover"
            /> */}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            我们的价值观
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">创新</h3>
              <p className="text-gray-600">
                我们不断推动AI设计的边界，将最新技术转化为直观、强大的设计工具。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">包容性</h3>
              <p className="text-gray-600">
                我们相信每个企业，无论规模大小，都应该能够获得高质量的品牌设计资源。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">品质</h3>
              <p className="text-gray-600">
                我们坚持设计的卓越标准，确保我们的用户能够获得专业、现代且独特的Logo。
              </p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            我们的技术
          </h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="prose prose-lg max-w-none">
              <p>
                LogocraftAI结合了多种先进技术，打造无缝的Logo创建体验：
              </p>
              <ul>
                <li>
                  <strong>AI生成模型</strong>：我们使用Replicate API的Flux Pro 1.1模型，这是一种先进的图像生成系统，经过专门微调以创建商业Logo。
                </li>
                <li>
                  <strong>响应式设计工具</strong>：我们的Logo在各种设备和媒体上都能保持清晰锐利，从移动应用到大型广告牌。
                </li>
                <li>
                  <strong>实时编辑</strong>：用户可以即时调整颜色、样式和布局，实时查看更改效果。
                </li>
                <li>
                  <strong>云存储</strong>：所有设计都安全存储，用户可以随时返回编辑或下载。
                </li>
              </ul>
              <p>
                我们的开发团队持续改进和优化这些技术，确保LogocraftAI始终提供业内最先进的Logo设计体验。
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            准备好创建您的Logo了吗？
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            加入成千上万的企业家和品牌经理的行列，使用LogocraftAI创建专业的Logo设计。
          </p>
          <a 
            href="/create" 
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            立即开始设计
          </a>
        </div>
      </div>
    </main>
  );
} 