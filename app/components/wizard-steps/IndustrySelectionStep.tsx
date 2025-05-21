import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

// Industry options list
const industries = [
  {
    id: "technology",
    name: "Technology",
    description: "Software, Hardware, Internet Services",
    icon: "💻",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Banking, Investment, Insurance",
    icon: "💰",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Hospitals, Medical Services, Health Tech",
    icon: "🏥",
  },
  {
    id: "education",
    name: "Education",
    description: "Schools, Training, Online Education",
    icon: "🎓",
  },
  {
    id: "retail",
    name: "Retail",
    description: "Stores, E-commerce, Consumer Goods",
    icon: "🛍️",
  },
  {
    id: "food",
    name: "Food & Beverage",
    description: "Restaurants, Delivery, Food Production",
    icon: "🍽️",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Factories, Processing, Production",
    icon: "🏭",
  },
  {
    id: "creative",
    name: "Creative Design",
    description: "Art, Design, Creative Services",
    icon: "🎨",
  },
];

interface IndustrySelectionStepProps {
  industry: string;
  onIndustryChange: (industry: string) => void;
  onBack?: () => void;
  onSkip?: () => void;
}

export function IndustrySelectionStep({
  industry,
  onIndustryChange,
  onBack,
  onSkip
}: IndustrySelectionStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl space-y-10"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">Select Your Industry</h1>
          <p className="mt-4 text-xl text-gray-600">This will help us generate a logo that fits your industry style</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {industries.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group flex flex-col items-start gap-3 rounded-2xl border-2 bg-white p-7 shadow-sm transition-all hover:border-blue-300 hover:shadow-md",
                industry === item.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200"
              )}
              onClick={() => onIndustryChange(item.id)}
            >
              <div className="mb-3 text-4xl">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <p className="text-base text-gray-500">{item.description}</p>
            </motion.button>
          ))}
        </div>
        
        <div className="mt-10 flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border-gray-200 px-8 py-3 text-lg font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>
          
          <Button
            variant="ghost"
            onClick={onSkip}
            className="px-8 py-3 text-lg font-medium text-gray-500 hover:text-gray-700"
          >
            Skip this step
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 