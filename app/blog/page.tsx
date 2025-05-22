import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '博客 | LogocraftAI',
  description: '发现Logo设计、品牌策略和视觉营销的最新趋势、技巧和最佳实践。',
};

// 博客文章类型定义
type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  readTime: string;
  category: string;
};

export default function BlogPage() {
  // 模拟博客文章数据
  const blogPosts: BlogPost[] = [
    {
      id: 'logo-design-trends-2023',
      title: '2023年Logo设计趋势：简约风格持续流行',
      excerpt: '探索今年主导设计界的最新Logo趋势，从极简主义到色彩渐变，了解品牌如何适应不断变化的视觉语言。',
      coverImage: '/blog/logo-trends.jpg',
      date: '2023-10-15',
      readTime: '6分钟',
      category: '设计趋势'
    },
    {
      id: 'ai-logo-design',
      title: 'AI如何革新Logo设计过程',
      excerpt: '人工智能正在改变设计师的工作方式。了解AI工具如何补充人类创造力，简化设计流程，并为品牌带来新的可能性。',
      coverImage: '/blog/ai-design.jpg',
      date: '2023-09-28',
      readTime: '8分钟',
      category: 'AI技术'
    },
    {
      id: 'logo-psychology',
      title: 'Logo设计中的心理学：形状与感知',
      excerpt: '深入探讨不同形状如何影响消费者对品牌的感知，以及如何利用这些心理原理创建更有效的Logo。',
      coverImage: '/blog/logo-psychology.jpg',
      date: '2023-09-12',
      readTime: '7分钟',
      category: '设计心理学'
    },
    {
      id: 'rebranding-success',
      title: '成功品牌重塑的5个案例研究',
      excerpt: '分析五个知名品牌如何通过Logo和品牌视觉形象的重新设计成功实现品牌转型，以及我们能从中学到什么。',
      coverImage: '/blog/rebranding.jpg',
      date: '2023-08-25',
      readTime: '10分钟',
      category: '案例研究'
    },
    {
      id: 'logo-versatility',
      title: '如何设计适应各种媒介的多功能Logo',
      excerpt: '从社交媒体头像到大型广告牌，了解如何创建在各种大小和背景下都能保持效果的灵活Logo设计。',
      coverImage: '/blog/versatile-logo.jpg',
      date: '2023-08-10',
      readTime: '5分钟',
      category: '设计技巧'
    },
    {
      id: 'color-theory',
      title: 'Logo设计中的色彩理论基础',
      excerpt: '掌握色彩心理学和色彩组合的基本原则，学习如何选择能有效传达品牌信息的颜色方案。',
      coverImage: '/blog/color-theory.jpg',
      date: '2023-07-22',
      readTime: '9分钟',
      category: '色彩理论'
    }
  ];

  // 格式化日期函数
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">LogocraftAI博客</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            探索Logo设计、品牌策略和视觉营销的最新见解和专业知识
          </p>
        </div>

        {/* 分类导航 */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            全部
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
            设计趋势
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
            AI技术
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
            设计技巧
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
            案例研究
          </button>
        </div>

        {/* 博客文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">图片加载中</span>
                </div>
                {/* 注意：在实际项目中，确保这些图片文件存在 */}
                {/* <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                /> */}
              </div>
              <div className="p-5">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{formatDate(post.date)}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                  <span className="mx-2">•</span>
                  <span className="text-blue-600">{post.category}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.id}`} className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  阅读更多
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* 分页 */}
        <div className="flex justify-center mt-12">
          <nav className="inline-flex rounded-md shadow">
            <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-l-md">
              上一页
            </a>
            <a href="#" className="py-2 px-4 bg-blue-600 text-white font-medium border border-blue-600">
              1
            </a>
            <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
              3
            </a>
            <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-r-md">
              下一页
            </a>
          </nav>
        </div>
      </div>
    </main>
  );
} 