import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Plane, Dumbbell, ShoppingBag, Church, Building, Scale, 
  Globe, Cpu, Home, PartyPopper, Stethoscope, Utensils, 
  PiggyBank, Heart, Film, Construction, BookOpen, Palette, 
  Car, PawPrint, MoreHorizontal 
} from "lucide-react";

const industries = [
  { id: "travel", name: "旅游", icon: Plane },
  { id: "sports", name: "运动健身", icon: Dumbbell },
  { id: "retail", name: "零售", icon: ShoppingBag },
  { id: "religious", name: "宗教", icon: Church },
  { id: "realestate", name: "房地产", icon: Building },
  { id: "legal", name: "法律", icon: Scale },
  { id: "internet", name: "互联网", icon: Globe },
  { id: "technology", name: "科技", icon: Cpu },
  { id: "home", name: "家居", icon: Home },
  { id: "events", name: "活动", icon: PartyPopper },
  { id: "medical", name: "医疗", icon: Stethoscope },
  { id: "restaurant", name: "餐饮", icon: Utensils },
  { id: "finance", name: "金融", icon: PiggyBank },
  { id: "nonprofit", name: "非营利", icon: Heart },
  { id: "entertainment", name: "娱乐", icon: Film },
  { id: "construction", name: "建筑", icon: Construction },
  { id: "education", name: "教育", icon: BookOpen },
  { id: "beauty", name: "美容", icon: Palette },
  { id: "automotive", name: "汽车", icon: Car },
  { id: "animals", name: "宠物", icon: PawPrint },
  { id: "others", name: "其他", icon: MoreHorizontal }
];

interface IndustrySelectionStepProps {
  industry: string;
  onIndustryChange: (industry: string) => void;
}

export function IndustrySelectionStep({
  industry,
  onIndustryChange,
}: IndustrySelectionStepProps) {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">选择您的行业</h1>
          <p className="mt-3 text-lg text-gray-600">这将帮助我们为您的品牌找到合适的标志类型和风格</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {industries.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onIndustryChange(item.id)}
                className={cn(
                  "group flex h-28 flex-col items-center justify-center rounded-2xl border-2 bg-white p-4 shadow-sm transition-all hover:shadow-md",
                  industry === item.id 
                    ? "border-blue-500 bg-blue-50 shadow-md" 
                    : "border-gray-200 hover:border-blue-300"
                )}
              >
                <div className={cn(
                  "mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                  industry === item.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-500"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  industry === item.id
                    ? "text-blue-700"
                    : "text-gray-700 group-hover:text-blue-600"
                )}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline"
            className="rounded-xl border-gray-200 px-8 py-2.5 text-base font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            跳过此步骤
          </Button>
        </div>
      </div>
    </div>
  );
} 