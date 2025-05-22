import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Logo设计指南 | LogocraftAI',
  description: '了解如何设计有效的品牌Logo，掌握专业Logo设计技巧和最佳实践。',
};

export default function LogoDesignGuidePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Logo设计指南</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            掌握专业Logo设计的基础知识和技巧，创建令人难忘的品牌标识
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>为什么Logo对品牌至关重要？</h2>
          <p>
            Logo是品牌的视觉核心，是消费者对您公司的第一印象。一个设计良好的Logo能够：
          </p>
          <ul>
            <li>增强品牌识别度，让顾客更容易记住您</li>
            <li>传达公司价值观和个性</li>
            <li>在竞争激烈的市场中脱颖而出</li>
            <li>建立专业和信任感</li>
            <li>在各种媒体和规格上保持一致性</li>
          </ul>

          <h2>Logo设计的五大基本原则</h2>
          
          <h3>1. 简洁性</h3>
          <p>
            最有效的Logo往往是最简单的。简洁的设计更容易被记住，并且能在各种大小和媒介上保持清晰。避免过多的细节和元素，专注于一个核心创意或概念。
          </p>
          
          <h3>2. 可记忆性</h3>
          <p>
            您的Logo应该能够在短暂一瞥后被记住。独特而富有创意的设计会在观众心中留下持久印象，增强品牌认知度。
          </p>
          
          <h3>3. 永恒性</h3>
          <p>
            追求时尚的Logo可能很快就会过时。设计时考虑长期使用，避免过于跟随当前设计趋势，这样您的Logo才能经受时间的考验。
          </p>
          
          <h3>4. 多功能性</h3>
          <p>
            您的Logo需要在多种环境中使用 - 从名片到广告牌，从网站到社交媒体头像。确保它在不同大小、颜色背景和应用场景中都能保持效果。
          </p>
          
          <h3>5. 相关性</h3>
          <p>
            Logo应该反映品牌的性质和价值观。它不一定要字面描述您的业务（例如，苹果公司的logo并不是电脑），但应该能在某种程度上与您的品牌产生共鸣。
          </p>

          <h2>使用LogocraftAI创建专业Logo</h2>
          <p>
            借助LogocraftAI的人工智能技术，您可以轻松应用这些设计原则创建专业Logo。我们的系统理解色彩心理学、字体配对和视觉平衡，帮助您在几分钟内生成符合行业标准的Logo设计。
          </p>
          
          <div className="my-8 text-center">
            <a 
              href="/create" 
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              立即创建您的Logo
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 