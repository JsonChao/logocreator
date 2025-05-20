import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

// Logo预览示例图片
const logoStyles = [
  {
    id: "tech",
    name: "科技",
    description: "现代、简洁、专业",
    image: "/tech-logo-preview.svg"
  },
  {
    id: "flashy",
    name: "醒目",
    description: "大胆、活力、吸引眼球",
    image: "/flashy-logo-preview.svg"
  },
  {
    id: "modern",
    name: "现代",
    description: "简约、时尚、专业",
    image: "/modern-logo-preview.svg"
  },
  {
    id: "playful",
    name: "有趣",
    description: "友好、活泼、创意",
    image: "/playful-logo-preview.svg"
  },
  {
    id: "abstract",
    name: "抽象",
    description: "独特、艺术、深远",
    image: "/abstract-logo-preview.svg"
  },
  {
    id: "minimal",
    name: "极简",
    description: "简洁、精致、优雅",
    image: "/minimal-logo-preview.svg"
  },
  {
    id: "elegant",
    name: "优雅",
    description: "精致、高端、经典",
    image: "/elegant-logo-preview.svg"
  },
  {
    id: "professional",
    name: "专业",
    description: "可靠、权威、信任",
    image: "/professional-logo-preview.svg"
  }
];

interface StyleSelectionStepProps {
  style: string;
  onStyleChange: (style: string) => void;
}

export function StyleSelectionStep({
  style,
  onStyleChange,
}: StyleSelectionStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">选择您喜欢的风格</h1>
          <p className="mt-3 text-lg text-gray-600">不同的风格会给您的标志带来不同的情感</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {logoStyles.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white p-0.5 shadow-sm transition-all hover:shadow-md",
                style === item.id 
                  ? "border-blue-500 ring-2 ring-blue-200" 
                  : "border-gray-200 hover:border-blue-300"
              )}
              onClick={() => onStyleChange(item.id)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-100">
                <div className="flex h-full items-center justify-center">
                  {/* 这里会显示实际的Logo预览图片 */}
                  <div className="h-24 w-24 rounded-full bg-gray-200"></div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  {style === item.id && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                      <CheckIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              
              {style === item.id && (
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 