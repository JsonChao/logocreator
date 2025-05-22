import { Button } from "@/components/ui/button";
import { RefreshCwIcon, DownloadIcon, ChevronLeftIcon, AlertCircleIcon, HeartIcon, Share2Icon, ChevronRightIcon, MinusIcon, PlusIcon, ImageIcon } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import Spinner from "../Spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

interface PreviewStepProps {
  generatedImages: string[];
  companyName: string;
  isLoading: boolean;
  errorMessage?: string;
  logoCount: number;
  onLogoCountChange: (count: number) => void;
  onGenerateLogo: () => void;
  onDownloadLogo: (format: "png" | "svg" | "jpg") => void;
  onBack?: () => void;
  onLoadMore?: () => void;
}

export default function PreviewStep({
  generatedImages,
  companyName,
  isLoading,
  errorMessage,
  logoCount,
  onLogoCountChange,
  onGenerateLogo,
  onDownloadLogo,
  onBack,
  onLoadMore
}: PreviewStepProps) {
  const { isSignedIn } = useUser();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(0);
  const [likedImages, setLikedImages] = useState<number[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetryActive, setAutoRetryActive] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLoadMoreOptions, setShowLoadMoreOptions] = useState(false);
  const [moreLogoCount, setMoreLogoCount] = useState(logoCount);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    try {
      await onGenerateLogo();
    } catch (error) {
      console.error("Generation retry failed:", error);
      toast({
        title: "Logo Generation Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleAutoRetry = () => {
    setAutoRetryActive(true);
    toast({
      title: "Auto Retry Activated",
      description: "System will automatically retry in 30 seconds",
    });
    
    setTimeout(() => {
      handleRetry();
      setAutoRetryActive(false);
    }, 30000);
  };

  const toggleLike = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedImages.includes(index)) {
      setLikedImages(likedImages.filter(i => i !== index));
      toast({
        title: "已从收藏夹移除",
        description: "您可以随时将其添加回收藏夹",
        variant: "default",
      });
    } else {
      setLikedImages([...likedImages, index]);
      toast({
        title: "已添加到收藏夹",
        description: "您可以在您的账户中查看所有收藏",
        variant: "default",
      });
    }
  };

  const copyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In actual implementation should generate a real sharing link
    navigator.clipboard.writeText(`https://logocreator.ai/share/${companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`);
    toast({
      title: "链接已复制到剪贴板",
      description: "您可以与他人分享此链接",
      variant: "default",
    });
  };

  const handleLoadMore = async () => {
    if (!onLoadMore || isLoading || loadingMore) return;
    
    setLoadingMore(true);
    try {
      // 在执行onLoadMore之前，先更新主logoCount
      onLogoCountChange(moreLogoCount);
      
      // 添加等待时间让logoCount更新在状态中生效
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await onLoadMore();
      toast({
        title: "加载更多Logo",
        description: `正在为您生成${moreLogoCount}个额外的Logo设计方案`,
      });
      
      // 关闭数量选择对话框
      setShowLoadMoreOptions(false);
    } catch (error) {
      console.error("加载更多Logo失败:", error);
      toast({
        variant: "destructive",
        title: "加载失败",
        description: error instanceof Error ? error.message : "请稍后再试",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const incrementLogoCount = () => {
    if (logoCount < 12) {
      onLogoCountChange(logoCount + 1);
    }
  };

  const decrementLogoCount = () => {
    if (logoCount > 1) {
      onLogoCountChange(logoCount - 1);
    }
  };

  const incrementMoreLogoCount = () => {
    if (moreLogoCount < 12) {
      setMoreLogoCount(moreLogoCount + 1);
    }
  };

  const decrementMoreLogoCount = () => {
    if (moreLogoCount > 1) {
      setMoreLogoCount(moreLogoCount - 1);
    }
  };

  // Function to display error messages
  const renderErrorState = () => {
    const isQueueFullError = !!errorMessage && (
      errorMessage.includes("Queue is full") || 
      errorMessage.includes("busy") ||
      errorMessage.includes("temporarily busy")
    );
    
    const isTimeoutError = !!errorMessage && (
      errorMessage.includes("timeout") ||
      errorMessage.includes("timed out")
    );
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12 shadow-sm"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircleIcon size={48} />
        </div>
        <h3 className="mb-3 text-2xl font-semibold text-gray-900">Logo生成失败</h3>
        <p className="mb-8 max-w-md text-center text-lg text-gray-600">
          {isQueueFullError ? (
            "Replicate服务暂时繁忙。请等待几分钟后重试。"
          ) : isTimeoutError ? (
            "生成请求超时。这可能是由于服务器拥堵。请稍后再试。"
          ) : (
            errorMessage || "发生未知错误。请稍后再试。"
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleRetry}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
            disabled={isLoading || autoRetryActive}
          >
            {isLoading ? "重试中..." : "立即重试"}
          </Button>
          {isQueueFullError && (
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-xl border-gray-300 px-8 py-3 text-lg font-medium"
              onClick={handleAutoRetry}
              disabled={isLoading || autoRetryActive}
            >
              {autoRetryActive ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-5 w-5" />
                  <span>等待重试中...</span>
                </div>
              ) : (
                "30秒后自动重试"
              )}
            </Button>
          )}
        </div>
        {retryCount > 0 && (
          <p className="mt-4 text-base text-gray-500">
            已重试 {retryCount} 次。
            {isQueueFullError ? " 服务仍然繁忙，建议尝试不同的Logo风格或稍后再试。" : ""}
          </p>
        )}
      </motion.div>
    );
  };

  // Logo quantity selector
  const renderLogoQuantitySelector = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <ImageIcon className="mr-2 text-blue-500" size={20} />
          选择要生成的Logo数量
        </h3>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">选择您想创建的Logo变体数量 (1-12)</p>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon"
                onClick={decrementLogoCount}
                disabled={logoCount <= 1 || isLoading}
                className="h-8 w-8 rounded-full"
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              
              <span className="mx-4 font-bold text-xl w-6 text-center">{logoCount}</span>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={incrementLogoCount}
                disabled={logoCount >= 12 || isLoading}
                className="h-8 w-8 rounded-full"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="pt-2">
            <Slider
              value={[logoCount]}
              min={1}
              max={12}
              step={1}
              onValueChange={(value) => onLogoCountChange(value[0])}
              disabled={isLoading}
              className="mx-1"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>1</span>
              <span>6</span>
              <span>12</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg mt-2">
            <p>
              {logoCount <= 3 ? 
                "生成少量精选方案 (最快生成时间)" : 
                logoCount <= 6 ? 
                "平衡的设计变体选择 (推荐)" : 
                "探索广泛的设计可能性 (生成时间较长)"
              }
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // 创建一个渲染加载更多数量选择器的函数
  const renderLoadMoreQuantitySelector = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <ImageIcon className="mr-2 text-blue-500" size={20} />
          选择要加载的额外Logo数量
        </h3>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">选择您想要额外创建的Logo变体数量 (1-12)</p>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon"
                onClick={decrementMoreLogoCount}
                disabled={moreLogoCount <= 1 || loadingMore}
                className="h-8 w-8 rounded-full"
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              
              <span className="mx-4 font-bold text-xl w-6 text-center">{moreLogoCount}</span>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={incrementMoreLogoCount}
                disabled={moreLogoCount >= 12 || loadingMore}
                className="h-8 w-8 rounded-full"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="pt-2">
            <Slider
              value={[moreLogoCount]}
              min={1}
              max={12}
              step={1}
              onValueChange={(value) => setMoreLogoCount(value[0])}
              disabled={loadingMore}
              className="mx-1"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>1</span>
              <span>6</span>
              <span>12</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg mt-2">
            <p>
              {moreLogoCount <= 3 ? 
                "生成少量精选方案 (最快生成时间)" : 
                moreLogoCount <= 6 ? 
                "平衡的设计变体选择 (推荐)" : 
                "探索广泛的设计可能性 (生成时间较长)"
              }
            </p>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLoadMoreOptions(false)}
              className="flex-1"
              disabled={loadingMore}
            >
              取消
            </Button>
            <Button
              onClick={handleLoadMore}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              disabled={loadingMore}
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span>加载中...</span>
                </div>
              ) : (
                `加载 ${moreLogoCount} 个更多Logo`
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl space-y-10"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">您的Logo画廊</h1>
          {generatedImages.length > 0 && (
            <p className="mt-4 text-xl text-gray-600">点击一个Logo查看详细选项</p>
          )}
        </div>
        
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <Spinner className="h-20 w-20" />
            <p className="mt-8 text-xl font-medium text-gray-700">正在生成您的Logo集合...</p>
            <p className="mt-3 text-base text-gray-600">生成 {logoCount} 个高质量Logo需要2-{Math.round(logoCount * 0.5)}分钟</p>
            <p className="mt-2 text-sm text-gray-500">AI正在精心制作多种风格的Logo变体，请耐心等待</p>
          </motion.div>
        ) : errorMessage ? (
          renderErrorState()
        ) : generatedImages.length > 0 ? (
          <>
            {showLoadMoreOptions && (
              <div className="mb-8">
                {renderLoadMoreQuantitySelector()}
              </div>
            )}
            
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              {generatedImages.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
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
                      alt={`${companyName} logo design ${index + 1}`}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                    <div className="transform scale-90 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                      {selectedImageIndex !== index && (
                        <Button
                          variant="secondary"
                          className="bg-white px-6 py-2 text-base shadow-lg"
                        >
                          Select
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute right-3 top-3 flex space-x-2">
                    <button 
                      className={`rounded-full p-2 shadow-md transition ${
                        likedImages.includes(index) 
                          ? "bg-red-500 text-white" 
                          : "bg-white text-gray-400 opacity-0 group-hover:opacity-100"
                      }`}
                      onClick={(e) => toggleLike(index, e)}
                    >
                      <HeartIcon 
                        className={`h-5 w-5 ${likedImages.includes(index) ? "fill-white" : ""}`}
                      />
                    </button>
                  </div>
                  
                  {selectedImageIndex === index && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-gradient-to-t from-black/40 to-transparent p-4 text-white">
                      <div className="text-base font-medium">
                        设计 #{index + 1}
                      </div>
                      {likedImages.includes(index) && (
                        <div className="flex items-center text-sm">
                          <HeartIcon className="mr-1 h-4 w-4 fill-white" />
                          已收藏
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {onLoadMore && isSignedIn && !showLoadMoreOptions && (
              <div className="mt-8 flex justify-start">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMoreLogoCount(logoCount); // 默认使用和主生成相同的数量
                    setShowLoadMoreOptions(true);
                  }}
                  className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 focus:outline-none" 
                  disabled={isLoading || loadingMore}
                >
                  <span className="text-lg">查看更多Logo</span>
                  <ChevronRightIcon className="h-4 w-4" />
                  <ChevronRightIcon className="h-4 w-4 -ml-3" />
                </Button>
              </div>
            )}
            
            {selectedImageIndex !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{companyName}</h3>
                    <p className="mt-2 text-base text-gray-500">设计 #{selectedImageIndex + 1} · 为您生成的多个Logo版本</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 rounded-xl border-gray-200 px-5 py-2.5 text-base"
                      onClick={copyShareLink}
                    >
                      <Share2Icon className="h-5 w-5" />
                      <span>分享</span>
                    </Button>
                    
                    {isSignedIn ? (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 rounded-xl border-gray-200 px-5 py-2.5 text-base"
                        onClick={() => onGenerateLogo()}
                        disabled={isLoading}
                      >
                        <RefreshCwIcon className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                        <span>{isLoading ? "生成中..." : "重新生成"}</span>
                      </Button>
                    ) : (
                      <SignInButton mode="modal">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 rounded-xl border-gray-200 px-5 py-2.5 text-base"
                        >
                          <RefreshCwIcon className="h-5 w-5" />
                          <span>登录以重新生成</span>
                        </Button>
                      </SignInButton>
                    )}
                    
                    <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
                      <PopoverTrigger asChild>
                        {isSignedIn ? (
                          <Button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-base text-white hover:bg-blue-700">
                            <DownloadIcon className="h-5 w-5" />
                            <span>下载</span>
                          </Button>
                        ) : (
                          <SignInButton mode="modal">
                            <Button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-base text-white hover:bg-blue-700">
                              <DownloadIcon className="h-5 w-5" />
                              <span>登录以下载</span>
                            </Button>
                          </SignInButton>
                        )}
                      </PopoverTrigger>
                      {isSignedIn && (
                        <PopoverContent className="w-56 p-3">
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="ghost" 
                              className="justify-start text-base" 
                              onClick={() => {
                                onDownloadLogo('png');
                                setShowExportOptions(false);
                              }}
                            >
                              PNG格式
                              <span className="ml-2 text-sm text-gray-500">(位图)</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start text-base" 
                              onClick={() => {
                                onDownloadLogo('svg');
                                setShowExportOptions(false);
                              }}
                            >
                              SVG格式
                              <span className="ml-2 text-sm text-gray-500">(矢量)</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start text-base" 
                              onClick={() => {
                                onDownloadLogo('jpg');
                                setShowExportOptions(false);
                              }}
                            >
                              JPG格式
                              <span className="ml-2 text-sm text-gray-500">(压缩)</span>
                            </Button>
                          </div>
                        </PopoverContent>
                      )}
                    </Popover>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-16 shadow-sm"
          >
            {renderLogoQuantitySelector()}
            
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Image
                src="/logo-placeholder.svg"
                alt="Logo占位图"
                width={56}
                height={56}
                className="opacity-70"
              />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-gray-900">尚未生成Logo</h3>
            <p className="mb-10 max-w-md text-center text-lg text-gray-600">
              点击下方按钮生成 {logoCount} 个专业Logo{logoCount > 1 ? '' : ''}
            </p>
            
            {isSignedIn ? (
              <Button
                onClick={onGenerateLogo}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "生成中..." : "生成Logo"}
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button 
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
                >
                  登录以生成
                </Button>
              </SignInButton>
            )}
          </motion.div>
        )}
        
        {onBack && (
          <div className="mt-8 flex justify-start">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl border-gray-200 px-8 py-3 text-lg font-medium"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              返回
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
} 