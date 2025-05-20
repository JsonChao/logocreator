import Image from "next/image";
import * as RadioGroup from "@radix-ui/react-radio-group";
import InfoTooltip from "../InfoToolTip";

interface StyleSelectionStepProps {
  value: string;
  onChange: (value: string) => void;
  styles: Array<{ name: string; icon: string }>;
}

export default function StyleSelectionStep({ value, onChange, styles }: StyleSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Choose your logo style</h1>
        <p className="text-gray-600">
          Select a style that best represents your brand personality
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <p>Different styles communicate different brand qualities:</p>
        <ul className="mt-2 list-disc pl-5">
          <li><strong>Tech:</strong> Modern, innovative, cutting-edge</li>
          <li><strong>Modern:</strong> Clean, minimalist, contemporary</li>
          <li><strong>Playful:</strong> Fun, vibrant, approachable</li>
          <li><strong>Minimal:</strong> Simple, timeless, elegant</li>
        </ul>
      </div>

      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          Style
          <InfoTooltip content="The style defines the overall look and feel of your logo" />
        </label>
        
        <RadioGroup.Root
          value={value}
          onValueChange={onChange}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        >
          {styles.map((style) => (
            <RadioGroup.Item
              value={style.name}
              key={style.name}
              className="group focus-visible:outline-none"
            >
              <div 
                className={`flex cursor-pointer flex-col items-center rounded-lg border-2 p-3 transition-all hover:border-blue-300 hover:shadow-sm focus:outline-none group-data-[state=checked]:border-blue-500 group-data-[state=checked]:shadow-sm ${
                  value === style.name 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 bg-white"
                }`}
              >
                <Image
                  src={style.icon}
                  alt={style.name}
                  width={96}
                  height={96}
                  className="mb-2 h-20 w-20 object-contain"
                />
                <span className="text-sm font-medium text-gray-900">{style.name}</span>
              </div>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>
    </div>
  );
} 