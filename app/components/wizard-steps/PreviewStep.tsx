import { Button } from "@/components/ui/button";
import { RefreshCwIcon, DownloadIcon, ChevronLeftIcon, AlertCircleIcon, HeartIcon, Share2Icon, ChevronRightIcon, MinusIcon, PlusIcon, ImageIcon, EyeIcon, EditIcon, ShoppingCartIcon, XIcon } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import Spinner from "../Spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PreviewScene {
  id: string;
  name: string;
  description: string;
  backgroundUrl?: string;
  imageUrl?: string;
}

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
  const [likedImages, setLikedImages] = useState<number[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetryActive, setAutoRetryActive] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLoadMoreOptions, setShowLoadMoreOptions] = useState(false);
  const [moreLogoCount, setMoreLogoCount] = useState(logoCount);
  
  // 用于预览对话框
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadIndex, setDownloadIndex] = useState<number | null>(0);

  // 用于预览场景
  const [previewScenes, setPreviewScenes] = useState<PreviewScene[]>([
    { 
      id: 'logo',
      name: 'Logo', 
      imageUrl: '', // 动态设置
      description: '标准Logo显示'
    },
    { 
      id: 'business-card',
      name: '名片', 
      backgroundUrl: '/preview-scenes/business-card.jpg',
      description: '专业名片设计'
    },
    { 
      id: 'tshirt',
      name: 'T恤', 
      backgroundUrl: '/preview-scenes/tshirt.jpg',
      description: '团队服装定制'
    },
    { 
      id: 'coffee-cup',
      name: '咖啡杯', 
      backgroundUrl: '/preview-scenes/coffee-cup.jpg',
      description: '品牌周边产品'
    },
    { 
      id: 'shopping-bag',
      name: '购物袋', 
      backgroundUrl: '/preview-scenes/shopping-bag.jpg',
      description: '购物袋设计'
    },
    { 
      id: 'billboard',
      name: '广告牌', 
      backgroundUrl: '/preview-scenes/billboard.jpg',
      description: '户外广告展示'
    },
    { 
      id: 'signage',
      name: '门牌', 
      backgroundUrl: '/preview-scenes/signage.jpg',
      description: '公司门牌设计'
    },
    { 
      id: 'website',
      name: '网站', 
      backgroundUrl: '/preview-scenes/website.jpg',
      description: '网站品牌展示'
    }
  ]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const previewContainerRef = useRef<HTMLDivElement>(null);

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
      
      toast({
        title: "正在生成额外Logo",
        description: `每张Logo需要单独生成，即将生成${moreLogoCount}张，请耐心等待`,
      });
      
      await onLoadMore();
      toast({
        title: "加载更多Logo完成",
        description: `已为您完成${moreLogoCount}张额外Logo的生成`,
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

  // 预览Logo
  const handlePreview = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewIndex(index);
    setCurrentSceneIndex(0); // 重置为第一个场景
    setShowPreview(true);
  };

  // 切换到下一个场景
  const nextScene = () => {
    setCurrentSceneIndex((prev) => 
      prev < previewScenes.length - 1 ? prev + 1 : prev
    );
  };

  // 切换到上一个场景
  const prevScene = () => {
    setCurrentSceneIndex((prev) => 
      prev > 0 ? prev - 1 : prev
    );
  };

  // 处理滑动
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      container.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
      container.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!(e.buttons === 1)) return;
      
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // 滑动速度
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showPreview]);

  // 当预览索引变化时，更新第一个场景的图像URL
  useEffect(() => {
    if (previewIndex !== null && previewIndex >= 0 && generatedImages[previewIndex]) {
      setPreviewScenes(prev => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          imageUrl: generatedImages[previewIndex]
        };
        return updated;
      });
    }
  }, [previewIndex, generatedImages]);

  // 设置要下载的Logo索引
  const handleDownloadSelection = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadIndex(index);
    setShowExportOptions(true);
  };

  // 实际使用所选Logo的索引进行下载
  const handleDownloadLogo = (format: "png" | "svg" | "jpg") => {
    if (downloadIndex !== null) {
      onDownloadLogo(format);
    }
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
            <p className="mt-4 text-xl text-gray-600">选择一个Logo进行预览或下载</p>
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
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition duration-300 hover:shadow-lg"
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
                  
                  {/* 在图片右上角显示收藏按钮 */}
                  <div className="absolute right-3 top-3">
                    <button 
                      className={`rounded-full p-2 shadow-md transition ${
                        likedImages.includes(index) 
                          ? "bg-red-500 text-white" 
                          : "bg-white text-gray-400"
                      }`}
                      onClick={(e) => toggleLike(index, e)}
                    >
                      <HeartIcon 
                        className={`h-5 w-5 ${likedImages.includes(index) ? "fill-white" : ""}`}
                      />
                    </button>
                  </div>
                  
                  {/* 底部按钮栏，类似第二张图片中的设计 */}
                  <div className="flex justify-center space-x-2 py-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      onClick={(e) => handlePreview(index, e)}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>预览</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-500 hover:text-green-700 flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "编辑功能",
                          description: "即将开放，敬请期待！",
                        });
                      }}
                    >
                      <EditIcon className="h-4 w-4" />
                      <span>编辑</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500 hover:text-orange-700 flex items-center gap-1"
                      onClick={(e) => handleDownloadSelection(index, e)}
                    >
                      <ShoppingCartIcon className="h-4 w-4" />
                      <span>购买</span>
                    </Button>
                  </div>
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
            
            {/* 预览Logo的全屏模态框 - 类似竞品设计 */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogContent className="max-w-full w-full h-[calc(100vh-40px)] p-0 border-0 rounded-none bg-white overflow-hidden">
                <div className="relative w-full h-full">
                  {/* 关闭按钮 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 z-50 text-gray-700 hover:text-gray-900 bg-white/80 hover:bg-white/90 rounded-full shadow-md"
                    onClick={() => setShowPreview(false)}
                  >
                    <XIcon className="h-6 w-6" />
                  </Button>

                  {/* 左右切换按钮 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-gray-700 hover:text-gray-900 bg-white/80 hover:bg-white/90 rounded-full shadow-md"
                    onClick={prevScene}
                    disabled={currentSceneIndex === 0}
                  >
                    <ChevronLeftIcon className="h-8 w-8" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-gray-700 hover:text-gray-900 bg-white/80 hover:bg-white/90 rounded-full shadow-md"
                    onClick={nextScene}
                    disabled={currentSceneIndex === previewScenes.length - 1}
                  >
                    <ChevronRightIcon className="h-8 w-8" />
                  </Button>

                  {/* 横向滚动容器 */}
                  <div 
                    ref={previewContainerRef}
                    className="w-full h-full overflow-x-scroll overflow-y-hidden whitespace-nowrap scroll-smooth cursor-grab hide-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {previewScenes.map((scene, index) => (
                      <div 
                        key={scene.id}
                        className="inline-block w-full h-full"
                        style={{ 
                          minWidth: '100%',
                          display: index === currentSceneIndex ? 'block' : 'none'
                        }}
                      >
                        {index === 0 ? (
                          // 第一个场景是纯Logo展示
                          <div className="flex items-center justify-center h-full w-full bg-gray-50">
                            {previewIndex !== null && previewIndex >= 0 && previewIndex < generatedImages.length && (
                              <div className="relative w-3/4 h-3/4 max-w-3xl max-h-3xl">
                                <Image
                                  src={generatedImages[previewIndex]}
                                  alt={`${companyName} logo design ${previewIndex + 1}`}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          // 其他场景是Logo应用在不同背景中
                          <div className="relative h-full w-full">
                            <div className="absolute inset-0 flex items-center justify-center">
                              {scene.backgroundUrl && (
                                <Image
                                  src={scene.backgroundUrl}
                                  alt={scene.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            
                            {/* Logo叠加层 - 不同场景可能有不同的位置和大小 */}
                            {previewIndex !== null && previewIndex >= 0 && previewIndex < generatedImages.length && (
                              <div className={`absolute ${
                                scene.id === 'business-card' ? 'top-[40%] left-[55%] w-[20%] h-[20%]' :
                                scene.id === 'coffee-cup' ? 'top-[40%] left-[40%] w-[35%] h-[35%]' :
                                scene.id === 'tshirt' ? 'top-[35%] left-[50%] -translate-x-1/2 w-[40%] h-[40%]' :
                                scene.id === 'shopping-bag' ? 'top-[40%] right-[15%] w-[40%] h-[40%]' :
                                scene.id === 'billboard' ? 'top-[30%] left-[50%] -translate-x-1/2 w-[60%] h-[40%]' :
                                scene.id === 'signage' ? 'top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[40%]' :
                                'top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[40%]'
                              }`}>
                                <div className="relative w-full h-full">
                                  <Image
                                    src={generatedImages[previewIndex]}
                                    alt={`${companyName} logo on ${scene.name}`}
                                    fill
                                    className="object-contain"
                                    style={{
                                      filter: scene.id === 'signage' ? 'brightness(0.9) contrast(1.1)' : 'none'
                                    }}
                                    unoptimized
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* 场景底部操作按钮 */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                          <Button 
                            variant="outline"
                            className="bg-white/90 border-gray-300 text-green-600 hover:text-green-800 hover:bg-white"
                            onClick={() => {
                              toast({
                                title: "编辑功能",
                                description: "即将开放，敬请期待！",
                              });
                            }}
                          >
                            <EditIcon className="h-4 w-4 mr-2" />
                            编辑
                          </Button>
                          
                          <Button 
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => {
                              setShowPreview(false);
                              if (previewIndex !== null) {
                                setDownloadIndex(previewIndex);
                                setShowExportOptions(true);
                              }
                            }}
                          >
                            <ShoppingCartIcon className="h-4 w-4 mr-2" />
                            购买
                          </Button>
                        </div>
                        
                        {/* 场景索引指示器 */}
                        <div className="absolute bottom-24 left-0 right-0 flex justify-center space-x-2">
                          {previewScenes.map((_, i) => (
                            <div 
                              key={i} 
                              className={`rounded-full ${currentSceneIndex === i ? 'w-3 h-3 bg-blue-500' : 'w-2 h-2 bg-gray-300'}`}
                              onClick={() => setCurrentSceneIndex(i)}
                            />
                          ))}
                        </div>
                        
                        {/* 场景名称和描述 */}
                        <div className="absolute top-6 left-0 right-0 text-center">
                          <h3 className="text-xl font-bold">{companyName} - {scene.name}</h3>
                          <p className="text-sm text-gray-600">{scene.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Logo下载选项弹窗 */}
            <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
              <PopoverContent className="w-56 p-3">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold mb-2">选择下载格式</h3>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-base" 
                    onClick={() => {
                      handleDownloadLogo('png');
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
                      handleDownloadLogo('svg');
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
                      handleDownloadLogo('jpg');
                      setShowExportOptions(false);
                    }}
                  >
                    JPG格式
                    <span className="ml-2 text-sm text-gray-500">(压缩)</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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