import { Input } from "../ui/input";
import InfoTooltip from "../InfoToolTip";

interface CompanyNameStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CompanyNameStep({ value, onChange }: CompanyNameStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Enter your company name</h1>
        <p className="text-gray-600">
          This will be the main text featured in your logo
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <p>Your company name is the foundation of your brand identity. Keep it:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Simple and memorable</li>
          <li>Relevant to your business</li>
          <li>Distinct from competitors</li>
        </ul>
      </div>

      <div className="space-y-3">
        <label
          htmlFor="company-name"
          className="flex items-center text-sm font-medium text-gray-700"
        >
          Company Name
          <InfoTooltip content="Enter the name you want to appear in your logo" />
        </label>
        <Input
          id="company-name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Acme Inc."
          className="border-gray-300 text-lg"
          required
          autoFocus
        />
      </div>
    </div>
  );
} 