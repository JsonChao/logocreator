import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InfoTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="ml-1 cursor-help">
          <Info className="h-3.5 w-3.5 text-blue-500" />
        </TooltipTrigger>
        <TooltipContent
          className="max-w-[200px] bg-white text-xs text-gray-700 shadow-lg"
          align="center"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
