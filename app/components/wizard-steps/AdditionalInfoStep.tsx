import { Textarea } from "../ui/textarea";
import InfoTooltip from "../InfoToolTip";
import { Info } from "lucide-react";

interface AdditionalInfoStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdditionalInfoStep({ value, onChange }: AdditionalInfoStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Additional Information</h1>
          <p className="mt-3 text-lg text-gray-600">Add extra details to further customize your logo</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-blue-800">
          <div className="flex items-start gap-3">
            <Info className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <h3 className="font-medium">Adding details helps AI create more relevant logos:</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-blue-700">
                <li>Describe your industry or business type</li>
                <li>Mention specific imagery you&apos;d like to see</li>
                <li>Specify your target audience</li>
                <li>Include special requirements or preferences</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label
            htmlFor="additional-info"
            className="flex items-center text-lg font-medium text-gray-800"
          >
            Additional Information (Optional)
            <InfoTooltip content="Any extra details that help customize your logo" />
          </label>
          <Textarea
            id="additional-info"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="For example: We are an eco-friendly tech company focused on sustainability and innovation"
            className="min-h-[150px] rounded-xl border-gray-200 bg-gray-50 text-base shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-800">Example Prompts</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div 
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50" 
              onClick={() => onChange("Modern tech startup focused on artificial intelligence and machine learning solutions")}
            >
              <span className="block text-blue-600">Tech Company</span>
              Modern tech startup focused on artificial intelligence and machine learning solutions
            </div>
            <div 
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50" 
              onClick={() => onChange("Organic food market focused on sustainability and local produce")}
            >
              <span className="block text-green-600">Food Industry</span>
              Organic food market focused on sustainability and local produce
            </div>
            <div 
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50" 
              onClick={() => onChange("Professional consulting firm specializing in financial services and corporate management")}
            >
              <span className="block text-purple-600">Consulting Services</span>
              Professional consulting firm specializing in financial services and corporate management
            </div>
            <div 
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50" 
              onClick={() => onChange("Creative design studio specializing in brand identity and visual communication")}
            >
              <span className="block text-orange-600">Creative Design</span>
              Creative design studio specializing in brand identity and visual communication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 