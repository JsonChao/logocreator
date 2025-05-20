import { Textarea } from "../ui/textarea";
import InfoTooltip from "../InfoToolTip";

interface AdditionalInfoStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdditionalInfoStep({ value, onChange }: AdditionalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Additional details</h1>
        <p className="text-gray-600">
          Optional information to further customize your logo
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <p>Adding details can help our AI create a more relevant logo:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Describe your industry or business type</li>
          <li>Mention any specific imagery you'd like to see</li>
          <li>Specify your target audience</li>
          <li>Include special requirements or preferences</li>
        </ul>
      </div>

      <div className="space-y-3">
        <label
          htmlFor="additional-info"
          className="flex items-center text-sm font-medium text-gray-700"
        >
          Additional Information (Optional)
          <InfoTooltip content="Any extra details to help customize your logo" />
        </label>
        <Textarea
          id="additional-info"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Example: We are an eco-friendly tech company focused on sustainability and innovation"
          className="min-h-[150px] border-gray-300"
        />
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Example prompts</h3>
        <div className="space-y-2">
          <div className="cursor-pointer rounded-md border border-gray-200 p-2 text-sm hover:bg-gray-50" onClick={() => onChange("Modern tech startup focusing on AI and machine learning solutions")}>
            Modern tech startup focusing on AI and machine learning solutions
          </div>
          <div className="cursor-pointer rounded-md border border-gray-200 p-2 text-sm hover:bg-gray-50" onClick={() => onChange("Organic food market with a focus on sustainability and local produce")}>
            Organic food market with a focus on sustainability and local produce
          </div>
          <div className="cursor-pointer rounded-md border border-gray-200 p-2 text-sm hover:bg-gray-50" onClick={() => onChange("Professional consulting firm specializing in financial services")}>
            Professional consulting firm specializing in financial services
          </div>
        </div>
      </div>
    </div>
  );
} 