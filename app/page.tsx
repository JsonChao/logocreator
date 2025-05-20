"use client";

import { Button } from "./components/ui/button";
import { toast } from "@/hooks/use-toast";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { domain } from "./lib/domain";
import { convertToJpg, convertToSvg } from "./lib/imageConverter";
import LogoWizard, { WizardData } from "./components/LogoWizard";

const primaryColors = [
  { name: "Blue", color: "#0F6FFF" },
  { name: "Red", color: "#FF0000" },
  { name: "Green", color: "#00FF00" },
  { name: "Yellow", color: "#FFFF00" },
  { name: "Purple", color: "#800080" },
  { name: "Orange", color: "#FFA500" },
  { name: "Pink", color: "#FFC0CB" },
  { name: "Teal", color: "#008080" },
  { name: "Custom", color: "custom" },
];

const backgroundColors = [
  { name: "White", color: "#FFFFFF" },
  { name: "Gray", color: "#CCCCCC" },
  { name: "Black", color: "#000000" },
  { name: "Light Blue", color: "#E6F7FF" },
  { name: "Light Gray", color: "#F0F0F0" },
  { name: "Light Yellow", color: "#FFFDE7" },
  { name: "Custom", color: "custom" },
];

const imageSizes = [
  { name: "Standard (768x768)", width: 768, height: 768 },
  { name: "Small (512x512)", width: 512, height: 512 },
  { name: "Large (1024x1024)", width: 1024, height: 1024 },
  { name: "Wide (1024x512)", width: 1024, height: 512 },
  { name: "Tall (512x1024)", width: 512, height: 1024 },
];

// 保留其他常量定义
const hasClerkConfig = typeof window !== 'undefined' ? false : !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY
);

