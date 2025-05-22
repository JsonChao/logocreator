"use client";

import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  
  const handlePurchase = (plan: string) => {
    console.log(`Purchase plan: ${plan}`);
    if (!isSignedIn) return;
    
    // TODO: 实现支付逻辑
    router.push("/create");
  };
  
  const plans = [
    {
      name: "基础套餐",
      nameEn: "BASIC PLAN",
      price: "US$4.99",
      tokens: 100,
      description: "适合初次尝试Logo生成，无需大量生成",
      idealFor: "适合初次探索AI Logo生成，无需大量批量制作",
      features: [
        "生成标准分辨率Logo",
        "无水印导出",
        "PNG和JPG格式下载",
        "基础样式选择"
      ]
    },
    {
      name: "中级套餐",
      nameEn: "INTERMEDIATE PLAN",
      price: "US$15.99",
      tokens: 350,
      description: "更多生成次数，适合经常使用",
      idealFor: "适合需要频繁生成Logo的用户",
      features: [
        "生成高分辨率Logo",
        "无水印导出",
        "PNG、JPG和SVG格式下载",
        "更多样式选择",
        "优先生成队列"
      ],
      popular: true
    },
    {
      name: "高级套餐",
      nameEn: "ADVANCED PLAN",
      price: "US$34.99",
      tokens: 900,
      description: "海量生成次数，适合专业用户",
      idealFor: "适合需要大量生成Logo的专业用户",
      features: [
        "生成超高分辨率Logo",
        "无水印导出",
        "所有格式下载",
        "全部样式和功能",
        "最高优先级生成队列",
        "批量生成功能"
      ]
    }
  ];
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* 标题部分 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            通过我们的AI工具创建更多Logo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            选择适合您的方案，生成独特的Logo。无论您是刚起步还是需要定期创建，我们灵活的产品都能轻松满足您的品牌需求。
          </p>
        </motion.div>
        
        {/* 价格卡片容器 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`rounded-3xl overflow-hidden bg-white ${plan.popular ? 'md:-mt-4 md:mb-4 border-4 border-blue-500' : ''}`}
            >
              {plan.popular && (
                <div className="bg-blue-500 py-2 text-center">
                  <span className="text-white font-semibold">最受欢迎</span>
                </div>
              )}
              
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-600">{plan.nameEn}</h3>
                  <div className="text-5xl font-bold mt-2">{plan.price}</div>
                  <div className="text-xl font-bold text-gray-700 mt-2">{plan.tokens} 个TOKEN</div>
                </div>
                
                <Button
                  onClick={() => handlePurchase(plan.name)}
                  className={`w-full py-6 text-lg font-bold rounded-xl ${
                    plan.popular 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {isSignedIn ? "购买" : "登录后购买"}
                </Button>
                
                <p className="mt-6 text-center text-gray-600">
                  {plan.idealFor}
                </p>
                
                <div className="mt-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* 常见问题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">常见问题</h2>
          
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">什么是Token？</h3>
              <p className="text-gray-300">Token是我们平台中用于生成Logo的基本单位。每生成一个Logo消耗一个Token。购买套餐后，您可以根据自己的需求使用这些Token生成您喜欢的Logo。</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Token有过期时间吗？</h3>
              <p className="text-gray-300">没有，您购买的Token永不过期，可以在任何时间使用。</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">如何获得更多Token？</h3>
              <p className="text-gray-300">您可以随时购买任何套餐获取更多Token。我们也会不定期推出优惠活动，关注我们获取最新信息。</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">是否提供退款？</h3>
              <p className="text-gray-300">作为数字产品，我们不提供退款。您可以先体验免费版本，了解产品的基本功能后再购买。我们致力于提供高质量的服务，确保您的投资值得。</p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
} 