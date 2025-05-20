import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { CompanyNameStep } from "./wizard-steps/CompanyNameStep";
import { StyleSelectionStep } from "./wizard-steps/StyleSelectionStep";
import { ColorSelectionStep } from "./wizard-steps/ColorSelectionStep";
import { FontSelectionStep } from "./wizard-steps/FontSelectionStep";
import SizeSelectionStep from "./wizard-steps/SizeSelectionStep";
import AdditionalInfoStep from "./wizard-steps/AdditionalInfoStep";
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
}

interface LogoWizardProps {
  initialData: WizardData;
  onUpdateData: (data: Partial<WizardData>) => void;
  onGenerateLogo: () => Promise<void>;
  onDownloadLogo: (format: 'png' | 'svg' | 'jpg') => void;
  sizes: Array<{ name: string; width: number; height: number }>;
}

export default function LogoWizard({
  initialData,
  onUpdateData,
  onGenerateLogo,
  onDownloadLogo,
  sizes
}: LogoWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const steps = [
    { title: "公司名称", component: CompanyNameStep, required: true },
    { title: "行业", component: IndustrySelectionStep, required: false },
    { title: "风格", component: StyleSelectionStep, required: true },
    { title: "颜色", component: ColorSelectionStep, required: true },
    { title: "字体", component: FontSelectionStep, required: false },
    { title: "尺寸", component: SizeSelectionStep, required: false },
    { title: "额外信息", component: AdditionalInfoStep, required: false },
    { title: "预览", component: PreviewStep, required: false }
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
      case 0: // 公司名称
        return !!initialData.companyName.trim();
      case 1: // 行业
        return true; // 行业是可选的
      case 2: // 风格
        return !!initialData.style;
      case 3: // 颜色
        return !!(initialData.primaryColor && initialData.backgroundColor);
      case 4: // 字体
        return true; // 字体是可选的
      default:
        return true;
    }
  };

  const shouldShowGenerateButton = currentStep === steps.length - 1;
  const shouldShowNextButton = currentStep < steps.length - 1;
  const shouldShowBackButton = currentStep > 0;
  
  const isButtonDisabled = !isCurrentStepValid() || initialData.isLoading;

  // 计算进度条的完成百分比
  const progressPercent = ((completedSteps.length + (isCurrentStepValid() ? 1 : 0)) / steps.length) * 100;

  return (
    <div className="flex h-full w-full flex-col bg-gray-50">
      {/* 进度指示器 */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col">
          {/* 步骤列表 */}
          <div className="mb-2 hidden items-center justify-between md:flex">
            {steps.map((step, index) => (
              <button 
                key={index} 
                onClick={() => index <= Math.max(...completedSteps, 0) ? goToStep(index) : null}
                disabled={index > Math.max(...completedSteps, 0)}
                className={`
                  group relative z-10 flex flex-col items-center px-2
                  ${index <= Math.max(...completedSteps, 0) ? "cursor-pointer" : "cursor-not-allowed"}
                  ${index <= currentStep ? "text-gray-900" : "text-gray-400"}
                `}
              >
                <div className={`
                  z-10 flex h-9 w-9 items-center justify-center rounded-full 
                  transition-all duration-200
                  ${completedSteps.includes(index) 
                    ? "bg-blue-500 text-white" 
                    : index === currentStep 
                      ? "border-2 border-blue-500 bg-white text-blue-600" 
                      : "border-2 border-gray-300 bg-white text-gray-400"}
                `}>
                  {completedSteps.includes(index) ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`
                  mt-1.5 text-xs font-medium transition-colors
                  ${index === currentStep ? "text-blue-600" : 
                    completedSteps.includes(index) ? "text-gray-700" : "text-gray-500"}
                `}>
                  {step.title}
                </span>
              </button>
            ))}
            
            {/* 连接线 */}
            <div className="absolute left-0 top-[1.125rem] -z-0 h-0.5 w-full bg-gray-200">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          {/* 移动端进度条 */}
          <div className="flex items-center justify-between md:hidden">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">步骤 {currentStep + 1}/{steps.length}</span>
              <span className="text-sm font-medium text-gray-500">{steps[currentStep].title}</span>
            </div>
            <span className="text-sm font-medium text-blue-600">{Math.round(progressPercent)}%</span>
          </div>
          
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 md:hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 步骤内容 */}
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
                companyName={initialData.companyName}
                onCompanyNameChange={(value) => onUpdateData({ companyName: value })}
              />
            )}
            
            {currentStep === 1 && (
              <IndustrySelectionStep
                industry={initialData.industry || ""}
                onIndustryChange={(value) => onUpdateData({ industry: value })}
              />
            )}
            
            {currentStep === 2 && (
              <StyleSelectionStep
                style={initialData.style}
                onStyleChange={(value) => onUpdateData({ style: value })}
              />
            )}
            
            {currentStep === 3 && (
              <ColorSelectionStep
                primaryColor={initialData.primaryColor}
                onPrimaryColorChange={(value) => onUpdateData({ primaryColor: value })}
              />
            )}
            
            {currentStep === 4 && (
              <FontSelectionStep
                fontStyle={initialData.fontStyle || ""}
                onFontStyleChange={(value) => onUpdateData({ fontStyle: value })}
              />
            )}
            
            {currentStep === 5 && (
              <SizeSelectionStep 
                value={initialData.size} 
                onChange={(value: { name: string; width: number; height: number }) => onUpdateData({ size: value })} 
                sizes={sizes}
              />
            )}
            
            {currentStep === 6 && (
              <AdditionalInfoStep 
                value={initialData.additionalInfo} 
                onChange={(value: string) => onUpdateData({ additionalInfo: value })} 
              />
            )}
            
            {currentStep === 7 && (
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

      {/* 导航按钮 */}
      {currentStep < 7 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            {shouldShowBackButton ? (
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                className="flex items-center gap-1.5 rounded-xl border-gray-200 px-6"
              >
                <ArrowLeft className="h-4 w-4" />
                上一步
              </Button>
            ) : (
              <div></div>
            )}
            
            {shouldShowNextButton && (
              <Button
                disabled={isButtonDisabled}
                onClick={goToNextStep}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-8 text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                下一步
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            
            {shouldShowGenerateButton && !initialData.generatedImages.length && (
              <Button
                disabled={initialData.isLoading}
                onClick={onGenerateLogo}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-8 text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                {initialData.isLoading ? "生成中..." : "生成标志"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 