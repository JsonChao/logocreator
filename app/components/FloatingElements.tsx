"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface FloatingElementsProps {
  className?: string;
}

export default function FloatingElements({ className = "" }: FloatingElementsProps) {
  // 定义不同的漂浮元素
  const elements = [
    {
      element: (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-40 blur-sm" />
      ),
      position: "top-[10%] left-[10%]",
      animation: "animate-float",
      delay: "0s",
    },
    {
      element: (
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-red-500 opacity-40 blur-sm" />
      ),
      position: "top-[20%] right-[15%]",
      animation: "animate-float",
      delay: "1s",
    },
    {
      element: (
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 opacity-40 blur-sm" />
      ),
      position: "bottom-[15%] left-[20%]",
      animation: "animate-float",
      delay: "0.5s",
    },
    {
      element: (
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-teal-500 opacity-40 blur-sm" />
      ),
      position: "bottom-[25%] right-[10%]",
      animation: "animate-float",
      delay: "1.5s",
    },
    {
      element: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-blue-400 opacity-60">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      position: "top-[35%] left-[25%]",
      animation: "animate-pulse-slow",
      delay: "0.2s",
    },
    {
      element: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-purple-400 opacity-60">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      position: "bottom-[40%] right-[30%]",
      animation: "animate-pulse-slow",
      delay: "0.7s",
    },
    {
      element: (
        <div className="w-36 h-6 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-sm" />
      ),
      position: "top-[50%] right-[20%]",
      animation: "animate-float",
      delay: "0.9s",
    },
    {
      element: (
        <div className="w-36 h-6 rounded-full bg-gradient-to-r from-pink-400/30 to-red-400/30 blur-sm" />
      ),
      position: "bottom-[30%] left-[15%]",
      animation: "animate-float",
      delay: "1.2s",
    },
  ];

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {elements.map((item, index) => (
        <div
          key={index}
          className={`absolute ${item.position} ${item.animation}`}
          style={{ animationDelay: item.delay }}
        >
          {item.element}
        </div>
      ))}
    </div>
  );
} 