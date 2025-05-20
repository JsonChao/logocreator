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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">输入公司名称</h2>
        <p className="mt-2 text-sm text-gray-600">
          请输入您的公司或品牌名称，这将用于生成Logo
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-name">公司名称</Label>
        <Input
          id="company-name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="例如：Acme Inc."
          className="w-full"
        />
      </div>
    </div>
  );
} 