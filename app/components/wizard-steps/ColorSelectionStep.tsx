import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const colorSchemes = [
  {
    id: "warm",
    name: "暖色调",
    description: "传递热情、活力和能量",
    colors: ["#FDE7E7", "#FF9800", "#E53935", "#4A0D23"],
  },
  {
    id: "cold",
    name: "冷色调",
    description: "展现专业、信任和平静",
    colors: ["#C6F6FF", "#00BFFF", "#7BAAF7", "#0A1D66"],
  },
  {
    id: "contrast",
    name: "对比色",
    description: "吸引眼球，充满活力",
    colors: ["#FF4FCB", "#FFD600", "#2D2DFF", "#B100FF"],
  },
  {
    id: "pastel",
    name: "柔和色",
    description: "友好、柔和、亲切",
    colors: ["#FDCACB", "#FDE7D6", "#BFE3E0", "#B6D6D6"],
  },
  {
    id: "greyscale",
    name: "灰度",
    description: "简洁、高端、经典",
    colors: ["#FFFFFF", "#CCCCCC", "#888888", "#222222"],
  },
  {
    id: "gradient",
    name: "渐变色",
    description: "现代、流行、多彩",
    gradient: "linear-gradient(90deg, #FF4FCB 0%, #FFD600 50%, #00BFFF 100%)",
  },
  {
    id: "forest",
    name: "森林绿",
    description: "自然、健康、生态",
    colors: ["#E8F5E9", "#81C784", "#388E3C", "#1B5E20"],
  },
  {
    id: "ocean",
    name: "海洋蓝",
    description: "深邃、平静、专业",
    colors: ["#E1F5FE", "#4FC3F7", "#0288D1", "#01579B"],
  },
];

interface ColorSelectionStepProps {
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
}

export function ColorSelectionStep({
  primaryColor,
  onPrimaryColorChange,
}: ColorSelectionStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">选择颜色方案</h1>
          <p className="mt-3 text-lg text-gray-600">选择最能代表您品牌个性的颜色组合</p>
        </div>
        
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              type="button"
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all hover:shadow-md",
                primaryColor === scheme.id 
                  ? "border-blue-500 ring-2 ring-blue-200 shadow-md" 
                  : "border-gray-200 hover:border-blue-300"
              )}
              onClick={() => onPrimaryColorChange(scheme.id)}
            >
              {/* 颜色预览区域 */}
              <div className="h-24 w-full">
                {scheme.gradient ? (
                  <div
                    className="h-full w-full"
                    style={{ background: scheme.gradient }}
                  />
                ) : scheme.colors ? (
                  <div className="flex h-full w-full">
                    {scheme.colors.map((c, i) => (
                      <div
                        key={i}
                        className="h-full flex-1"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
              
              {/* 颜色信息区域 */}
              <div className="flex flex-col p-4">
                <span className="text-lg font-semibold text-gray-900">
                  {scheme.name}
                </span>
                <span className="mt-1 text-sm text-gray-600">
                  {scheme.description}
                </span>
              </div>
              
              {/* 选中标记 */}
              {primaryColor === scheme.id && (
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