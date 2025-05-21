"use client";

import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Button } from "./components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Check, Download, Star, Zap, Clock, Layout, Palette, Shield, Gift } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // 动态粒子效果 (简化版本)
  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="particle absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>
    );
  };
  
  // 浮动元素
  const FloatingElements = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-circle bg-blue-300/20 w-64 h-64 rounded-full absolute top-1/4 -left-20"></div>
        <div className="floating-circle-reverse bg-purple-300/20 w-96 h-96 rounded-full absolute top-1/3 -right-32"></div>
        <div className="floating-square bg-pink-300/10 w-48 h-48 absolute bottom-1/4 left-1/4 rotate-12"></div>
        <div className="floating-triangle w-0 h-0 absolute bottom-1/3 right-1/4">
          <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-blue-300/20"></div>
        </div>
      </div>
    );
  };
  
  const navigateToCreate = () => {
    router.push("/create");
  };
  
  const navigateToPricing = () => {
    router.push("/pricing");
  };
  
  // 自动切换评价
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Logo样式展示
  const logoStyles = [
    {
      name: "Modern",
      image: "/demo/modern-logo.webp",
      description: "Clean, contemporary designs suitable for forward-thinking brands",
    },
    {
      name: "Abstract",
      image: "/demo/abstract-logo.webp",
      description: "Unique shapes and forms that create distinctive brand identities",
    },
    {
      name: "Tech",
      image: "/demo/tech-logo.webp",
      description: "Digital and technology-focused designs for innovative companies",
    },
    {
      name: "Minimalist",
      image: "/demo/minimal-logo.webp",
      description: "Simple, elegant, and refined designs with essential elements only",
    },
    {
      name: "Playful",
      image: "/demo/playful-logo.webp",
      description: "Fun and energetic designs perfect for creative or youth-oriented brands",
    },
    {
      name: "Luxury",
      image: "/demo/luxury-logo.webp",
      description: "Sophisticated and premium designs conveying exclusivity and quality",
    },
  ];
  
  // 产品特点
  const features = [
    {
      title: "AI-Powered Logo Generation",
      description: "Create professional, unique logos in seconds using our advanced AI algorithm trained on thousands of premium designs",
      icon: <Zap className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Multiple Style Options",
      description: "Choose from various logo styles including modern, abstract, minimal, tech, playful, and luxury to match your brand personality",
      icon: <Layout className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Custom Color Schemes",
      description: "Select your brand colors or let our AI suggest perfect color combinations that evoke the right emotions",
      icon: <Palette className="h-6 w-6 text-pink-500" />,
    },
    {
      title: "Instant Results",
      description: "Generate multiple logo options in under 30 seconds and make unlimited revisions to find your perfect design",
      icon: <Clock className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "High-Resolution Exports",
      description: "Download your finished logo in various formats including PNG, JPG, and SVG for any application from web to print",
      icon: <Download className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Commercial Usage Rights",
      description: "All premium logos come with full commercial usage rights, ensuring legal protection for your business identity",
      icon: <Shield className="h-6 w-6 text-red-500" />,
    },
  ];
  
  // 使用步骤
  const steps = [
    {
      number: "01",
      title: "Enter Your Brand Name",
      description: "Start by telling us your company or project name so our AI can incorporate it into your logo design",
      image: "/steps/step1.webp"
    },
    {
      number: "02",
      title: "Select Style & Colors",
      description: "Choose your preferred logo style and color scheme to match your brand personality and industry",
      image: "/steps/step2.webp"
    },
    {
      number: "03",
      title: "Generate Logo Options",
      description: "Our AI will create multiple unique logo designs based on your preferences in seconds",
      image: "/steps/step3.webp"
    },
    {
      number: "04",
      title: "Customize & Download",
      description: "Fine-tune your favorite design and download in your preferred format, ready to use",
      image: "/steps/step4.webp"
    },
  ];
  
  // 用户评价
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Bloom Tech Startup",
      image: "/testimonials/user1.webp",
      rating: 5,
      text: "The AI logo generator saved me thousands of dollars on design costs. I generated a professional logo for my tech startup in minutes that perfectly captures our brand identity."
    },
    {
      name: "Michael Chen",
      company: "Artisan Bakery",
      image: "/testimonials/user2.webp",
      rating: 5,
      text: "As a small business owner, I needed an affordable logo solution. This tool delivered beyond my expectations with a beautiful design that my customers love!"
    },
    {
      name: "Emma Rodriguez",
      company: "Fitness Coach",
      image: "/testimonials/user3.webp",
      rating: 4,
      text: "I tried several AI logo generators but this one produced the most natural, professional results. The style options really helped me find exactly what I was looking for."
    },
    {
      name: "David Wilson",
      company: "Digital Marketing Agency",
      image: "/testimonials/user4.webp",
      rating: 5,
      text: "As someone working in the creative field, I was skeptical about AI-generated logos. I'm completely won over now. The quality and uniqueness of the designs are remarkable."
    },
  ];
  
  // 常见问题
  const faqs = [
    {
      question: "How does the AI logo generator work?",
      answer: "Our AI logo generator uses advanced machine learning algorithms trained on thousands of professional logo designs. It analyzes design principles, current trends, and your specific inputs to create unique logo options tailored to your brand. Simply enter your company name, select your preferred style and colors, and our AI will generate custom logo designs for you to choose from and customize further."
    },
    {
      question: "Are the logos created truly unique?",
      answer: "Yes, each logo generated by our AI is unique. The system creates original designs based on your inputs rather than modifying existing templates. While designs follow style guidelines you select, the specific execution and combinations of elements are unique to your generation. This ensures your brand stands out with its own distinct identity."
    },
    {
      question: "What file formats can I download my logo in?",
      answer: "The file formats available depend on your subscription plan. Free users can download logos in PNG format with standard resolution. Premium plans provide high-resolution PNG, JPG, and vector SVG files. Vector formats (available in paid plans) allow unlimited scaling without quality loss, making them perfect for printing your logo at any size."
    },
    {
      question: "Do I own full rights to my generated logo?",
      answer: "Yes, you retain full ownership rights to any logo you generate with our service. Free plan logos are royalty-free for personal use. Premium and enterprise plans include complete commercial usage rights with no limitations, allowing you to use your logo for business purposes, trademarking, and merchandising."
    },
    {
      question: "Can I edit my logo after generation?",
      answer: "Absolutely! After generating your initial logo designs, you can make various adjustments including color changes, layout modifications, size adjustments, and text edits. For more advanced customization, we recommend downloading the SVG format (available in paid plans) which can be edited in vector graphics software."
    },
    {
      question: "How does the AI logo generator compare to hiring a professional designer?",
      answer: "While professional designers offer personalized service and deep brand strategy, our AI logo generator provides an affordable, instant alternative with quality results. It's perfect for startups, small businesses, and projects with limited budgets or tight deadlines. Many businesses use our tool for initial concepts or temporary branding before investing in custom design services later."
    },
  ];
  
  // 价格计划简介
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic logo creation for personal projects",
      features: ["Standard resolution", "PNG format", "Limited style options", "Basic customization"],
      cta: "Start Free",
      ctaAction: navigateToCreate,
      highlight: false
    },
    {
      name: "Premium",
      price: "$29",
      description: "Professional logo for small businesses",
      features: ["High resolution", "PNG, JPG, SVG formats", "All style options", "Full customization", "Commercial usage rights"],
      cta: "Get Premium",
      ctaAction: navigateToPricing,
      highlight: true
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "Complete branding solution",
      features: ["Maximum resolution", "All file formats", "Priority generation", "Brand guidelines PDF", "Multiple variations", "Business card design"],
      cta: "View Details",
      ctaAction: navigateToPricing,
      highlight: false
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* 动态背景效果 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
      <Particles />
      <FloatingElements />
      
      {/* 页面内容 */}
      <Header />
      
      {/* 英雄区 */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">AI-Powered Logo Generator</span>
                <br />
                <span className="text-gray-900">Create Stunning Logos in Seconds</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
                Transform your brand with professional, unique logos created by artificial intelligence. No design skills needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={navigateToCreate} 
                  size="lg" 
                  className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full px-8 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Create Your Logo Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  onClick={navigateToPricing} 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 border-2 border-gray-300 hover:border-gray-400 text-gray-700"
                >
                  View Pricing
                </Button>
                  </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <Image src={`/avatars/avatar${i}.webp`} alt="User" width={40} height={40} />
                    </div>
                  ))}
                </div>
                <div className="ml-4 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">4.9/5</span> from 2,000+ reviews
                    </div>
                  </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl rotate-6 scale-95"></div>
                <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden">
                  <Image 
                    src="/hero-generator-preview.webp" 
                    alt="AI Logo Generator in action" 
                    width={600} 
                    height={600} 
                    className="object-cover"
                        />
                      </div>
                <div className="absolute -right-6 -bottom-6 bg-white rounded-xl shadow-lg p-4 max-w-[200px] animate-float">
                  <div className="text-sm font-semibold text-gray-800">AI Generated Logo</div>
                  <div className="text-xs text-gray-500">Created in 22 seconds</div>
                    </div>
                <div className="absolute -left-6 -top-6 bg-white rounded-xl shadow-lg p-3 animate-float-reverse">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* 平台指示器 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-8 opacity-70"
          >
            <div className="text-center text-sm font-medium text-gray-500">TRUSTED BY BUSINESSES WORLDWIDE</div>
            <div className="flex flex-wrap justify-center gap-8 w-full">
              <img src="/brands/brand1.svg" alt="Brand 1" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
              <img src="/brands/brand2.svg" alt="Brand 2" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
              <img src="/brands/brand3.svg" alt="Brand 3" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
              <img src="/brands/brand4.svg" alt="Brand 4" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
              <img src="/brands/brand5.svg" alt="Brand 5" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
              </div>
      </section>

      {/* Logo样式展示区 */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
              Create AI Logos in Any Style
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from various design styles to match your brand personality and industry
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {logoStyles.map((style, index) => (
              <motion.div
                key={style.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="h-48 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
                  <Image
                    src={style.image} 
                    alt={`${style.name} logo style`}
                    width={160}
                    height={160}
                    className="object-contain h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{style.name}</h3>
                  <p className="text-gray-600">{style.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
                    <Button
              onClick={navigateToCreate}
                      size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full px-8 py-6 text-lg font-medium shadow-xl shadow-blue-600/20 group"
                    >
              <span className="relative z-10 flex items-center">
                Try Our AI Logo Generator <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
                    </Button>
          </div>
        </div>
      </section>

      {/* 特性展示区 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
              Advanced AI Logo Generation Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional tools to help you create the perfect logo for your brand
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col p-6 bg-white rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-lg border border-gray-100"
              >
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-sm w-14 h-14 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
              </motion.div>
            ))}
              </div>
        </div>
      </section>
      
      {/* 工作原理 */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              How Our AI Logo Generator Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create your perfect logo in four simple steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full">
                  {step.number}
                </div>
                <div className="h-40 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={120}
                    height={120}
                    className="object-contain h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 价格区域预览 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-violet-700">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your logo design needs
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${
                  plan.highlight ? 'border-blue-200 scale-105 relative z-10' : 'border-gray-100'
                }`}
              >
                {plan.highlight && (
                  <div className="bg-gradient-to-r from-blue-600 to-violet-600 py-2 text-center">
                    <span className="text-sm font-medium text-white">Most Popular</span>
                  </div>
                )}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-2">{plan.price}</div>
                  <p className="text-sm text-gray-600 mb-6">{plan.description}</p>
                  <Button
                    onClick={plan.ctaAction}
                    className={`w-full ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white'
                        : 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800'
                    } rounded-full`}
                  >
                    {plan.cta}
                    </Button>
                </div>
                <div className="p-6 border-t border-gray-100">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
                    <Button
              onClick={navigateToPricing}
              variant="outline"
              size="lg"
              className="rounded-full px-8 border-2 border-gray-300 hover:border-gray-400 text-gray-700"
            >
              Compare All Features
                    </Button>
          </div>
        </div>
      </section>
      
      {/* 用户评价 */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Thousands of businesses trust our AI logo generator
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-xl p-8 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-100 mr-4">
                    <Image
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      width={64}
                      height={64}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{testimonials[currentTestimonial].name}</h3>
                    <p className="text-gray-600">{testimonials[currentTestimonial].company}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonials[currentTestimonial].rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg italic">"{testimonials[currentTestimonial].text}"</p>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    i === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ区 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about our AI logo generator
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="py-6"
              >
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 行动召唤 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Create Your Perfect Logo?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of businesses using our AI logo generator to create professional brand identities in minutes
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={navigateToCreate}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 text-lg font-medium"
              >
                Create Your Logo Now
              </Button>
              <Button
                onClick={navigateToPricing}
                size="lg"
                className="bg-transparent border-2 border-white/50 hover:border-white text-white rounded-full px-8 text-lg font-medium"
              >
                View Pricing Plans
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center text-white/80">
              <Gift className="h-5 w-5 mr-2" />
              <span>No credit card required for free plan</span>
            </div>
          </motion.div>
      </div>
      </section>
      
      <Footer />
      
      {/* 自定义滚动条和文字选择样式在globals.css中 */}
    </div>
  );
}
