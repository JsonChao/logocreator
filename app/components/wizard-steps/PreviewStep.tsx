import Image from "next/image";
import { Button } from "../ui/button";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import Spinner from "../Spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface PreviewStepProps {
  generatedImages: string[];
  companyName: string;
  isLoading: boolean;
  onGenerateLogo: () => Promise<void>;
  onDownloadLogo: (format: 'png' | 'svg' | 'jpg') => void;
}

export default function PreviewStep({
  generatedImages,
  companyName,
  isLoading,
  onGenerateLogo,
  onDownloadLogo,
}: PreviewStepProps) {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-5xl rounded-2xl bg-white px-8 py-12 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">选择您喜欢的Logo设计</h1>
          <p className="text-gray-600">点击Logo可以下载或生成新的设计</p>
        </div>
        
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : generatedImages.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {generatedImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50 transition-all hover:border-blue-400 hover:shadow-lg">
                    <Image
                      src={imageUrl}
                      alt={`${companyName} logo design ${index + 1}`}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-0 transition-all group-hover:bg-opacity-10">
                    <div className="transform opacity-0 transition-all group-hover:opacity-100">
                      <Button variant="secondary" className="bg-white shadow-lg">
                        选择此设计
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedImageIndex !== null && (
              <div className="mt-8 flex justify-center space-x-4">
                <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
                  <PopoverTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <DownloadIcon className="h-4 w-4" />
                      下载Logo
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => onDownloadLogo('png')}
                      >
                        下载 PNG
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => onDownloadLogo('svg')}
                      >
                        下载 SVG
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => onDownloadLogo('jpg')}
                      >
                        下载 JPG
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={onGenerateLogo}
                  disabled={isLoading}
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  重新生成
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-gray-500">还没有生成任何Logo</p>
            <Button
              size="lg"
              className="rounded-xl bg-blue-500 px-8 py-2 text-base font-semibold text-white shadow-md transition hover:bg-blue-600 focus:ring-2 focus:ring-blue-200"
              onClick={onGenerateLogo}
              disabled={isLoading}
            >
              {isLoading ? "正在生成..." : "生成Logo"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 