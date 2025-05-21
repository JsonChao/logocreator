import { cn } from "@/lib/utils";
import { CheckIcon, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

// Logo style example images
const logoStyles = [
  {
    id: "tech",
    name: "Tech",
    description: "Modern, clean, professional",
    image: "/tech.svg"
  },
  {
    id: "flashy",
    name: "Flashy",
    description: "Bold, energetic, eye-catching",
    image: "/flashy.svg"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Minimal, trendy, professional",
    image: "/modern.svg"
  },
  {
    id: "playful",
    name: "Playful",
    description: "Friendly, lively, creative",
    image: "/playful.svg"
  },
  {
    id: "abstract",
    name: "Abstract",
    description: "Unique, artistic, profound",
    image: "/abstract.svg"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, refined, elegant",
    image: "/minimal.svg"
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined, premium, classic",
    image: "/elegant.svg"
  },
  {
    id: "professional",
    name: "Professional",
    description: "Reliable, authoritative, trustworthy",
    image: "/professional.svg"
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
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});

  const handleImageError = (styleId: string) => {
    setImageLoadError(prev => ({
      ...prev,
      [styleId]: true
    }));
  };

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl space-y-10"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">Choose Your Style</h1>
          <p className="mt-4 text-xl text-gray-600">Different styles evoke different emotions for your brand</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {logoStyles.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white p-1 shadow-sm transition-all hover:shadow-md",
                style === item.id 
                  ? "border-blue-500 ring-2 ring-blue-200" 
                  : "border-gray-200 hover:border-blue-300"
              )}
              onClick={() => onStyleChange(item.id)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-50">
                <div className="flex h-full items-center justify-center p-4">
                  {imageLoadError[item.id] ? (
                    <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <span className="text-base">{item.name} Style</span>
                    </div>
                  ) : (
                    <Image
                      src={item.image}
                      alt={`${item.name} style logo example`}
                      width={160}
                      height={160}
                      className="h-36 w-auto object-contain transition-transform group-hover:scale-105"
                      unoptimized={true}
                      onError={() => handleImageError(item.id)}
                      priority={true}
                    />
                  )}
                </div>
              </div>
              
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  {style === item.id && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <p className="text-base text-gray-500">{item.description}</p>
              </div>
              
              {style === item.id && (
                <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-500"></div>
              )}
            </motion.button>
          ))}
        </div>
        
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border-gray-200 px-8 py-3 text-lg font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 