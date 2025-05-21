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
          <h1 className="text-4xl font-bold text-gray-900">Choose Logo Size</h1>
          <p className="mt-3 text-lg text-gray-600">Select the logo size that best fits your needs</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-blue-800">
          <div className="flex items-start gap-3">
            <Info className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <h3 className="font-medium">Different sizes for different uses:</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-blue-700">
                <li><strong>Standard (768x768):</strong> Suitable for most use cases</li>
                <li><strong>Small (512x512):</strong> Faster loading, less memory usage</li>
                <li><strong>Large (1024x1024):</strong> Higher quality, more details</li>
                <li><strong>Wide/Tall formats:</strong> Specialized formats for specific design needs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <label className="flex items-center text-lg font-medium text-gray-800">
              Select Size
              <InfoTooltip content="The size and aspect ratio of your generated logo" />
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
                <SelectValue placeholder="Choose size" />
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
              <h3 className="mb-3 text-sm font-medium text-gray-700">Recommended Uses</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {value.width === value.height && (
                  <p>✓ Square size ideal for social media avatars and app icons</p>
                )}
                {value.width > value.height && (
                  <p>✓ Wide format suitable for website headers and banners</p>
                )}
                {value.width < value.height && (
                  <p>✓ Tall format perfect for mobile apps and story formats</p>
                )}
                <p>✓ Selected size: {value.width} × {value.height} pixels</p>
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
                  <p className="text-sm text-gray-500">Aspect ratio preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 