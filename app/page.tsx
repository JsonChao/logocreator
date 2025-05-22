"use client";

import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Button } from "./components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Check, Download, Star, Zap, Clock, Layout, Palette, Shield, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

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
      text: "As someone working in the creative field, I was skeptical about AI-generated logos. I am completely won over now. The quality and uniqueness of the designs are remarkable."
    },
  ];
  
  // 自动切换评价
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
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
      name: "BASIC PLAN",
      price: "US$4.99",
      tokens: 100,
      description: "Perfect for first-time logo creation with no need for bulk generation",
      idealFor: "Ideal for exploring AI logo creation without bulk generation needs",
      features: [
        "Generate standard resolution logos",
        "Export without watermarks",
        "PNG and JPG format downloads",
        "Basic style selection"
      ],
      cta: "Purchase",
      ctaAction: navigateToCreate,
      highlight: false
    },
    {
      name: "INTERMEDIATE PLAN",
      price: "US$15.99",
      tokens: 350,
      description: "More generations for regular users",
      idealFor: "Perfect for users who need to create logos frequently",
      features: [
        "Generate high-resolution logos",
        "Export without watermarks",
        "PNG, JPG and SVG format downloads",
        "More style options",
        "Priority generation queue"
      ],
      cta: "Purchase",
      ctaAction: navigateToPricing,
      highlight: true
    },
    {
      name: "ADVANCED PLAN",
      price: "US$34.99",
      tokens: 900,
      description: "Maximum generation capacity for professional users",
      idealFor: "Designed for professionals who need bulk logo creation",
      features: [
        "Generate ultra-high resolution logos",
        "Export without watermarks",
        "All format downloads",
        "All styles and features",
        "Highest priority generation queue",
        "Batch generation capability"
      ],
      cta: "Purchase",
      ctaAction: navigateToPricing,
      highlight: false
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 overflow-hidden">
          <FloatingElements />
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  使用 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">AI</span> 创建精美Logo
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  通过人工智能在几秒钟内生成专业级别的Logo设计，完全自定义且高质量
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
                      开始创建Logo
                    </Button>
                  </Link>
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
            
            {/* ... rest of the code ... */}
          </div>
        </section>
        
        {/* ... rest of the sections ... */}
      </main>
      
      <Footer />
    </div>
  );
}
