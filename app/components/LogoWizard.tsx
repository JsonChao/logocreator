import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { CompanyNameStep } from "./wizard-steps/CompanyNameStep";
import { StyleSelectionStep } from "./wizard-steps/StyleSelectionStep";
import { ColorSelectionStep } from "./wizard-steps/ColorSelectionStep";
import SizeSelectionStep from "./wizard-steps/SizeSelectionStep";
import AdditionalInfoStep from "./wizard-steps/AdditionalInfoStep";
import PreviewStep from "./wizard-steps/PreviewStep";

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
}

interface LogoWizardProps {
  initialData: WizardData;
  onUpdateData: (data: Partial<WizardData>) => void;
  onGenerateLogo: () => Promise<void>;
  onDownloadLogo: (format: 'png' | 'svg' | 'jpg') => void;
  styles: Array<{ name: string; icon: string }>;
  colors: Array<{ name: string; color: string }>;
  backgroundColors: Array<{ name: string; color: string }>;
  sizes: Array<{ name: string; width: number; height: number }>;
}

export default function LogoWizard({
  initialData,
  onUpdateData,
  onGenerateLogo,
  onDownloadLogo,
  styles,
  colors,
  backgroundColors,
  sizes
}: LogoWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const steps = [
    { title: "Company Name", component: CompanyNameStep, required: true },
    { title: "Logo Style", component: StyleSelectionStep, required: true },
    { title: "Colors", component: ColorSelectionStep, required: true },
    { title: "Size", component: SizeSelectionStep, required: false },
    { title: "Additional Info", component: AdditionalInfoStep, required: false },
    { title: "Preview", component: PreviewStep, required: false }
  ];

  const goToNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const isCurrentStepValid = () => {
    const step = steps[currentStep];
    
    if (!step.required) return true;
    
    switch(currentStep) {
      case 0: // Company name
        return !!initialData.companyName.trim();
      case 1: // Style
        return !!initialData.style;
      case 2: // Colors
        return !!(initialData.primaryColor && initialData.backgroundColor);
      default:
        return true;
    }
  };

  const shouldShowGenerateButton = currentStep === steps.length - 1;
  const shouldShowNextButton = currentStep < steps.length - 1;
  const shouldShowBackButton = currentStep > 0;
  
  const isButtonDisabled = !isCurrentStepValid() || initialData.isLoading;

  return (
    <div className="flex h-full w-full flex-col">
      {/* Progress bar */}
      <div className="mx-auto mb-8 mt-4 w-full max-w-3xl px-4">
        <div className="mb-2 flex items-center justify-between">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col items-center ${index <= currentStep ? "" : "text-gray-400"}`}
            >
              <button 
                onClick={() => index <= Math.max(...completedSteps, 0) ? goToStep(index) : null}
                disabled={index > Math.max(...completedSteps, 0)}
                className={`
                  z-10 flex h-8 w-8 items-center justify-center rounded-full 
                  ${completedSteps.includes(index) 
                    ? "bg-green-500 text-white" 
                    : index === currentStep 
                      ? "border-2 border-blue-500 bg-white text-blue-500" 
                      : "border-2 border-gray-300 bg-white text-gray-400"}
                  ${index <= Math.max(...completedSteps, 0) ? "cursor-pointer" : "cursor-not-allowed"}
                `}
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <span className="mt-1 text-xs font-medium">
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-8 top-4 -z-10 h-0.5 w-full ${
                    index < currentStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-grow overflow-y-auto px-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-2xl"
          >
            {currentStep === 0 && (
              <CompanyNameStep 
                value={initialData.companyName}
                slogan={initialData.slogan}
                onChange={(value) => onUpdateData({ companyName: value })}
                onSloganChange={(slogan) => onUpdateData({ slogan })}
                onContinue={goToNextStep}
                continueDisabled={!initialData.companyName.trim()}
              />
            )}
            
            {currentStep === 1 && (
              <StyleSelectionStep
                value={initialData.style}
                onChange={(value) => onUpdateData({ style: value })}
                styles={styles}
                onContinue={goToNextStep}
                continueDisabled={!initialData.style}
              />
            )}
            
            {currentStep === 2 && (
              <ColorSelectionStep
                primaryColor={initialData.primaryColor}
                customPrimaryColor={initialData.customPrimaryColor}
                backgroundColor={initialData.backgroundColor}
                customBackgroundColor={initialData.customBackgroundColor}
                onPrimaryColorChange={(value) => onUpdateData({ primaryColor: value })}
                onCustomPrimaryColorChange={(value) => onUpdateData({ customPrimaryColor: value })}
                onBackgroundColorChange={(value) => onUpdateData({ backgroundColor: value })}
                onCustomBackgroundColorChange={(value) => onUpdateData({ customBackgroundColor: value })}
                colors={colors}
                backgroundColors={backgroundColors}
                onContinue={goToNextStep}
                continueDisabled={!initialData.primaryColor}
                onSkip={goToNextStep}
              />
            )}
            
            {currentStep === 3 && (
              <SizeSelectionStep 
                value={initialData.size} 
                onChange={(value: { name: string; width: number; height: number }) => onUpdateData({ size: value })} 
                sizes={sizes}
              />
            )}
            
            {currentStep === 4 && (
              <AdditionalInfoStep 
                value={initialData.additionalInfo} 
                onChange={(value: string) => onUpdateData({ additionalInfo: value })} 
              />
            )}
            
            {currentStep === 5 && (
              <PreviewStep 
                generatedImages={initialData.generatedImages}
                companyName={initialData.companyName}
                isLoading={initialData.isLoading}
                onGenerateLogo={onGenerateLogo}
                onDownloadLogo={onDownloadLogo}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="mx-auto flex max-w-2xl justify-between">
          {shouldShowBackButton ? (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {shouldShowNextButton && (
            <Button
              disabled={isButtonDisabled}
              onClick={goToNextStep}
              className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {shouldShowGenerateButton && !initialData.generatedImages.length && (
            <Button
              disabled={initialData.isLoading}
              onClick={onGenerateLogo}
              className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              {initialData.isLoading ? "Generating..." : "Generate Logo"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 