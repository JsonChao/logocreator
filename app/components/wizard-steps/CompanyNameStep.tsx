import { Input } from "@/components/ui/input";

interface CompanyNameStepProps {
  companyName: string;
  onCompanyNameChange: (name: string) => void;
}

export function CompanyNameStep({
  companyName,
  onCompanyNameChange,
}: CompanyNameStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-start py-12">
      <div className="w-full max-w-2xl space-y-8 px-4">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-gray-800">Enter your logo name</h1>
          <p className="mt-2 text-lg text-gray-500">You can always make changes later</p>
        </div>

        <div className="space-y-6 py-6">
          <div>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              placeholder="Logo Name"
              className="h-16 rounded-xl border-gray-200 bg-white px-5 text-xl shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <div>
            <Input
              id="slogan"
              placeholder="Slogan (Optional)"
              className="h-16 rounded-xl border-gray-200 bg-white px-5 text-xl shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 