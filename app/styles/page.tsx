"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function StylesPage() {
  const router = useRouter();
  const [activeStyle, setActiveStyle] = useState<string | null>(null);

  // 所有可用的Logo样式
  const logoStyles = [
    {
      id: "modern",
      name: "现代",
      description: "干净、简约的设计，适合前沿思维的品牌",
      image: "/modern.svg",
      examples: ["/examples/modern-1.svg", "/examples/modern-2.svg", "/examples/modern-3.svg"],
      features: ["简洁的几何形状", "清晰的线条", "优雅的留白", "易于识别的符号"],
      industries: ["科技", "软件", "设计", "数字媒体", "初创企业"]
    },
    {
      id: "abstract",
      name: "抽象",
      description: "创造性形状和独特的视觉元素",
      image: "/abstract.svg",
      examples: ["/examples/abstract-1.svg", "/examples/abstract-2.svg", "/examples/abstract-3.svg"],
      features: ["独特的形状", "创新的视觉表达", "多层次的含义", "艺术性与商业性平衡"],
      industries: ["创意产业", "艺术机构", "娱乐", "创新技术"]
    },
    {
      id: "tech",
      name: "科技",
      description: "数字化和技术感的设计，适合创新公司",
      image: "/tech.svg",
      examples: ["/examples/tech-1.svg", "/examples/tech-2.svg", "/examples/tech-3.svg"],
      features: ["精确的网格结构", "现代感强", "简洁且功能性", "数字化元素"],
      industries: ["IT", "人工智能", "软件开发", "区块链", "数据科学"]
    },
    {
      id: "minimal",
      name: "极简",
      description: "简单、精致的设计，只保留核心元素",
      image: "/minimal.svg",
      examples: ["/examples/minimal-1.svg", "/examples/minimal-2.svg", "/examples/minimal-3.svg"],
      features: ["简约至上", "大量留白", "字体为主", "细微的细节处理"],
      industries: ["内容创作", "出版", "摄影", "建筑", "咨询服务"]
    },
    {
      id: "playful",
      name: "活泼",
      description: "有趣和充满活力的设计，适合创意或年轻品牌",
      image: "/playful.svg",
      examples: ["/examples/playful-1.svg", "/examples/playful-2.svg", "/examples/playful-3.svg"],
      features: ["鲜艳的色彩", "圆润的形状", "手绘感元素", "动感设计"],
      industries: ["儿童产品", "游戏", "教育", "休闲食品", "社交平台"]
    },
    {
      id: "elegant",
      name: "优雅",
      description: "精致典雅的设计，带有细腻的细节和平衡的比例",
      image: "/elegant.svg",
      examples: ["/examples/elegant-1.svg", "/examples/elegant-2.svg", "/examples/elegant-3.svg"],
      features: ["精致的线条", "平衡的比例", "微妙的色彩", "高端的质感"],
      industries: ["奢侈品", "酒店", "spa", "餐饮", "时尚"]
    },
    {
      id: "professional",
      name: "专业",
      description: "正式且专业的设计，适合商业环境",
      image: "/professional.svg",
      examples: ["/examples/professional-1.svg", "/examples/professional-2.svg", "/examples/professional-3.svg"],
      features: ["结构化的排版", "沉稳的配色", "可信赖的视觉", "简明直接"],
      industries: ["法律", "金融", "咨询", "会计", "保险"]
    },
    {
      id: "flashy",
      name: "炫酷",
      description: "引人注目的大胆设计，使用鲜艳的霓虹色彩",
      image: "/flashy.svg",
      examples: ["/examples/flashy-1.svg", "/examples/flashy-2.svg", "/examples/flashy-3.svg"],
      features: ["大胆的色彩", "强烈的对比", "现代视觉效果", "动态元素"],
      industries: ["夜店", "音乐", "体育", "电子竞技", "活动策划"]
    },
    {
      id: "vintage",
      name: "复古",
      description: "唤起怀旧感和经典美学的设计，带有手工制作的外观",
      image: "/vintage.svg",
      examples: ["/examples/vintage-1.svg", "/examples/vintage-2.svg", "/examples/vintage-3.svg"],
      features: ["复古色彩", "纹理和肌理", "经典排版", "手工制作感"],
      industries: ["咖啡馆", "手工艺品", "古董店", "复古服装", "艺术品"]
    },
    {
      id: "luxury",
      name: "奢华",
      description: "高端豪华设计，带有精致细节和华丽的美学效果",
      image: "/luxury.svg",
      examples: ["/examples/luxury-1.svg", "/examples/luxury-2.svg", "/examples/luxury-3.svg"],
      features: ["金色或金属质感", "对称与平衡", "精致的细节", "独特的字体"],
      industries: ["珠宝", "高级时装", "豪车", "高端房地产", "私人服务"]
    },
    {
      id: "artdeco",
      name: "装饰艺术",
      description: "受20世纪20-30年代启发的设计，几何对称和装饰元素",
      image: "/artdeco.svg",
      examples: ["/examples/artdeco-1.svg", "/examples/artdeco-2.svg", "/examples/artdeco-3.svg"],
      features: ["强烈的几何图案", "对称设计", "华丽的装饰", "精致的工艺"],
      industries: ["艺术画廊", "古典剧院", "高端酒店", "珠宝设计", "文化遗产"]
    },
    {
      id: "organic",
      name: "自然",
      description: "流畅线条和自然元素的设计，适合环保品牌",
      image: "/organic.svg",
      examples: ["/examples/organic-1.svg", "/examples/organic-2.svg", "/examples/organic-3.svg"],
      features: ["自然曲线", "叶子或植物元素", "环保色调", "温和的形状"],
      industries: ["有机食品", "环保产品", "瑜伽中心", "园艺", "健康护理"]
    }
  ];

  const navigateToCreate = () => {
    router.push("/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            探索Logo样式库
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            浏览我们丰富的Logo样式集合，找到最能表达您品牌个性的设计风格
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {logoStyles.map((style) => (
            <motion.div
              key={style.id}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              onClick={() => setActiveStyle(style.id === activeStyle ? null : style.id)}
            >
              <div className="aspect-square relative bg-gray-50">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-contain p-8"
                  unoptimized
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{style.name}风格</h3>
                <p className="text-gray-600 mb-4">{style.description}</p>
                
                <div className={`overflow-hidden transition-all duration-300 ${activeStyle === style.id ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-2">主要特点：</h4>
                    <ul className="list-disc pl-5 text-gray-600 mb-4">
                      {style.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">适合行业：</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {style.industries.map((industry, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {industry}
                        </span>
                      ))}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">风格示例：</h4>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {style.examples.map((example, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={example}
                            alt={`${style.name}风格示例${index + 1}`}
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="mt-4 text-blue-600 hover:text-blue-800 p-0 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStyle(style.id === activeStyle ? null : style.id);
                  }}
                >
                  {activeStyle === style.id ? '收起详情' : '查看详情'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            准备使用您喜欢的风格创建Logo？
          </h2>
          <Button 
            onClick={navigateToCreate}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-medium inline-flex items-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            开始创建您的Logo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 