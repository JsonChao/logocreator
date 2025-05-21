import { Button } from "@/components/ui/button";
import { RefreshCwIcon, DownloadIcon, ChevronLeftIcon, AlertCircleIcon, HeartIcon, Share2Icon } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import Spinner from "../Spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface PreviewStepProps {
  generatedImages: string[];
  companyName: string;
  isLoading: boolean;
  errorMessage?: string;
  onGenerateLogo: () => void;
  onDownloadLogo: (format: "png" | "svg" | "jpg") => void;
  onBack?: () => void;
}

export default function PreviewStep({
  generatedImages,
  companyName,
  isLoading,
  errorMessage,
  onGenerateLogo,
  onDownloadLogo,
  onBack
}: PreviewStepProps) {
  const { isSignedIn } = useUser();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(0);
  const [likedImages, setLikedImages] = useState<number[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetryActive, setAutoRetryActive] = useState(false);

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
        title: "Removed from Favorites",
        description: "You can add it back to favorites anytime",
        variant: "default",
      });
    } else {
      setLikedImages([...likedImages, index]);
      toast({
        title: "Added to Favorites",
        description: "You can view all favorites in your account",
        variant: "default",
      });
    }
  };

  const copyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In actual implementation should generate a real sharing link
    navigator.clipboard.writeText(`https://logocreator.ai/share/${companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`);
    toast({
      title: "Link Copied to Clipboard",
      description: "You can share this link with others",
      variant: "default",
    });
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
        <h3 className="mb-3 text-2xl font-semibold text-gray-900">Logo Generation Failed</h3>
        <p className="mb-8 max-w-md text-center text-lg text-gray-600">
          {isQueueFullError ? (
            "Replicate service is temporarily busy. Please wait a few minutes and try again."
          ) : isTimeoutError ? (
            "The generation request timed out. This may be due to server congestion. Please try again later."
          ) : (
            errorMessage || "An unknown error occurred. Please try again later."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleRetry}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
            disabled={isLoading || autoRetryActive}
          >
            {isLoading ? "Retrying..." : "Retry Now"}
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
                  <span>Waiting for retry...</span>
                </div>
              ) : (
                "Auto Retry in 30s"
              )}
            </Button>
          )}
        </div>
        {retryCount > 0 && (
          <p className="mt-4 text-base text-gray-500">
            Retried {retryCount} times.
            {isQueueFullError ? " Service still busy, consider trying a different logo style or trying again later." : ""}
          </p>
        )}
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
          <h1 className="text-5xl font-bold text-gray-900">Your Logo Gallery</h1>
          {generatedImages.length > 0 && (
            <p className="mt-4 text-xl text-gray-600">Click on a logo to view detailed options</p>
          )}
        </div>
        
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <Spinner className="h-20 w-20" />
            <p className="mt-8 text-xl font-medium text-gray-700">正在生成您的Logo作品集...</p>
            <p className="mt-3 text-base text-gray-600">生成18张高质量Logo需要3-5分钟时间</p>
            <p className="mt-2 text-sm text-gray-500">AI正在精心设计多种风格的Logo方案，请耐心等待</p>
          </motion.div>
        ) : errorMessage ? (
          renderErrorState()
        ) : generatedImages.length > 0 ? (
          <>
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
                        Design #{index + 1}
                      </div>
                      {likedImages.includes(index) && (
                        <div className="flex items-center text-sm">
                          <HeartIcon className="mr-1 h-4 w-4 fill-white" />
                          Favorited
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {selectedImageIndex !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{companyName}</h3>
                    <p className="mt-2 text-base text-gray-500">Design #{selectedImageIndex + 1} · Multiple logo versions generated for you</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 rounded-xl border-gray-200 px-5 py-2.5 text-base"
                      onClick={copyShareLink}
                    >
                      <Share2Icon className="h-5 w-5" />
                      <span>Share</span>
                    </Button>
                    
                    {isSignedIn ? (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 rounded-xl border-gray-200 px-5 py-2.5 text-base"
                        onClick={() => onGenerateLogo()}
                        disabled={isLoading}
                      >
                        <RefreshCwIcon className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                        <span>{isLoading ? "Generating..." : "Regenerate"}</span>
                      </Button>
                    ) : (
                      <SignInButton mode="modal">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 rounded-xl border-gray-200 px-5 py-2.5 text-base"
                        >
                          <RefreshCwIcon className="h-5 w-5" />
                          <span>Sign in to Regenerate</span>
                        </Button>
                      </SignInButton>
                    )}
                    
                    <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
                      <PopoverTrigger asChild>
                        {isSignedIn ? (
                          <Button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-base text-white hover:bg-blue-700">
                            <DownloadIcon className="h-5 w-5" />
                            <span>Download</span>
                          </Button>
                        ) : (
                          <SignInButton mode="modal">
                            <Button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-base text-white hover:bg-blue-700">
                              <DownloadIcon className="h-5 w-5" />
                              <span>Sign in to Download</span>
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
                              PNG Format
                              <span className="ml-2 text-sm text-gray-500">(Bitmap)</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start text-base" 
                              onClick={() => {
                                onDownloadLogo('svg');
                                setShowExportOptions(false);
                              }}
                            >
                              SVG Format
                              <span className="ml-2 text-sm text-gray-500">(Vector)</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start text-base" 
                              onClick={() => {
                                onDownloadLogo('jpg');
                                setShowExportOptions(false);
                              }}
                            >
                              JPG Format
                              <span className="ml-2 text-sm text-gray-500">(Compressed)</span>
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
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Image
                src="/logo-placeholder.svg"
                alt="Logo placeholder"
                width={56}
                height={56}
                className="opacity-70"
              />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-gray-900">No Logo Generated Yet</h3>
            <p className="mb-10 max-w-md text-center text-lg text-gray-600">
              Click the button below to start generating your professional logo
            </p>
            
            {isSignedIn ? (
              <Button
                onClick={onGenerateLogo}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Logo"}
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button 
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
                >
                  Sign in to Generate
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
              Back
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
} 