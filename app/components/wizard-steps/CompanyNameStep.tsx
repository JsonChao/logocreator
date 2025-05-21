import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyNameStepProps {
  companyName: string;
  onCompanyNameChange: (name: string) => void;
}

export function CompanyNameStep({
  companyName,
  onCompanyNameChange,
}: CompanyNameStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-10">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">What's Your Logo Name?</h1>
          <p className="mt-4 text-lg text-gray-600">Enter your company or brand name below</p>
        </div>

        <div className="space-y-8 py-6">
          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-base font-medium text-gray-700">Logo Name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              placeholder="e.g., Acme Corporation"
              className="h-16 rounded-xl border-gray-200 bg-gray-50 px-5 text-xl shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slogan" className="text-base font-medium text-gray-700">Slogan (Optional)</Label>
            <Input
              id="slogan"
              placeholder="e.g., Innovation Changes the World"
              className="h-16 rounded-xl border-gray-200 bg-gray-50 px-5 text-xl shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="mb-6 text-sm text-gray-500">Please enter your logo name to continue</p>
        </div>
      </div>
    </div>
  );
} 