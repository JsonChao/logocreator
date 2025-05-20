import Image from "next/image";
import * as RadioGroup from "@radix-ui/react-radio-group";
import InfoTooltip from "../InfoToolTip";
import { Button } from "../ui/button";

interface StyleSelectionStepProps {
  value: string;
  onChange: (value: string) => void;
  styles: Array<{ name: string; icon: string }>;
  onContinue: () => void;
  continueDisabled?: boolean;
}

const fontStyles = [
  { name: "Modern", font: "font-sans font-bold" },
  { name: "Elegant", font: "font-serif italic" },
  { name: "Slab", font: "font-serif font-bold tracking-wide" },
  { name: "Handwritten", font: "font-handwriting" },
  { name: "Playful", font: "font-sans font-extrabold italic" },
  { name: "Futuristic", font: "font-mono tracking-widest uppercase" },
];

export default function StyleSelectionStep({ value, onChange, onContinue, continueDisabled }: StyleSelectionStepProps) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-gray-50 py-8">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white px-8 py-12 shadow-xl">
        {/* 右上角Generate按钮 */}
        <div className="absolute right-8 top-8">
          <Button
            size="lg"
            className="rounded-xl bg-blue-500 px-8 py-2 text-base font-semibold text-white shadow-md transition hover:bg-blue-600 focus:ring-2 focus:ring-blue-200"
            onClick={onContinue}
            disabled={continueDisabled}
          >
            Generate
          </Button>
        </div>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Select font styles that you like</h1>
          <p className="text-base text-gray-500">You can also skip and see logo results directly</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {fontStyles.map((style) => (
            <button
              key={style.name}
              type="button"
              className={`group flex h-28 items-center justify-center rounded-2xl border-2 bg-gray-50 p-4 shadow-md transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none ${value === style.name ? "border-blue-500 bg-blue-50" : "border-transparent"}`}
              onClick={() => onChange(style.name)}
            >
              <span className={`text-2xl ${style.font} group-hover:text-blue-600 ${value === style.name ? "text-blue-600" : "text-gray-800"}`}>
                {style.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 