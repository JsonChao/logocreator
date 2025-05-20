import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface StyleSelectionStepProps {
  style: string;
  onStyleChange: (style: string) => void;
}

export function StyleSelectionStep({
  style,
  onStyleChange,
}: StyleSelectionStepProps) {
  const styles = [
    { value: "tech", label: "科技感", description: "现代、简洁、专业" },
    { value: "flashy", label: "炫酷", description: "大胆、动感、引人注目" },
    { value: "modern", label: "现代", description: "简约、时尚、优雅" },
    { value: "playful", label: "活泼", description: "有趣、友好、充满活力" },
    { value: "abstract", label: "抽象", description: "艺术、独特、创意" },
    { value: "minimal", label: "极简", description: "简洁、清晰、优雅" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">选择Logo风格</h2>
        <p className="mt-2 text-sm text-gray-600">
          选择最适合您品牌的Logo风格
        </p>
      </div>

      <RadioGroup
        value={style}
        onValueChange={onStyleChange}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {styles.map((styleOption) => (
          <div key={styleOption.value}>
            <RadioGroupItem
              value={styleOption.value}
              id={styleOption.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={styleOption.value}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                style === styleOption.value && "border-primary"
              )}
            >
              <div className="text-center">
                <span className="text-lg font-medium">{styleOption.label}</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {styleOption.description}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
} 