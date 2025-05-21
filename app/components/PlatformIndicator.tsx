"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

interface PlatformIndicatorProps {
  className?: string;
}

export default function PlatformIndicator({ className = "" }: PlatformIndicatorProps) {
  const platforms = [
    {
      name: "AI-Powered",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
             className="text-blue-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 1 1-8 0 4 4 0 1 1 8 0" />
        </svg>
      ),
    },
    {
      name: "Modern Design",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
             className="text-purple-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a7 7 0 1 0 14 0a7 7 0 1 0-14 0" />
          <path d="M8 9h.01" />
          <path d="M15 9h.01" />
          <path d="M9 13c.684.642 1.509 1 2.5 1s1.841-.364 2.5-1" />
        </svg>
      ),
    },
    {
      name: "Professional",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
             className="text-pink-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
        </svg>
      ),
    },
    {
      name: "Fast & Easy",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
             className="text-amber-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8v4l3 3" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`flex items-center justify-center gap-6 py-6 ${className}`}>
      {platforms.map((platform, index) => (
        <div 
          key={index}
          className="flex flex-col items-center gap-2 hover-lift"
        >
          <div className="glass-effect p-3 rounded-full animate-glow">
            {platform.icon}
          </div>
          <span className="text-xs font-medium text-gray-700">{platform.name}</span>
        </div>
      ))}
    </div>
  );
} 