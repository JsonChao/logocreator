import Image from "next/image";
import { Button } from "../ui/button";
import { DownloadIcon, RefreshCwIcon, PencilIcon, HeartIcon, CheckIcon, Share2Icon } from "lucide-react";
import Spinner from "../Spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(0);
  const [likedImages, setLikedImages] = useState<number[]>([]);

  const toggleLike = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedImages.includes(index)) {
      setLikedImages(likedImages.filter(i => i !== index));
      toast({
        title: "已从收藏中移除",
        description: "您可以随时重新添加到收藏",
        variant: "default",
      });
    } else {
      setLikedImages([...likedImages, index]);
      toast({
        title: "已添加到收藏",
        description: "您可以在个人账户中查看所有收藏",
        variant: "default",
      });
    }
  };

  const copyShareLink = (e: React.MouseEvent) => {
    e.preventDefault();
    // 实际实现中应生成一个真实的分享链接
    navigator.clipboard.writeText(`https://logocreator.ai/share/${companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`);
    toast({
      title: "链接已复制到剪贴板",
      description: "您可以将链接分享给他人",
      variant: "default",
    });
  };

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">您的标志作品集</h1>
          {generatedImages.length > 0 && (
            <p className="mt-3 text-lg text-gray-600">点击标志进行详细操作</p>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner />
            <p className="mt-6 text-gray-600">正在为您生成标志，请稍候...</p>
          </div>
        ) : generatedImages.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {generatedImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 bg-white transition duration-300 hover:shadow-lg ${
                    selectedImageIndex === index 
                      ? "border-blue-500 ring-2 ring-blue-200 shadow-md" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={imageUrl}
                      alt={`${companyName} 标志设计 ${index + 1}`}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                    <div className="transform scale-90 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                      {selectedImageIndex !== index && (
                        <Button variant="secondary" className="bg-white px-6 shadow-lg">
                          选择
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute right-3 top-3 flex space-x-2">
                    <button 
                      className={`rounded-full p-1.5 shadow-md transition ${
                        likedImages.includes(index) 
                          ? "bg-red-500 text-white" 
                          : "bg-white text-gray-400 opacity-0 group-hover:opacity-100"
                      }`}
                      onClick={(e) => toggleLike(index, e)}
                    >
                      <HeartIcon 
                        className={`h-4 w-4 ${likedImages.includes(index) ? "fill-white" : ""}`}
                      />
                    </button>
                  </div>
                  
                  {selectedImageIndex === index && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-gradient-to-t from-black/40 to-transparent p-3 text-white">
                      <div className="text-sm font-medium">
                        设计 #{index + 1}
                      </div>
                      {likedImages.includes(index) && (
                        <div className="flex items-center text-xs">
                          <HeartIcon className="mr-1 h-3 w-3 fill-white" />
                          已收藏
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedImageIndex !== null && (
              <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{companyName}</h3>
                    <p className="mt-1 text-sm text-gray-500">设计 #{selectedImageIndex + 1} · 已为您生成多个标志版本</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-xl border-gray-200"
                      onClick={copyShareLink}
                    >
                      <Share2Icon className="h-4 w-4" />
                      <span>分享</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-xl border-gray-200"
                      onClick={() => onGenerateLogo()}
                    >
                      <RefreshCwIcon className="h-4 w-4" />
                      <span>重新生成</span>
                    </Button>
                    
                    <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
                      <PopoverTrigger asChild>
                        <Button className="flex items-center gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                          <DownloadIcon className="h-4 w-4" />
                          <span>下载</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2">
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="ghost" 
                            className="justify-start text-sm" 
                            onClick={() => onDownloadLogo('png')}
                          >
                            PNG 格式
                            <span className="ml-2 text-xs text-gray-500">(位图)</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="justify-start text-sm" 
                            onClick={() => onDownloadLogo('svg')}
                          >
                            SVG 格式
                            <span className="ml-2 text-xs text-gray-500">(矢量图)</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="justify-start text-sm" 
                            onClick={() => onDownloadLogo('jpg')}
                          >
                            JPG 格式
                            <span className="ml-2 text-xs text-gray-500">(压缩位图)</span>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Button
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-xl border-gray-200"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>编辑</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Image
                src="/logo-placeholder.svg"
                alt="Logo Placeholder"
                width={48}
                height={48}
                className="opacity-70"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">还没有生成标志</h3>
            <p className="mb-8 max-w-md text-center text-gray-600">
              点击下方按钮，开始生成您的专业标志
            </p>
            <Button
              onClick={onGenerateLogo}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "生成中..." : "生成标志"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 