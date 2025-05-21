"use client";

import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  
  const handlePurchase = (plan: string) => {
    console.log(`Purchase plan: ${plan}`);
    // Add actual purchase logic or redirect to checkout page
  };
  
  const handleDownload = () => {
    console.log("Download free version");
    // Add download logic or redirect to create page
    router.push("/create");
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Dynamic gradient background */}
      <div 
        className="fixed inset-0 -z-10 opacity-80 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 animate-gradient-x" 
        style={{ animationDuration: "20s" }}
      />
      <div className="fixed inset-0 -z-5 bg-[url('/noise.svg')] opacity-5"></div>
      
      {/* Page content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="mb-16 text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">Logo Package</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Select the perfect option for your brand needs with our one-time payment plans
              </p>
            </motion.div>
          </div>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {/* Free plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-white/90 mb-2">Free</h3>
                <div className="text-4xl font-bold text-white mb-1">$0</div>
                <div className="text-white/70 text-sm mb-4">Free forever</div>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
                <div className="mt-4 text-sm text-white/60">
                  For basic usage
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Design editing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Basic resolution</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Transparent PNG</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <span className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex items-center justify-center text-lg">-</span>
                    <span className="text-sm text-white/80">Vector files</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <span className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex items-center justify-center text-lg">-</span>
                    <span className="text-sm text-white/80">Brand identity</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Basic plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-white/90 mb-2">Basic</h3>
                <div className="text-4xl font-bold text-white mb-1">$29</div>
                <div className="text-white/70 text-sm mb-4">One-time payment</div>
                <Button 
                  onClick={() => handlePurchase('basic')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full border-none"
                >
                  Choose
                </Button>
                <div className="mt-4 text-sm text-white/60">
                  For personal projects
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Design editing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">800 x 600px resolution</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Transparent PNG</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <span className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex items-center justify-center text-lg">-</span>
                    <span className="text-sm text-white/80">Vector files</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <span className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex items-center justify-center text-lg">-</span>
                    <span className="text-sm text-white/80">Brand identity</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Premium plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 hover:border-white/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 z-10 lg:scale-105"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-2 text-center">
                <span className="text-sm font-medium text-white">Most Popular</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-1">$59</div>
                <div className="text-white/70 text-sm mb-4">One-time payment</div>
                <Button 
                  onClick={() => handlePurchase('pro')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Choose
                </Button>
                <div className="mt-4 text-sm text-white/70">
                  For professionals
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/90">Design editing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/90">High resolution</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/90">Transparent PNG</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/90">Vector files</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/90">Brand identity</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/90">Logo models</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <span className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex items-center justify-center text-lg">-</span>
                    <span className="text-sm text-white/90">Logo animation</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Brand plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-white/90 mb-2">Brand</h3>
                <div className="text-4xl font-bold text-white mb-1">$99</div>
                <div className="text-white/70 text-sm mb-4">One-time payment</div>
                <Button 
                  onClick={() => handlePurchase('brand')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white rounded-full border-none"
                >
                  Choose
                </Button>
                <div className="mt-4 text-sm text-white/60">
                  Complete branding solution
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Design editing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">High resolution</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Transparent PNG</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Vector files</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Brand identity</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Logo models</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Logo animation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Business cards</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span className="text-sm text-white/80">Brand presentation</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
          {/* Service commitment */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-20 max-w-3xl mx-auto text-center"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Our Commitment</h2>
              <p className="text-white/80 mb-6">
                As a digital product, we do not offer refunds. You can try our free version to fully experience the product&apos;s basic features before purchasing.
                We&apos;re committed to providing high-quality service to ensure your investment is worthwhile.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Secure Payment</h3>
                  <p className="text-xs text-white/70">Encrypted processing of all payment information</p>
                </div>
                
                <div className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Instant Access</h3>
                  <p className="text-xs text-white/70">Get full feature access immediately after payment</p>
                </div>
                
                <div className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Technical Support</h3>
                  <p className="text-xs text-white/70">Access to technical assistance and guidance</p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
} 