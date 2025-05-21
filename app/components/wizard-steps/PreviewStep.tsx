import Image from "next/image";
import { Button } from "../ui/button";
import { DownloadIcon, RefreshCwIcon, PencilIcon, HeartIcon, Share2Icon } from "lucide-react";
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
        title: "Removed from favorites",
        description: "You can add it back to favorites anytime",
        variant: "default",
      });
    } else {
      setLikedImages([...likedImages, index]);
      toast({
        title: "Added to favorites",
        description: "You can view all favorites in your account",
        variant: "default",
      });
    }
  };

  const copyShareLink = (e: React.MouseEvent) => {
    e.preventDefault();
    // 实际实现中应生成一个真实的分享链接
    navigator.clipboard.writeText(`https://logocreator.ai/share/${companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`);
    toast({
      title: "Link copied to clipboard",
      description: "You can share this link with others",
      variant: "default",
    });
  };

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Your Logo Gallery</h1>
          {generatedImages.length > 0 && (
            <p className="mt-3 text-lg text-gray-600">Click on a logo for detailed options</p>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner />
            <p className="mt-6 text-gray-600">Generating your logo, please wait...</p>
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
                      alt={`${companyName} logo design ${index + 1}`}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                    <div className="transform scale-90 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                      {selectedImageIndex !== index && (
                        <Button variant="secondary" className="bg-white px-6 shadow-lg">
                          Select
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
                        Design #{index + 1}
                      </div>
                      {likedImages.includes(index) && (
                        <div className="flex items-center text-xs">
                          <HeartIcon className="mr-1 h-3 w-3 fill-white" />
                          Favorited
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
                    <p className="mt-1 text-sm text-gray-500">Design #{selectedImageIndex + 1} · Multiple logo versions generated for you</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-xl border-gray-200"
                      onClick={copyShareLink}
                    >
                      <Share2Icon className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-xl border-gray-200"
                      onClick={() => onGenerateLogo()}
                    >
                      <RefreshCwIcon className="h-4 w-4" />
                      <span>Regenerate</span>
                    </Button>
                    
                    <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
                      <PopoverTrigger asChild>
                        <Button className="flex items-center gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                          <DownloadIcon className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2">
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="ghost" 
                            className="justify-start text-sm" 
                            onClick={() => onDownloadLogo('png')}
                          >
                            PNG Format
                            <span className="ml-2 text-xs text-gray-500">(Bitmap)</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="justify-start text-sm" 
                            onClick={() => onDownloadLogo('svg')}
                          >
                            SVG Format
                            <span className="ml-2 text-xs text-gray-500">(Vector)</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="justify-start text-sm" 
                            onClick={() => onDownloadLogo('jpg')}
                          >
                            JPG Format
                            <span className="ml-2 text-xs text-gray-500">(Compressed Bitmap)</span>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Button
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-xl border-gray-200"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
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
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No logos generated yet</h3>
            <p className="mb-8 max-w-md text-center text-gray-600">
              Click the button below to start generating your professional logo
            </p>
            <Button
              onClick={onGenerateLogo}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Logo"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 