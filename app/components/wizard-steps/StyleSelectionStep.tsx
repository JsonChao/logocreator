import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

// 定义所有可用的样式
const logoStyles = [
  {
    id: "modern",
    name: "现代",
    description: "干净、简约的设计，适合前沿思维的品牌",
    image: "/modern.svg"
  },
  {
    id: "abstract",
    name: "抽象",
    description: "创造性形状和独特的视觉元素",
    image: "/abstract.svg"
  },
  {
    id: "tech",
    name: "科技",
    description: "数字化和技术感的设计，适合创新公司",
    image: "/tech.svg"
  },
  {
    id: "minimal",
    name: "极简",
    description: "简单、精致的设计，只保留核心元素",
    image: "/minimal.svg"
  },
  {
    id: "playful",
    name: "活泼",
    description: "有趣和充满活力的设计，适合创意或年轻品牌",
    image: "/playful.svg"
  },
  {
    id: "elegant",
    name: "优雅",
    description: "精致典雅的设计，带有细腻的细节和平衡的比例",
    image: "/elegant.svg"
  },
  {
    id: "professional",
    name: "专业",
    description: "正式且专业的设计，适合商业环境",
    image: "/professional.svg"
  },
  {
    id: "flashy",
    name: "炫酷",
    description: "引人注目的大胆设计，使用鲜艳的霓虹色彩",
    image: "/flashy.svg"
  },
  {
    id: "vintage",
    name: "复古",
    description: "唤起怀旧感和经典美学的设计，带有手工制作的外观",
    image: "/vintage.svg"
  },
  {
    id: "luxury",
    name: "奢华",
    description: "高端豪华设计，带有精致细节和华丽的美学效果",
    image: "/luxury.svg"
  },
  {
    id: "artdeco",
    name: "装饰艺术",
    description: "受20世纪20-30年代启发的设计，几何对称和装饰元素",
    image: "/artdeco.svg"
  },
  {
    id: "organic",
    name: "自然",
    description: "流畅线条和自然元素的设计，适合环保品牌",
    image: "/organic.svg"
  }
];

interface StyleSelectionStepProps {
  style: string;
  onStyleChange: (style: string) => void;
  onBack?: () => void;
}

export function StyleSelectionStep({
  style,
  onStyleChange,
  onBack
}: StyleSelectionStepProps) {
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});

  const handleImageError = (styleId: string) => {
    setImageLoadError(prev => ({
      ...prev,
      [styleId]: true
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-2 rounded-full h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-3xl font-bold tracking-tight">选择Logo风格</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          不同的风格传达不同的品牌个性。选择最能代表您品牌的风格。
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {logoStyles.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300",
              style === item.id 
                ? "border-blue-500 ring-2 ring-blue-200 transform scale-[1.02] shadow-xl" 
                : "border-gray-200 hover:border-blue-300 shadow-md hover:shadow-xl hover:transform hover:scale-[1.02]"
            )}
            onClick={() => onStyleChange(item.id)}
            onMouseEnter={() => setHoveredStyle(item.id)}
            onMouseLeave={() => setHoveredStyle(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
              <div className="flex h-full items-center justify-center p-4">
                {imageLoadError[item.id] ? (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <span className="text-base font-medium">{item.name} Style</span>
                  </div>
                ) : (
                  <Image
                    src={item.image}
                    alt={`${item.name} style logo example`}
                    width={160}
                    height={160}
                    className={cn(
                      "h-36 w-auto object-contain transition-all duration-300",
                      (hoveredStyle === item.id || style === item.id) ? "scale-110" : "group-hover:scale-105"
                    )}
                    unoptimized={true}
                    onError={() => handleImageError(item.id)}
                    priority={true}
                  />
                )}
              </div>
              
              {style === item.id && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md"
                >
                  <CheckIcon className="h-5 w-5" />
                </motion.div>
              )}
            </div>
            
            <div className="relative p-5 border-t border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
            </div>
            
            {style === item.id && (
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
            )}
          </motion.button>
        ))}
      </div>
      
      <div className="mt-12 flex justify-between">
        {onBack && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl px-6 py-5 text-base font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        
        {style && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="ml-auto"
          >
            <Button
              onClick={() => style && onStyleChange(style)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-lg font-medium text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Continue with {logoStyles.find(s => s.id === style)?.name} Style
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 