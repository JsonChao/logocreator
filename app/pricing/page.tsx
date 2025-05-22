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
    
    // TODO: Implement payment logic
    router.push("/create");
  };
  
  const plans = [
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
      ]
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
      popular: true
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
      ]
    }
  ];
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        {/* Title section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Create More Logos with Our AI Tool
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose a plan that fits your needs and generate unique logos. Whether you're just starting out or need regular creations, our flexible offerings will easily meet your branding requirements.
          </p>
        </motion.div>
        
        {/* Pricing cards container */}
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
                  <span className="text-white font-semibold">Most Popular</span>
                </div>
              )}
              
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-600">{plan.name}</h3>
                  <div className="text-5xl font-bold mt-2">{plan.price}</div>
                  <div className="text-xl font-bold text-gray-700 mt-2">{plan.tokens} TOKENS</div>
                </div>
                
                <Button
                  onClick={() => handlePurchase(plan.name)}
                  className={`w-full py-6 text-lg font-bold rounded-xl ${
                    plan.popular 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {isSignedIn ? "Purchase" : "Sign in to Purchase"}
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
        
        {/* FAQ section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">What are Tokens?</h3>
              <p className="text-gray-300">Tokens are the basic units used for generating logos on our platform. Each logo generation consumes one token. After purchasing a plan, you can use these tokens to generate logos according to your needs.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Do Tokens expire?</h3>
              <p className="text-gray-300">No, your purchased tokens never expire and can be used at any time.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">How can I get more Tokens?</h3>
              <p className="text-gray-300">You can purchase any plan at any time to get more tokens. We also occasionally offer promotions - follow us to stay updated on the latest offers.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Do you offer refunds?</h3>
              <p className="text-gray-300">As a digital product, we don't offer refunds. You can try our free version first to understand the basic features before purchasing. We are committed to providing high-quality service to ensure your investment is worthwhile.</p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
} 