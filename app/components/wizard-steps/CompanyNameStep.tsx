"use client";

import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CompanyNameStepProps {
  companyName: string;
  onCompanyNameChange: (companyName: string) => void;
  onContinue?: () => void;
}

export function CompanyNameStep({
  companyName,
  onCompanyNameChange,
  onContinue
}: CompanyNameStepProps) {
  const [focused, setFocused] = useState(false);
  const isValid = companyName.trim().length >= 2;

  const handleContinue = () => {
    if (isValid && onContinue) {
      onContinue();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && onContinue) {
      onContinue();
    }
  };

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg space-y-10"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">Enter Your Company Name</h1>
          <p className="mt-4 text-xl text-gray-600">
            This will be displayed in your logo
          </p>
        </div>

        <div className="mt-12">
          <div className="relative">
            <Input
              type="text"
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Company name"
              className={`h-16 w-full rounded-xl border-2 bg-white px-5 py-4 text-xl font-medium transition-all ${
                focused
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-200"
              }`}
            />
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <p className={`text-base ${isValid ? "text-green-600" : "text-gray-500"}`}>
              {isValid 
                ? "✓ Name entered" 
                : "Name requires at least 2 characters"}
            </p>
            
            <Button
              variant="default"
              size="lg"
              disabled={!isValid}
              onClick={handleContinue}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700 transition-all"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 