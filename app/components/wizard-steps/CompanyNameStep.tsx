import { Input } from "../ui/input";
import InfoTooltip from "../InfoToolTip";
import { Button } from "../ui/button";

interface CompanyNameStepProps {
  value: string;
  slogan: string;
  onChange: (value: string) => void;
  onSloganChange: (slogan: string) => void;
  onContinue: () => void;
  continueDisabled?: boolean;
}

export default function CompanyNameStep({ value, slogan, onChange, onSloganChange, onContinue, continueDisabled }: CompanyNameStepProps) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-gray-50 py-8">
      <div className="relative w-full max-w-xl rounded-2xl bg-white px-8 py-12 shadow-xl">
        {/* 右上角Continue按钮 */}
        <div className="absolute right-8 top-8">
          <Button
            size="lg"
            className="rounded-xl bg-blue-500 px-8 py-2 text-base font-semibold text-white shadow-md transition hover:bg-blue-600 focus:ring-2 focus:ring-blue-200"
            onClick={onContinue}
            disabled={continueDisabled}
          >
            Continue
          </Button>
        </div>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Enter your logo name</h1>
          <p className="text-base text-gray-500">You can always make changes later</p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Logo Name"
            required
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <Input
            value={slogan}
            onChange={(e) => onSloganChange(e.target.value)}
            placeholder="Slogan (Optional)"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
} 