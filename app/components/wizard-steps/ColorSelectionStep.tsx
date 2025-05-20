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
import { Button } from "../ui/button";

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
  onContinue: () => void;
  continueDisabled?: boolean;
  onSkip: () => void;
}

const colorSchemes = [
  {
    name: "Warm",
    colors: ["#FDE7E7", "#FF9800", "#E53935", "#4A0D23"],
  },
  {
    name: "Cold",
    colors: ["#C6F6FF", "#00BFFF", "#7BAAF7", "#0A1D66"],
  },
  {
    name: "Contrast",
    colors: ["#FF4FCB", "#FFD600", "#2D2DFF", "#B100FF"],
  },
  {
    name: "Pastel",
    colors: ["#FDCACB", "#FDE7D6", "#BFE3E0", "#B6D6D6"],
  },
  {
    name: "Greyscale",
    colors: ["#FFFFFF", "#CCCCCC", "#888888", "#222222"],
  },
  {
    name: "Gradient",
    colors: ["linear-gradient(90deg, #FF4FCB 0%, #FFD600 50%, #00BFFF 100%)"],
  },
];

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
  onContinue,
  continueDisabled,
  onSkip,
}: ColorSelectionStepProps) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-gray-50 py-8">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white px-8 py-12 shadow-xl">
        {/* 右上角Skip按钮 */}
        <div className="absolute right-8 top-8">
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl border-blue-200 bg-blue-50 px-8 py-2 text-base font-semibold text-blue-600 shadow-sm transition hover:bg-blue-100 focus:ring-2 focus:ring-blue-200"
            onClick={onSkip}
          >
            Skip
          </Button>
        </div>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Select color schemes that matches your brand</h1>
          <p className="text-base text-gray-500">You can skip if you are not sure</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.name}
              type="button"
              className={`group flex flex-col items-center rounded-2xl border-2 bg-gray-50 p-4 shadow-md transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none ${primaryColor === scheme.name ? "border-blue-500 bg-blue-50" : "border-transparent"}`}
              onClick={() => onPrimaryColorChange(scheme.name)}
            >
              <div className="mb-3 flex w-full flex-row gap-1">
                {scheme.colors.map((c, i) =>
                  c.startsWith("linear-gradient") ? (
                    <div
                      key={i}
                      className="h-8 flex-1 rounded-lg"
                      style={{ background: c }}
                    />
                  ) : (
                    <div
                      key={i}
                      className="h-8 flex-1 rounded-lg"
                      style={{ backgroundColor: c }}
                    />
                  )
                )}
              </div>
              <span className="text-base font-semibold text-gray-800 group-hover:text-blue-600">
                {scheme.name}
              </span>
            </button>
          ))}
        </div>
        {/* 右下角Continue按钮 */}
        <div className="mt-10 flex justify-end">
          <Button
            size="lg"
            className="rounded-xl bg-blue-500 px-8 py-2 text-base font-semibold text-white shadow-md transition hover:bg-blue-600 focus:ring-2 focus:ring-blue-200"
            onClick={onContinue}
            disabled={continueDisabled}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
} 