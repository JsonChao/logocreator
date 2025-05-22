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
  
  // Dynamic particle effect (simplified version)
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
  
  // Floating elements
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
  
  // User testimonials
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
  
  // Auto-switch testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Logo style showcase
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
  
  // Product features
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
  
  // Usage steps
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
  
  // Frequently asked questions
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
  
  // Pricing plans overview
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">AI-Powered Logo Generator</span>
                  <br />
                  <span className="text-gray-900">Create Stunning Logos in Seconds</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
                  Transform your brand with professional, unique logos created by artificial intelligence. No design skills needed.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
                      Start Creating
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
          
            {/* Platform indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-16 max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-8 opacity-70"
            >
              <div className="text-center text-sm font-medium text-gray-500">TRUSTED BY BUSINESSES WORLDWIDE</div>
              <div className="flex flex-wrap justify-center gap-8 w-full">
                <Image src="/brands/brand1.svg" alt="Brand 1" width={32} height={32} className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/brands/brand2.svg" alt="Brand 2" width={32} height={32} className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/brands/brand3.svg" alt="Brand 3" width={32} height={32} className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/brands/brand4.svg" alt="Brand 4" width={32} height={32} className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/brands/brand5.svg" alt="Brand 5" width={32} height={32} className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Logo Style Showcase */}
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

        {/* Features Section */}
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
      
        {/* How It Works */}
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
      
        {/* Pricing Preview */}
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
                Create More Logos with Our AI Tool
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose a plan that fits your needs and generate unique logos. Whether you're just starting out or need regular creations, our flexible offerings will easily meet your branding requirements.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex flex-col p-6 rounded-xl ${
                    plan.highlight 
                      ? 'bg-gradient-to-br from-blue-600 to-violet-700 text-white ring-2 ring-blue-600 ring-offset-2' 
                      : 'bg-white border border-gray-200'
                  } hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-lg`}
                >
                  <div className={`${plan.highlight ? 'text-blue-100' : 'text-blue-500'} text-sm font-semibold mb-4`}>
                    {plan.name}
                  </div>
                  <div className="flex items-baseline">
                    <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                  </div>
                  <div className={`flex items-center mt-2 mb-4 ${plan.highlight ? 'text-blue-100' : 'text-blue-700'}`}>
                    <Gift className="h-4 w-4 mr-1" />
                    <span className="text-sm">{plan.tokens} tokens included</span>
                  </div>
                  <p className={`text-sm mb-6 ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className="flex-grow">
                    <p className={`text-xs mb-3 ${plan.highlight ? 'text-white' : 'text-gray-700'} font-medium`}>
                      {plan.idealFor}
                    </p>
                    <ul className="space-y-2 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-blue-500'}`} />
                          <span className={`text-sm ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={plan.ctaAction}
                    className={`w-full py-2 ${
                      plan.highlight 
                        ? 'bg-white text-blue-600 hover:bg-blue-50' 
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
