import InfoTooltip from "../InfoToolTip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SizeSelectionStepProps {
  value: { name: string; width: number; height: number };
  onChange: (value: { name: string; width: number; height: number }) => void;
  sizes: Array<{ name: string; width: number; height: number }>;
}

export default function SizeSelectionStep({ value, onChange, sizes }: SizeSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Select image size</h1>
        <p className="text-gray-600">
          Choose the dimensions for your logo
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <p>Different sizes serve different purposes:</p>
        <ul className="mt-2 list-disc pl-5">
          <li><strong>Standard (768x768):</strong> Great for most usage scenarios</li>
          <li><strong>Small (512x512):</strong> Loads faster, uses less memory</li>
          <li><strong>Large (1024x1024):</strong> Higher quality with more details</li>
          <li><strong>Wide/Tall:</strong> Specialized formats for specific designs</li>
        </ul>
      </div>

      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          Image Dimensions
          <InfoTooltip content="The size and proportions of your generated logo" />
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
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sizes.map((size) => (
                <SelectItem key={size.name} value={size.name}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 flex justify-center">
        <div 
          className="relative rounded-md border border-gray-300 bg-gray-50" 
          style={{ 
            width: `${Math.min(300, value.width / 2)}px`,
            height: `${Math.min(300, value.height / 2)}px`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-sm font-medium">{value.width} × {value.height}</p>
              <p className="text-xs text-gray-400">Preview of proportions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 