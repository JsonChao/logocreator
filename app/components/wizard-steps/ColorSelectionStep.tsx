import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface ColorSelectionStepProps {
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
}

export function ColorSelectionStep({
  primaryColor,
  onPrimaryColorChange,
}: ColorSelectionStepProps) {
  const colors = [
    { value: "blue", label: "蓝色", color: "#3B82F6" },
    { value: "green", label: "绿色", color: "#10B981" },
    { value: "red", label: "红色", color: "#EF4444" },
    { value: "purple", label: "紫色", color: "#8B5CF6" },
    { value: "orange", label: "橙色", color: "#F97316" },
    { value: "pink", label: "粉色", color: "#EC4899" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">选择主色调</h2>
        <p className="mt-2 text-sm text-gray-600">
          选择最能代表您品牌的主色调
        </p>
      </div>

      <RadioGroup
        value={primaryColor}
        onValueChange={onPrimaryColorChange}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3"
      >
        {colors.map((color) => (
          <div key={color.value}>
            <RadioGroupItem
              value={color.value}
              id={color.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={color.value}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                primaryColor === color.value && "border-primary"
              )}
            >
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: color.color }}
              />
              <span className="mt-2 text-sm font-medium">{color.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
} 