"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EyeIcon, ChevronLeftIcon, DownloadIcon, TrashIcon, HeartIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface LogoHistory {
  id: string;
  createdAt: string;
  companyName: string;
  style: string;
  primaryColor: string;
  backgroundColor: string;
  imageUrl: string;
  liked: boolean;
}

export default function HistoryPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logoHistory, setLogoHistory] = useState<LogoHistory[]>([]);
  const [likedLogos, setLikedLogos] = useState<LogoHistory[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [previewLogo, setPreviewLogo] = useState<LogoHistory | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Fetch user's logo history from API
  useEffect(() => {
    const fetchLogoHistory = async () => {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // 添加时间戳参数，确保每次请求都是全新的，避免浏览器缓存
        const timeStamp = new Date().getTime();
        const response = await fetch(`/api/user-logos?t=${timeStamp}`);
        
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        
        const data = await response.json();
        setLogoHistory(data);
        setLikedLogos(data.filter((logo: LogoHistory) => logo.liked));
      } catch (error) {
        console.error("Failed to fetch logo history:", error);
        toast({
          title: "Failed to fetch logo history",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogoHistory();
  }, [isSignedIn]);
  
  // Toggle favorite status
  const toggleLike = async (id: string) => {
    try {
      // Optimistically update UI
      setLogoHistory(prev => 
        prev.map(logo => 
          logo.id === id ? { ...logo, liked: !logo.liked } : logo
        )
      );
      
      // Update favorites list
      const updatedHistory = [...logoHistory];
      const logoIndex = updatedHistory.findIndex(logo => logo.id === id);
      const toggledLogo = updatedHistory[logoIndex];
      
      if (toggledLogo) {
        const newLikedState = !toggledLogo.liked;
        
        // Update API
        const response = await fetch('/api/user-logos', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            liked: newLikedState
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        
        // Update favorites list
        if (newLikedState) {
          // Add to favorites
          setLikedLogos(prev => [...prev, { ...toggledLogo, liked: true }]);
          toast({
            title: "Added to favorites",
            description: "Logo has been added to your favorites",
          });
        } else {
          // Remove from favorites
          setLikedLogos(prev => prev.filter(logo => logo.id !== id));
          toast({
            title: "Removed from favorites",
            description: "Logo has been removed from your favorites",
          });
        }
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      
      // Rollback UI changes
      setLogoHistory(prev => 
        prev.map(logo => 
          logo.id === id ? { ...logo, liked: !logo.liked } : logo
        )
      );
      
      toast({
        title: "Failed to update favorite status",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Delete logo
  const deleteLogo = async (id: string) => {
    try {
      // Optimistically update UI
      const logoToDelete = logoHistory.find(logo => logo.id === id);
      setLogoHistory(prev => prev.filter(logo => logo.id !== id));
      setLikedLogos(prev => prev.filter(logo => logo.id !== id));
      
      // Call API to delete
      const response = await fetch(`/api/user-logos?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      
      toast({
        title: "Logo deleted",
        description: "Logo has been deleted from your history",
      });
    } catch (error) {
      console.error("Failed to delete logo:", error);
      
      // Rollback UI changes
      const logoToRestore = logoHistory.find(logo => logo.id === id);
      if (logoToRestore) {
        setLogoHistory(prev => [...prev, logoToRestore]);
        if (logoToRestore.liked) {
          setLikedLogos(prev => [...prev, logoToRestore]);
        }
      }
      
      toast({
        title: "Failed to delete logo",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Preview logo
  const previewLogoHandler = (logo: LogoHistory) => {
    setPreviewLogo(logo);
    setShowPreview(true);
  };
  
  // Download logo
  const downloadLogo = async (logo: LogoHistory, format: 'png' | 'svg' | 'jpg') => {
    try {
      toast({
        title: `Downloading ${format.toUpperCase()}`,
        description: `${logo.companyName} logo is being downloaded...`,
      });
      
      // In a real project, there should be a download API call here
      // Simple download simulation
      const response = await fetch(logo.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${logo.companyName.toLowerCase().replace(/\s+/g, '-')}-logo.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download successful",
        description: `${logo.companyName} logo has been downloaded in ${format.toUpperCase()} format`,
      });
    } catch (error) {
      console.error("Failed to download logo:", error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Sort logos according to selected method
  const sortedLogos = [...logoHistory].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "nameAZ":
        return a.companyName.localeCompare(b.companyName);
      case "nameZA":
        return b.companyName.localeCompare(a.companyName);
      default:
        return 0;
    }
  });

  // View when not logged in
  if (!isSignedIn && !loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4 py-24 pt-32 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center mb-8">Logo History</h1>
          <p className="text-xl text-center text-gray-600 mb-8">Please log in to view your logo history</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-24 pt-32">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
          <Button variant="ghost" asChild className="mr-2 h-9 px-2 md:px-4 w-fit">
            <Link href="/">
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              <span>Home</span>
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">My Logos</h1>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Spinner className="h-12 w-12" />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList className="w-full md:w-auto grid grid-cols-2">
                  <TabsTrigger value="all" className="rounded-md">All Logos</TabsTrigger>
                  <TabsTrigger value="favorites" className="rounded-md">My Favorites</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                    <p className="text-sm text-gray-600">Total: {logoHistory.length} logos</p>
                    <div className="flex-1 sm:max-w-[180px]">
                      <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="nameAZ">Company Name (A-Z)</SelectItem>
                          <SelectItem value="nameZA">Company Name (Z-A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {logoHistory.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
                      <p className="text-gray-500 mb-4">You haven't created any logos yet</p>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/create">Create Your First Logo</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
                      {sortedLogos.map((logo) => (
                        <LogoCard 
                          key={logo.id}
                          logo={logo}
                          onPreview={previewLogoHandler}
                          onLike={toggleLike}
                          onDelete={deleteLogo}
                          onDownload={downloadLogo}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="favorites">
                  <div className="flex items-center mt-4">
                    <p className="text-sm text-gray-600">Total: {likedLogos.length} favorited logos</p>
                  </div>
                  
                  {likedLogos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
                      <p className="text-gray-500">You haven't favorited any logos yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
                      {likedLogos.map((logo) => (
                        <LogoCard 
                          key={logo.id}
                          logo={logo}
                          onPreview={previewLogoHandler}
                          onLike={toggleLike}
                          onDelete={deleteLogo}
                          onDownload={downloadLogo}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <Button asChild className="bg-blue-600 hover:bg-blue-700 shrink-0 w-full md:w-auto">
                <Link href="/create">Create New Logo</Link>
              </Button>
            </div>
          </>
        )}
        
        {/* Logo preview dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-lg">
            {previewLogo && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">{previewLogo.companyName}</h2>
                <div className="relative w-full aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={previewLogo.imageUrl}
                    alt={previewLogo.companyName}
                    fill
                    className="object-contain p-4"
                    unoptimized
                  />
                </div>
                <div className="flex flex-wrap gap-2 w-full justify-center mb-2">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadLogo(previewLogo, 'png')}
                    className="flex items-center gap-1.5 h-9 text-sm"
                    size="sm"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    PNG
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadLogo(previewLogo, 'svg')}
                    className="flex items-center gap-1.5 h-9 text-sm"
                    size="sm"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    SVG
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadLogo(previewLogo, 'jpg')}
                    className="flex items-center gap-1.5 h-9 text-sm"
                    size="sm"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    JPG
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 w-full text-sm">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Created On</p>
                    <p>{new Date(previewLogo.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Style</p>
                    <p className="capitalize">{previewLogo.style}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Primary Color</p>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-1.5"
                        style={{ backgroundColor: previewLogo.primaryColor }}
                      ></div>
                      {previewLogo.primaryColor}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Background Color</p>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-1.5 border border-gray-200"
                        style={{ backgroundColor: previewLogo.backgroundColor }}
                      ></div>
                      {previewLogo.backgroundColor}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
}

// Logo card component
function LogoCard({ 
  logo, 
  onPreview, 
  onLike, 
  onDelete,
  onDownload
}: { 
  logo: LogoHistory; 
  onPreview: (logo: LogoHistory) => void; 
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (logo: LogoHistory, format: 'png' | 'svg' | 'jpg') => void;
}) {
  const [showOptions, setShowOptions] = useState(false);
  
  // 格式化日期为更简洁的格式 (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
    >
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg font-medium">{logo.companyName}</CardTitle>
          <CardDescription className="text-xs text-gray-500 mt-1">
            Created on {formatDate(logo.createdAt)}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-full ${logo.liked ? 'text-red-500' : 'text-gray-400'}`}
          onClick={(e) => {
            e.stopPropagation();
            onLike(logo.id);
          }}
        >
          <HeartIcon className={`h-5 w-5 ${logo.liked ? 'fill-current' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent 
        className="p-4 pt-2 pb-2 cursor-pointer flex-grow"
        onClick={() => onPreview(logo)}
      >
        <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center aspect-square mb-3">
          <div className="relative w-full h-full">
            <Image
              src={logo.imageUrl}
              alt={logo.companyName}
              fill
              className="object-contain p-4"
              unoptimized
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <Button variant="secondary" size="sm" className="bg-white shadow-sm">
                <EyeIcon className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: logo.primaryColor }}
            ></div>
            <span>Primary</span>
          </div>
          <div>Style: <span className="capitalize">{logo.style}</span></div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-2 flex justify-between items-center border-t border-gray-100 mt-auto">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(logo);
            }}
          >
            <EyeIcon className="h-3.5 w-3.5 mr-1" />
            Preview
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            className="h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
          >
            <DownloadIcon className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(logo.id);
          }}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
      
      {/* Download options */}
      {showOptions && (
        <div className="absolute bottom-16 left-4 bg-white rounded-md shadow-lg border border-gray-200 p-2 z-10">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(logo, 'png');
              setShowOptions(false);
            }}
          >
            PNG Format
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(logo, 'svg');
              setShowOptions(false);
            }}
          >
            SVG Format
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(logo, 'jpg');
              setShowOptions(false);
            }}
          >
            JPG Format
          </Button>
        </div>
      )}
    </motion.div>
  );
} 