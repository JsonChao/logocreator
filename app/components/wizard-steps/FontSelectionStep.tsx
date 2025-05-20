import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const fontStyles = [
  { 
    id: "sans",
    name: "现代简约", 
    displayName: "无衬线字体",
    description: "清晰现代的设计",
    className: "font-sans font-bold"
  },
  { 
    id: "serif", 
    name: "经典优雅", 
    displayName: "衬线字体",
    description: "传统而专业",
    className: "font-serif"
  },
  { 
    id: "mono", 
    name: "等宽技术", 
    displayName: "等宽字体",
    description: "科技与精确",
    className: "font-mono tracking-tight"
  },
  { 
    id: "display", 
    name: "展示性强", 
    displayName: "展示字体",
    description: "醒目独特",
    className: "font-sans font-black tracking-wide"
  },
  { 
    id: "handwritten", 
    name: "手写风格", 
    displayName: "手写字体",
    description: "个性与创意",
    className: "font-serif italic"
  },
  { 
    id: "condensed", 
    name: "紧凑现代", 
    displayName: "紧凑字体",
    description: "空间高效",
    className: "font-sans font-medium tracking-tighter"
  },
  { 
    id: "extended", 
    name: "延展大气", 
    displayName: "延展字体",
    description: "开阔与气派",
    className: "font-sans font-semibold tracking-widest"
  },
  { 
    id: "decorative", 
    name: "装饰艺术", 
    displayName: "装饰字体",
    description: "独特与艺术",
    className: "font-serif font-bold"
  },
];

interface FontSelectionStepProps {
  fontStyle: string;
  onFontStyleChange: (fontStyle: string) => void;
}

export function FontSelectionStep({
  fontStyle,
  onFontStyleChange,
}: FontSelectionStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">选择字体风格</h1>
          <p className="mt-3 text-lg text-gray-600">为您的标志选择合适的字体样式</p>
        </div>
        
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {fontStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-md",
                fontStyle === style.id 
                  ? "border-blue-500 ring-2 ring-blue-200 shadow-md" 
                  : "border-gray-200 hover:border-blue-300"
              )}
              onClick={() => onFontStyleChange(style.id)}
            >
              <div className="flex flex-col items-center text-center">
                <span 
                  className={cn(
                    "mb-4 text-3xl",
                    style.className,
                    fontStyle === style.id ? "text-blue-600" : "text-gray-800"
                  )}
                >
                  {style.name}
                </span>
                
                <div className="mt-2 space-y-1 text-left w-full">
                  <h4 className="font-medium text-gray-900">{style.displayName}</h4>
                  <p className="text-sm text-gray-500">{style.description}</p>
                </div>
              </div>
              
              {/* 选中标记 */}
              {fontStyle === style.id && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                  <CheckIcon className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 px-8 py-2.5 text-base font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            跳过此步骤
          </Button>
        </div>
      </div>
    </div>
  );
} 