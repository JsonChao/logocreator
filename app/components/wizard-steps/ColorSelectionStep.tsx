import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const colorSchemes = [
  {
    id: "warm",
    name: "Warm",
    description: "Conveys passion, vitality and energy",
    colors: ["#FDE7E7", "#FF9800", "#E53935", "#4A0D23"],
    backgroundColor: "#FFFFFF",
    primaryColor: "#E53935"
  },
  {
    id: "cold",
    name: "Cold",
    description: "Shows professionalism, trust and calm",
    colors: ["#C6F6FF", "#00BFFF", "#7BAAF7", "#0A1D66"],
    backgroundColor: "#FFFFFF",
    primaryColor: "#0A1D66"
  },
  {
    id: "contrast",
    name: "Contrast",
    description: "Eye-catching and full of energy",
    colors: ["#FF4FCB", "#FFD600", "#2D2DFF", "#B100FF"],
    backgroundColor: "#FFFFFF",
    primaryColor: "#2D2DFF"
  },
  {
    id: "pastel",
    name: "Pastel",
    description: "Friendly, soft and approachable",
    colors: ["#FDCACB", "#FDE7D6", "#BFE3E0", "#B6D6D6"],
    backgroundColor: "#FFFFFF",
    primaryColor: "#BFE3E0"
  },
  {
    id: "greyscale",
    name: "Greyscale",
    description: "Clean, premium and classic",
    colors: ["#FFFFFF", "#CCCCCC", "#888888", "#222222"],
    backgroundColor: "#FFFFFF",
    primaryColor: "#222222"
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Modern, trendy and colorful",
    gradient: "linear-gradient(90deg, #FF4FCB 0%, #FFD600 50%, #00BFFF 100%)",
    backgroundColor: "#FFFFFF",
    primaryColor: "#00BFFF"
  },
  {
    id: "forest",
    name: "Forest Green",
    description: "Natural, healthy and ecological",
    colors: ["#E8F5E9", "#81C784", "#388E3C", "#1B5E20"],
    backgroundColor: "#FFFFFF",
    primaryColor: "#388E3C"
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    description: "Deep, calm and professional",
    colors: ["#E1F5FE", "#4FC3F7", "#0288D1", "#01579B"],
    backgroundColor: "#FFFFFF",
    primaryColor: "#0288D1"
  },
];

interface ColorSelectionStepProps {
  primaryColor: string;
  backgroundColor?: string;
  onPrimaryColorChange: (color: string) => void;
  onBackgroundColorChange?: (color: string) => void;
  onBack?: () => void;
  onSkip?: () => void;
}

export function ColorSelectionStep({
  primaryColor,
  backgroundColor,
  onPrimaryColorChange,
  onBackgroundColorChange,
  onBack,
  onSkip
}: ColorSelectionStepProps) {
  const [hoveredScheme, setHoveredScheme] = useState<string | null>(null);

  // When color scheme changes, set both primary and background colors
  const handleColorSchemeChange = (schemeId: string) => {
    const scheme = colorSchemes.find(s => s.id === schemeId);
    
    if (scheme) {
      // Set scheme ID as primary color value
      onPrimaryColorChange(schemeId);
      
      // If background color change callback is provided, set background color as well
      if (onBackgroundColorChange) {
        onBackgroundColorChange(scheme.backgroundColor);
      }
    }
  };

  const handleSkip = () => {
    // If user skips but has not selected a color, set default value
    if (!primaryColor) {
      const defaultScheme = colorSchemes[1]; // Cold as default
      handleColorSchemeChange(defaultScheme.id);
    }
    
    // If onSkip callback is provided, call it to proceed to next step
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-12 bg-gradient-to-b from-slate-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl space-y-10"
      >
        <div className="text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-50 rounded-full">
            <span className="text-blue-600 font-medium">Step 3 of 4</span>
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-indigo-900">Choose Your Colors</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">Colors evoke emotions and define your brand's personality</p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {colorSchemes.map((scheme, index) => (
            <motion.button
              key={scheme.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300",
                primaryColor === scheme.id 
                  ? "border-blue-500 ring-2 ring-blue-200 transform scale-[1.02] shadow-xl" 
                  : "border-gray-200 hover:border-blue-300 shadow-md hover:shadow-xl hover:transform hover:scale-[1.02]"
              )}
              onClick={() => handleColorSchemeChange(scheme.id)}
              onMouseEnter={() => setHoveredScheme(scheme.id)}
              onMouseLeave={() => setHoveredScheme(null)}
            >
              {/* Color preview area */}
              <div className="relative h-40 w-full overflow-hidden">
                {scheme.gradient ? (
                  <div
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                    style={{ background: scheme.gradient }}
                  />
                ) : scheme.colors ? (
                  <div className="flex h-full w-full transition-transform duration-300 group-hover:scale-105">
                    {scheme.colors.map((c, i) => (
                      <div
                        key={i}
                        className="h-full flex-1"
                        style={{ backgroundColor: c }}
                      >
                        {(hoveredScheme === scheme.id || primaryColor === scheme.id) && (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="rounded-full bg-white bg-opacity-30 px-2 py-1 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
                              {c.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
                
                {primaryColor === scheme.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </motion.div>
                )}
              </div>
              
              {/* Color info area */}
              <div className="flex flex-col p-5 border-t border-slate-100">
                <span className="text-xl font-semibold text-slate-900">
                  {scheme.name}
                </span>
                <span className="mt-2 text-sm text-slate-500">
                  {scheme.description}
                </span>
              </div>
              
              {/* Left accent bar for selected scheme */}
              {primaryColor === scheme.id && (
                <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
              )}
            </motion.button>
          ))}
        </div>
        
        <div className="mt-12 flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border-slate-200 px-8 py-3 text-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>
          
          {primaryColor ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={onSkip}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-lg font-medium text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Continue with {colorSchemes.find(s => s.id === primaryColor)?.name} Colors
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </motion.div>
          ) : (
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 px-8 py-3 text-lg font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
              onClick={handleSkip}
            >
              Skip this step
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
} 