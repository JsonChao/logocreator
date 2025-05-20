import { Input } from "../ui/input";
import InfoTooltip from "../InfoToolTip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColorSelectionStepProps {
  primaryColor: string;
  customPrimaryColor: string;
  backgroundColor: string;
  customBackgroundColor: string;
  onPrimaryColorChange: (value: string) => void;
  onCustomPrimaryColorChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
  onCustomBackgroundColorChange: (value: string) => void;
  colors: Array<{ name: string; color: string }>;
  backgroundColors: Array<{ name: string; color: string }>;
}

export default function ColorSelectionStep({
  primaryColor,
  customPrimaryColor,
  backgroundColor,
  customBackgroundColor,
  onPrimaryColorChange,
  onCustomPrimaryColorChange,
  onBackgroundColorChange,
  onCustomBackgroundColorChange,
  colors,
  backgroundColors,
}: ColorSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Select your colors</h1>
        <p className="text-gray-600">
          Choose colors that reflect your brand personality
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <p>Colors evoke different emotions and associations:</p>
        <ul className="mt-2 list-disc pl-5">
          <li><strong>Blue:</strong> Trust, stability, professionalism</li>
          <li><strong>Red:</strong> Energy, passion, excitement</li>
          <li><strong>Green:</strong> Growth, health, nature</li>
          <li><strong>Purple:</strong> Creativity, wisdom, luxury</li>
        </ul>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Primary Color
            <InfoTooltip content="The main color of your logo" />
          </label>
          <Select
            value={primaryColor}
            onValueChange={onPrimaryColorChange}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {colors.map((color) => (
                  <SelectItem key={color.color} value={color.name}>
                    <div className="flex items-center">
                      {color.color !== "custom" && (
                        <div
                          className="mr-2 h-4 w-4 rounded-sm border border-gray-200"
                          style={{ backgroundColor: color.color }}
                        />
                      )}
                      <span>{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {primaryColor === "Custom" && (
            <div className="mt-2 flex items-center">
              <Input
                type="text"
                value={customPrimaryColor}
                onChange={(e) => onCustomPrimaryColorChange(e.target.value)}
                placeholder="#RRGGBB"
                className="mr-2 border-gray-300"
              />
              <div
                className="h-6 w-6 rounded-md border border-gray-300"
                style={{ backgroundColor: customPrimaryColor }}
              />
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Background Color
            <InfoTooltip content="The background color of your logo" />
          </label>
          <Select
            value={backgroundColor}
            onValueChange={onBackgroundColorChange}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {backgroundColors.map((color) => (
                  <SelectItem key={color.color} value={color.name}>
                    <div className="flex items-center">
                      {color.color !== "custom" && (
                        <div
                          className="mr-2 h-4 w-4 rounded-sm border border-gray-200"
                          style={{ backgroundColor: color.color }}
                        />
                      )}
                      <span>{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {backgroundColor === "Custom" && (
            <div className="mt-2 flex items-center">
              <Input
                type="text"
                value={customBackgroundColor}
                onChange={(e) => onCustomBackgroundColorChange(e.target.value)}
                placeholder="#RRGGBB"
                className="mr-2 border-gray-300"
              />
              <div
                className="h-6 w-6 rounded-md border border-gray-300"
                style={{ backgroundColor: customBackgroundColor }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
        <div className="p-4 text-center">
          <p className="mb-2 text-sm font-medium text-gray-700">Color Preview</p>
          <div 
            className="mx-auto h-20 w-20 rounded-lg"
            style={{ 
              backgroundColor: backgroundColor === "Custom" ? customBackgroundColor : 
                backgroundColors.find(c => c.name === backgroundColor)?.color || "#FFFFFF",
              color: primaryColor === "Custom" ? customPrimaryColor : 
                colors.find(c => c.name === primaryColor)?.color || "#000000",
              border: "1px solid #E5E7EB"
            }}
          >
            <div className="flex h-full w-full items-center justify-center text-lg font-bold">
              A
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 