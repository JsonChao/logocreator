import InfoTooltip from "../InfoToolTip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";

interface SizeSelectionStepProps {
  value: { name: string; width: number; height: number };
  onChange: (value: { name: string; width: number; height: number }) => void;
  sizes: Array<{ name: string; width: number; height: number }>;
}

export default function SizeSelectionStep({ value, onChange, sizes }: SizeSelectionStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">选择标志尺寸</h1>
          <p className="mt-3 text-lg text-gray-600">选择最适合您需求的标志尺寸</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-blue-800">
          <div className="flex items-start gap-3">
            <Info className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <h3 className="font-medium">不同尺寸适用于不同用途：</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-blue-700">
                <li><strong>标准 (768x768)：</strong> 适合大多数使用场景</li>
                <li><strong>小型 (512x512)：</strong> 加载更快，占用内存更少</li>
                <li><strong>大型 (1024x1024)：</strong> 更高质量，更多细节</li>
                <li><strong>宽/高格式：</strong> 适用于特定设计需求的专门格式</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <label className="flex items-center text-lg font-medium text-gray-800">
              选择尺寸
              <InfoTooltip content="您生成的标志的尺寸和比例" />
            </label>
            <Select
              value={value.name}
              onValueChange={(selectedName) => {
                const selectedSize = sizes.find(size => size.name === selectedName);
                if (selectedSize) {
                  onChange(selectedSize);
                }
              }}
            >
              <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50 text-base">
                <SelectValue placeholder="选择尺寸" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sizes.map((size) => (
                    <SelectItem key={size.name} value={size.name} className="text-base">
                      {size.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-700">推荐用途</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {value.width === value.height && (
                  <p>✓ 方形尺寸适合社交媒体头像和应用图标</p>
                )}
                {value.width > value.height && (
                  <p>✓ 宽格式适合网站页眉和横幅</p>
                )}
                {value.width < value.height && (
                  <p>✓ 高格式适合移动应用和故事格式</p>
                )}
                <p>✓ 选定尺寸：{value.width} × {value.height} 像素</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div 
              className="relative overflow-hidden rounded-xl border-4 border-gray-200 bg-gray-50 shadow-sm" 
              style={{ 
                width: `${Math.min(300, value.width / 2)}px`,
                height: `${Math.min(300, value.height / 2)}px`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 p-6">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-blue-100"></div>
                  <p className="text-lg font-medium text-gray-800">{value.width} × {value.height}</p>
                  <p className="text-sm text-gray-500">比例预览</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 