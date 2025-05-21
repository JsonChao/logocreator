"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PlatformIndicator from "./PlatformIndicator";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  
  const navigateToCreate = () => {
    router.push("/create");
  };
  
  return (
    <div className="relative overflow-hidden py-20 md:py-28">
      {/* Enhanced dynamic background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-40 -right-40 h-[500px] rounded-full bg-gradient-to-r from-blue-500/30 via-purple-600/30 to-pink-600/30 blur-3xl transform -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 -left-40 -right-40 h-[300px] rounded-full bg-gradient-to-r from-emerald-400/30 via-blue-500/30 to-indigo-600/30 blur-3xl transform translate-y-1/3 animate-pulse-slow" style={{ animationDuration: "15s" }}></div>
        
        {/* Additional floating decorative elements */}
        <div className="absolute top-1/4 left-1/4 h-36 w-36 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl animate-float" style={{ animationDuration: "13s" }}></div>
        <div className="absolute top-2/3 right-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-2xl animate-float-reverse" style={{ animationDuration: "17s" }}></div>
        <div className="absolute bottom-1/3 left-1/3 h-48 w-48 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 blur-2xl animate-float" style={{ animationDuration: "19s" }}></div>
      </div>
      
      {/* Content container */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left side text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.45, 0.15, 1.0] }}
            className="flex flex-col space-y-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-violet-700 to-purple-700 animate-gradient-x">
                Create Stunning
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 animate-gradient-x" style={{ animationDelay: "1s" }}>
                AI-Generated Logos
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 md:pr-10">
              Transform your brand with professional, unique logos created by artificial intelligence. 
              No design skills needed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={navigateToCreate}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 text-white rounded-xl px-8 py-6 text-lg font-medium shadow-xl shadow-blue-600/20 group"
              >
                <span className="relative z-10 flex items-center">
                  Create Your Logo <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-violet-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-xl px-8 py-6 text-lg font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
              >
                View Examples
              </Button>
            </div>
            
            {/* Platform indicators */}
            <div className="pt-8 flex flex-col space-y-4">
              <div className="text-sm font-medium text-gray-500">TRUSTED BY BUSINESSES WORLDWIDE</div>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">10,000+ Logos Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-700">5,000+ Happy Customers</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right side dynamic creative visual effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.45, 0.15, 1.0] }}
            className="relative flex justify-center items-center h-[500px]"
          >
            {/* Dynamic background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl animate-pulse-slow" style={{ animationDuration: "15s" }}></div>
            
            {/* Creative logo element combination */}
            <div className="relative w-full max-w-lg h-full">
              {/* Main preview frame */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/90 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-56 h-56">
                    <Image 
                      src="/demo/logo-preview.webp" 
                      alt="AI Generated Logo Preview" 
                      layout="fill" 
                      objectFit="contain"
                      className="drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>
              
              {/* Decorative rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-dashed border-indigo-300/60 animate-spin-slow" style={{ animationDuration: "25s" }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full border-2 border-dashed border-purple-300/40 animate-reverse-spin" style={{ animationDuration: "30s" }}></div>
              
              {/* Creative graphic elements */}
              <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl transform rotate-45 animate-float shadow-lg" style={{ animationDuration: "10s" }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-float-reverse shadow-lg" style={{ animationDuration: "12s" }}></div>
              <div className="absolute top-1/2 right-1/5 w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg transform -rotate-12 animate-float shadow-lg" style={{ animationDuration: "9s", animationDelay: "1s" }}></div>
              <div className="absolute bottom-1/5 left-1/4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl transform rotate-12 animate-float-reverse shadow-lg" style={{ animationDuration: "11s", animationDelay: "0.5s" }}></div>
              
              {/* Text decorative elements */}
              <div className="absolute bottom-1/4 right-1/5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 animate-float" style={{ animationDuration: "8s" }}>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-gray-800">AI Powered</span>
                </div>
              </div>
              
              <div className="absolute top-1/5 left-1/4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 animate-float-reverse" style={{ animationDuration: "7s" }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-purple-600">✨ High Quality</span>
                </div>
              </div>
              
              <div className="absolute top-1/3 right-1/6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 animate-float" style={{ animationDuration: "9s", animationDelay: "1.5s" }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">🚀 Fast Generation</span>
                </div>
              </div>
              
              <div className="absolute bottom-1/6 left-1/3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 animate-float-reverse" style={{ animationDuration: "10s", animationDelay: "0.7s" }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-amber-600">🔄 Unlimited Revisions</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 