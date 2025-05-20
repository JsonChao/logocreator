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
          <h1 className="text-4xl font-bold text-gray-900">补充信息</h1>
          <p className="mt-3 text-lg text-gray-600">添加额外细节来进一步定制您的标志</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-blue-800">
          <div className="flex items-start gap-3">
            <Info className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <h3 className="font-medium">添加细节可以帮助AI创建更相关的标志：</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-blue-700">
                <li>描述您的行业或业务类型</li>
                <li>提及您希望看到的特定图像</li>
                <li>指定您的目标受众</li>
                <li>包括特殊要求或偏好</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label
            htmlFor="additional-info"
            className="flex items-center text-lg font-medium text-gray-800"
          >
            附加信息（可选）
            <InfoTooltip content="任何有助于定制您标志的额外细节" />
          </label>
          <Textarea
            id="additional-info"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="例如：我们是一家以可持续发展和创新为重点的环保科技公司"
            className="min-h-[150px] rounded-xl border-gray-200 bg-gray-50 text-base shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-800">示例提示</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div 
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50" 
              onClick={() => onChange("现代科技初创公司，专注于人工智能和机器学习解决方案")}
            >
              <span className="block text-blue-600">科技公司</span>
              现代科技初创公司，专注于人工智能和机器学习解决方案
            </div>
            <div 
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50" 
              onClick={() => onChange("有机食品市场，专注于可持续发展和本地农产品")}
            >
              <span className="block text-green-600">食品行业</span>
              有机食品市场，专注于可持续发展和本地农产品
            </div>
            <div 
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50" 
              onClick={() => onChange("专业咨询公司，专注于金融服务和企业管理")}
            >
              <span className="block text-purple-600">咨询服务</span>
              专业咨询公司，专注于金融服务和企业管理
            </div>
            <div 
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50" 
              onClick={() => onChange("创意设计工作室，专注于品牌识别和视觉传达")}
            >
              <span className="block text-orange-600">创意设计</span>
              创意设计工作室，专注于品牌识别和视觉传达
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 