export default function Page() {
  // 保留现有状态管理，但将其重新组织到WizardData结构中
  const [wizardData, setWizardData] = useState<WizardData>({
    companyName: "",
    style: "",
    primaryColor: "",
    customPrimaryColor: "",
    backgroundColor: "",
    customBackgroundColor: "",
    additionalInfo: "",
    size: imageSizes[0],
    isLoading: false,
    generatedImages: [],
  });
  
  const [imageError, setImageError] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<Array<{
    imageUrl: string;
    companyName: string;
    style: string;
    date: Date;
  }>>([]);

  // 修复React Hook条件调用的问题
  const clerkUser = useUser();
  const { isSignedIn = true, isLoaded = true, user = null } = hasClerkConfig 
    ? clerkUser 
    : { isSignedIn: true, isLoaded: true, user: null };

  // 在页面加载时从localStorage加载历史记录
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("logoHistory");
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          // 确保日期对象被正确还原
          const historyWithDates = parsedHistory.map((item: {
            imageUrl: string;
            companyName: string;
            style: string;
            date: string;
          }) => ({
            ...item,
            date: new Date(item.date)
          }));
          setGenerationHistory(historyWithDates);
        } catch (e) {
          console.error("Failed to parse history:", e);
        }
      }
    }
  }, []);

  // 保存历史记录到localStorage
  const saveToHistory = (imageUrl: string) => {
    if (!imageUrl || !wizardData.companyName) return;
    
    const newHistoryItem = {
      imageUrl,
      companyName: wizardData.companyName,
      style: wizardData.style,
      date: new Date()
    };
    
    const updatedHistory = [newHistoryItem, ...generationHistory].slice(0, 10); // 只保留最近10条
    setGenerationHistory(updatedHistory);
    
    // 保存到localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("logoHistory", JSON.stringify(updatedHistory));
    }
  };

  // 获取实际使用的颜色值
  const getActualPrimaryColor = () => {
    const selectedColor = primaryColors.find(c => c.name === wizardData.primaryColor);
    return selectedColor?.color === "custom" ? wizardData.customPrimaryColor : selectedColor?.color || "#0F6FFF";
  };
  
  const getActualBackgroundColor = () => {
    const selectedColor = backgroundColors.find(c => c.name === wizardData.backgroundColor);
    return selectedColor?.color === "custom" ? wizardData.customBackgroundColor : selectedColor?.color || "#FFFFFF";
  };

  // 加载保存的偏好设置
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 加载其他偏好设置
      const savedPreferences = localStorage.getItem("logoPreferences");
      if (savedPreferences) {
        try {
          const preferences = JSON.parse(savedPreferences);
          
          setWizardData(prevData => ({
            ...prevData,
            style: preferences.style || prevData.style,
            primaryColor: preferences.primaryColor || prevData.primaryColor,
            backgroundColor: preferences.backgroundColor || prevData.backgroundColor,
            customPrimaryColor: preferences.customPrimaryColor || prevData.customPrimaryColor,
            customBackgroundColor: preferences.customBackgroundColor || prevData.customBackgroundColor,
            size: preferences.size ? 
              imageSizes.find(s => s.name === preferences.size) || prevData.size : 
              prevData.size
          }));
        } catch (e) {
          console.error("Failed to parse preferences:", e);
        }
      }
    }
  }, []);

  // 保存偏好设置
  const savePreferences = useCallback(() => {
    if (typeof window !== "undefined") {
      const preferences = {
        style: wizardData.style,
        primaryColor: wizardData.primaryColor,
        backgroundColor: wizardData.backgroundColor,
        customPrimaryColor: wizardData.customPrimaryColor,
        customBackgroundColor: wizardData.customBackgroundColor,
        size: wizardData.size.name,
      };
      localStorage.setItem("logoPreferences", JSON.stringify(preferences));
    }
  }, [wizardData]);

  // 当组件挂载时保存
  useEffect(() => {
    savePreferences();
  }, [savePreferences]);

  // 更新向导数据的处理函数
  const handleUpdateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({
      ...prev,
      ...updates
    }));
  };

  // 生成Logo的异步函数
  const generateLogo = async () => {
    if (!isSignedIn) {
      return;
    }

    setWizardData(prev => ({ ...prev, isLoading: true }));
    setImageError(false);

    try {
      console.log("Sending logo generation request...");

    const res = await fetch("/api/generate-logo", {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
          companyName: wizardData.companyName,
          selectedStyle: wizardData.style,
          selectedPrimaryColor: getActualPrimaryColor(),
          selectedBackgroundColor: getActualBackgroundColor(),
          additionalInfo: wizardData.additionalInfo,
          width: wizardData.size.width,
          height: wizardData.size.height,
      }),
    });

      console.log("Response status:", res.status);
      
      // Error handling
      if (!res.ok) {
        let errorMessage = "An unknown error occurred";
        
        // Try to get error message
        if (res.headers.get("Content-Type")?.includes("text/plain")) {
          errorMessage = await res.text();
        } else if (res.headers.get("Content-Type")?.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
        
        console.error("Logo generation failed:", errorMessage);
        toast({
          variant: "destructive",
          title: `Error (${res.status})`,
          description: errorMessage,
        });
        return;
      }

      // Success handling
      try {
      const json = await res.json();
        console.log("Successfully received logo data:", json);
        
        // Process image URLs in response
        if (json.image_urls && json.image_urls.length > 0) {
          setTimeout(() => {
            // 使用所有生成的图片URL
            setWizardData(prev => ({ 
              ...prev, 
              generatedImages: json.display_urls || json.image_urls 
            }));
            
            // 保存到历史记录
            json.display_urls.forEach((url: string) => saveToHistory(url));
          }, 0);
          
          // If images are temporary, show warning
          if (json.is_temporary) {
            toast({
              title: "Note",
              description: "Image links are temporary and may expire after one hour.",
              variant: "default",
            });
          }
          
          // If there was an error during upload, show notification
          if (json.error) {
            toast({
              title: "Warning",
              description: "Logos were generated but there was an issue with permanent storage: " + json.error,
              variant: "destructive",
            });
          }
        } else {
          throw new Error("Missing image data in response");
        }
        
        if (user) {
          try {
            console.log("Refreshing user data to get latest Credits info");
      await user.reload();
            console.log("User data refreshed, Credits:", user.unsafeMetadata.remaining);
          } catch (reloadError) {
            console.error("Failed to refresh user data:", reloadError);
          }
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to process the generated logo.",
        });
      }
    } catch (error) {
      console.error("Error generating logo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate logo. Please try again.",
      });
    } finally {
      setWizardData(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Logo下载函数
  const handleDownloadLogo = (format: 'png' | 'svg' | 'jpg') => {
    if (!wizardData.generatedImages.length || imageError) return;
    
    switch (format) {
      case 'png':
        downloadPng();
        break;
      case 'svg':
        downloadSvg();
        break;
      case 'jpg':
        downloadJpg();
        break;
    }
  };

  // 下载PNG图像函数
  const downloadPng = () => {
    if (!wizardData.generatedImages.length || imageError) return;
    
    const fileName = `${wizardData.companyName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
    
    // 使用fetch和blob下载
    fetch(wizardData.generatedImages[0])
      .then(response => response.blob())
      .then(blob => {
        // 创建用于下载的blob URL
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        
        // 清理
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }, 100);
        
        toast({
          title: "Download Complete",
          description: `${wizardData.companyName} logo has been downloaded (PNG format)`,
          variant: "default",
        });
      })
      .catch(error => {
        console.error("Download failed:", error);
        // 显示错误提示
        toast({
          title: "Download Failed",
          description: "Could not download image. Try right-clicking and selecting 'Save As...'",
          variant: "destructive",
        });
      });
  };

  // 下载SVG图像函数
  const downloadSvg = async () => {
    if (!wizardData.generatedImages.length || imageError) return;
    
    setWizardData(prev => ({ ...prev, isLoading: true }));
    toast({
      title: "Processing",
      description: "Preparing SVG file...",
      variant: "default",
    });
    
    try {
      const svgUrl = await convertToSvg(wizardData.generatedImages[0]);
      const fileName = `${wizardData.companyName.replace(/\s+/g, '-').toLowerCase()}-logo.svg`;
      
      // 创建下载链接并触发下载
      const link = document.createElement('a');
      link.href = svgUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(svgUrl);
      }, 100);
      
      toast({
        title: "Download Complete",
        description: `${wizardData.companyName} logo has been downloaded (SVG format)`,
        variant: "default",
      });
    } catch (error) {
      console.error("SVG download failed:", error);
      toast({
        title: "Download Failed",
        description: "Could not convert to SVG format. Please try another format.",
        variant: "destructive",
      });
    } finally {
      setWizardData(prev => ({ ...prev, isLoading: false }));
    }
  };

  // 下载JPG图像函数
  const downloadJpg = async () => {
    if (!wizardData.generatedImages.length || imageError) return;
    
    setWizardData(prev => ({ ...prev, isLoading: true }));
    toast({
      title: "Processing",
      description: "Preparing JPG file...",
      variant: "default",
    });
    
    try {
      const jpgUrl = await convertToJpg(wizardData.generatedImages[0]);
      const fileName = `${wizardData.companyName.replace(/\s+/g, '-').toLowerCase()}-logo.jpg`;
      
      // 提取dataURL中的数据并创建Blob
      const base64Data = jpgUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      
      const byteArray = new Uint8Array(byteArrays);
      const blob = new Blob([byteArray], {type: 'image/jpeg'});
      
      // 创建下载链接
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
      
      toast({
        title: "Download Complete",
        description: `${wizardData.companyName} logo has been downloaded (JPG format)`,
        variant: "default",
      });
    } catch (error) {
      console.error("JPG download failed:", error);
      toast({
        title: "Download Failed",
        description: "Could not convert to JPG format. Please try another format.",
        variant: "destructive",
      });
    } finally {
      setWizardData(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header className="w-full" />

      <div className="flex flex-grow flex-col overflow-hidden">
        {isLoaded && !isSignedIn && hasClerkConfig ? (
          <div className="flex flex-grow items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6 text-center">
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Create Your Logo</h1>
                <p className="text-gray-600">Sign in to get started creating beautiful logos</p>
              </div>
              
                  <SignInButton
                    mode="modal"
                    signUpForceRedirectUrl={domain}
                    forceRedirectUrl={domain}
                  >
                    <Button
                      size="lg"
                  className="w-full bg-blue-600 py-6 text-base font-semibold text-white hover:bg-blue-700"
                    >
                  Sign In to Continue
                    </Button>
                  </SignInButton>
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Our AI-powered logo creator helps you generate professional logos in minutes</p>
              </div>
        </div>
                  </div>
        ) : (
          <div className="flex flex-grow overflow-hidden">
            <div className="w-full overflow-hidden">
              <LogoWizard
                initialData={wizardData}
                onUpdateData={handleUpdateWizardData}
                onGenerateLogo={generateLogo}
                onDownloadLogo={handleDownloadLogo}
                sizes={imageSizes}
              />
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
