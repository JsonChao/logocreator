import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CompanyNameStep } from "./wizard-steps/CompanyNameStep";
import { StyleSelectionStep } from "./wizard-steps/StyleSelectionStep";
import { ColorSelectionStep } from "./wizard-steps/ColorSelectionStep";
// @ts-ignore
import PreviewStep from "./wizard-steps/PreviewStep";
import { IndustrySelectionStep } from "./wizard-steps/IndustrySelectionStep";

export interface WizardData {
  companyName: string;
  style: string;
  primaryColor: string;
  customPrimaryColor: string;
  backgroundColor: string;
  customBackgroundColor: string;
  additionalInfo: string;
  size: { name: string; width: number; height: number };
  isLoading: boolean;
  generatedImages: string[];
  industry?: string;
  fontStyle?: string;
  errorMessage?: string;
}

interface LogoWizardProps {
  initialData?: WizardData;
  data?: WizardData;
  onUpdateData: (data: Partial<WizardData>) => void;
  onGenerateLogo?: () => Promise<void>;
  generateLogo?: () => Promise<void>;
  onDownloadLogo?: (format: 'png' | 'svg' | 'jpg') => void;
  downloadPng?: () => void;
  downloadSvg?: () => Promise<void>;
  downloadJpg?: () => Promise<void>;
  sizes?: Array<{ name: string; width: number; height: number }>;
  imageError?: boolean;
}

export default function LogoWizard({
  initialData,
  data,
  onUpdateData,
  onGenerateLogo,
  generateLogo,
  onDownloadLogo,
  downloadPng,
  downloadSvg,
  downloadJpg,
  sizes,
  imageError
}: LogoWizardProps) {
  // Compatible with old and new API
  const wizardData = data || initialData || {
    companyName: "",
    style: "",
    primaryColor: "",
    customPrimaryColor: "",
    backgroundColor: "",
    customBackgroundColor: "",
    additionalInfo: "",
    size: { name: "Standard (768x768)", width: 768, height: 768 },
    isLoading: false,
    generatedImages: [],
    errorMessage: "",
  };
  
  const handleGenerateLogo = generateLogo || onGenerateLogo || (() => Promise.resolve());
  
  const handleDownloadLogo = (format: 'png' | 'svg' | 'jpg') => {
    if (onDownloadLogo) {
      onDownloadLogo(format);
    } else {
      if (format === 'png' && downloadPng) downloadPng();
      if (format === 'svg' && downloadSvg) downloadSvg();
      if (format === 'jpg' && downloadJpg) downloadJpg();
    }
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Streamlined steps, removed font selection and other non-essential steps
  const steps = [
    { title: "Company Name", component: CompanyNameStep, required: true },
    { title: "Industry", component: IndustrySelectionStep, required: false },
    { title: "Style", component: StyleSelectionStep, required: true },
    { title: "Colors", component: ColorSelectionStep, required: true },
    { title: "Preview", component: PreviewStep, required: false }
  ];

  // Automatically proceed to next step
  const goToNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  // Handle various selection operations, while maintaining auto-advance and manual confirmation options
  const handleCompanyNameChange = (value: string) => {
    onUpdateData({ companyName: value });
    // Company name step retains auto-advance functionality, but won't trigger immediately
    // Users can manually confirm via the Continue button
  };
  
  const handleIndustryChange = (value: string) => {
    onUpdateData({ industry: value });
    // Automatically proceed to next step after selecting industry
    setTimeout(() => goToNextStep(), 300);
  };
  
  const handleStyleChange = (value: string) => {
    onUpdateData({ style: value });
    // Automatically proceed to next step after selecting style
    setTimeout(() => goToNextStep(), 300);
  };
  
  const handleColorChange = (schemeId: string) => {
    // Update color scheme - get color schemes defined in ColorSelectionStep
    // Note: This needs to be kept in sync with colorSchemes in ColorSelectionStep
    const colorSchemes = [
      { id: "warm", backgroundColor: "#FFFFFF", primaryColor: "#E53935" },
      { id: "cold", backgroundColor: "#FFFFFF", primaryColor: "#0A1D66" },
      { id: "contrast", backgroundColor: "#FFFFFF", primaryColor: "#2D2DFF" },
      { id: "pastel", backgroundColor: "#FFFFFF", primaryColor: "#BFE3E0" },
      { id: "greyscale", backgroundColor: "#FFFFFF", primaryColor: "#222222" },
      { id: "gradient", backgroundColor: "#FFFFFF", primaryColor: "#00BFFF" },
      { id: "forest", backgroundColor: "#FFFFFF", primaryColor: "#388E3C" },
      { id: "ocean", backgroundColor: "#FFFFFF", primaryColor: "#0288D1" },
    ];
    
    // Find the corresponding color scheme
    const colorScheme = colorSchemes.find(s => s.id === schemeId) || colorSchemes[1]; // Default to cold color scheme
    
    onUpdateData({ 
      primaryColor: schemeId,
      backgroundColor: colorScheme.backgroundColor
    });
    
    // Automatically proceed to next step after selecting color
    setTimeout(() => goToNextStep(), 300);
  };

  const isCurrentStepValid = () => {
    const step = steps[currentStep];
    
    if (!step.required) return true;
    
    switch(currentStep) {
      case 0: // Company Name
        return !!wizardData.companyName.trim();
      case 1: // Industry
        return true; // Industry is optional
      case 2: // Style
        return !!wizardData.style;
      case 3: // Colors
        return !!(wizardData.primaryColor && wizardData.backgroundColor);
      default:
        return true;
    }
  };
  
  // Calculate progress bar completion percentage
  const progressPercent = ((completedSteps.length + (isCurrentStepValid() ? 1 : 0)) / steps.length) * 100;

  return (
    <div className="flex h-full w-full flex-col bg-gray-50">
      {/* Top progress indicator */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-200 mt-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-medium text-gray-700">
              {currentStep < steps.length - 1 ? 'Creation Progress' : 'Generate Logo'}
            </span>
            <span className="text-base text-gray-600">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-grow overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {currentStep === 0 && (
              <CompanyNameStep
                companyName={wizardData.companyName}
                onCompanyNameChange={handleCompanyNameChange}
                onContinue={goToNextStep}
              />
            )}
            
            {currentStep === 1 && (
              <IndustrySelectionStep
                industry={wizardData.industry || ""}
                onIndustryChange={handleIndustryChange}
                onBack={goToPreviousStep}
                onSkip={goToNextStep}
              />
            )}
            
            {currentStep === 2 && (
              <StyleSelectionStep
                style={wizardData.style}
                onStyleChange={handleStyleChange}
                onBack={goToPreviousStep}
              />
            )}
            
            {currentStep === 3 && (
              <ColorSelectionStep
                primaryColor={wizardData.primaryColor}
                backgroundColor={wizardData.backgroundColor}
                onPrimaryColorChange={handleColorChange}
                onBackgroundColorChange={(value) => onUpdateData({ backgroundColor: value })}
                onBack={goToPreviousStep}
                onSkip={goToNextStep}
              />
            )}
            
            {currentStep === 4 && (
              <PreviewStep 
                generatedImages={wizardData.generatedImages}
                companyName={wizardData.companyName}
                isLoading={wizardData.isLoading}
                errorMessage={wizardData.errorMessage}
                onGenerateLogo={handleGenerateLogo}
                onDownloadLogo={handleDownloadLogo}
                onBack={goToPreviousStep}
                imageError={imageError}
                sizes={sizes}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 