import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: 'Blog | LogocraftAI',
  description: 'Discover the latest trends, tips, and best practices in logo design, brand strategy, and visual marketing.',
};

// Blog post type definition
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
  // Mock blog post data
  const blogPosts: BlogPost[] = [
    {
      id: 'logo-design-trends-2023',
      title: '2023 Logo Design Trends: Minimalist Style Continues to Dominate',
      excerpt: 'Explore the latest logo trends dominating the design world this year, from minimalism to color gradients, and learn how brands are adapting to evolving visual language.',
      coverImage: '/blog/logo-trends.jpg',
      date: '2023-10-15',
      readTime: '6 min',
      category: 'Design Trends'
    },
    {
      id: 'ai-logo-design',
      title: 'How AI is Revolutionizing the Logo Design Process',
      excerpt: 'Artificial intelligence is changing how designers work. Learn how AI tools complement human creativity, streamline design processes, and open new possibilities for brands.',
      coverImage: '/blog/ai-design.jpg',
      date: '2023-09-28',
      readTime: '8 min',
      category: 'AI Technology'
    },
    {
      id: 'logo-psychology',
      title: 'The Psychology of Logo Design: Shapes and Perception',
      excerpt: 'Dive deep into how different shapes influence consumer perception of brands and how to leverage these psychological principles to create more effective logos.',
      coverImage: '/blog/logo-psychology.jpg',
      date: '2023-09-12',
      readTime: '7 min',
      category: 'Design Psychology'
    },
    {
      id: 'rebranding-success',
      title: '5 Case Studies of Successful Rebranding',
      excerpt: 'Analyze how five well-known brands successfully transformed through logo and visual identity redesigns, and what we can learn from their approaches.',
      coverImage: '/blog/rebranding.jpg',
      date: '2023-08-25',
      readTime: '10 min',
      category: 'Case Studies'
    },
    {
      id: 'logo-versatility',
      title: 'How to Design Versatile Logos for Various Media',
      excerpt: 'From social media avatars to large billboards, learn how to create flexible logo designs that remain effective across different sizes and backgrounds.',
      coverImage: '/blog/versatile-logo.jpg',
      date: '2023-08-10',
      readTime: '5 min',
      category: 'Design Tips'
    },
    {
      id: 'color-theory',
      title: 'Fundamentals of Color Theory in Logo Design',
      excerpt: 'Master the basic principles of color psychology and color combinations, learning how to choose color schemes that effectively communicate your brand message.',
      coverImage: '/blog/color-theory.jpg',
      date: '2023-07-22',
      readTime: '9 min',
      category: 'Color Theory'
    }
  ];

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-12 pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">LogocraftAI Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the latest insights and expertise in logo design, brand strategy, and visual marketing
            </p>
          </div>

          {/* Category navigation */}
          <div className="flex justify-center flex-wrap gap-2 mb-10">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              All
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              Design Trends
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              AI Technology
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              Design Tips
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              Case Studies
            </button>
          </div>

          {/* Blog post list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Loading image</span>
                  </div>
                  {/* Note: In a real project, ensure these image files exist */}
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
                    Read More
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-l-md">
                Previous
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
                Next
              </a>
            </nav>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 