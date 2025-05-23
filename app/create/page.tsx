"use client";

import { Button } from "../components/ui/button";
import { toast } from "@/hooks/use-toast";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { domain } from "../lib/domain";
import { convertToJpg, convertToSvg } from "../lib/imageConverter";
import LogoWizard, { WizardData } from "../components/LogoWizard";

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

// 检查Clerk配置
const hasClerkConfig = typeof window !== 'undefined' ? false : !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY
);

export default function CreatePage() {
  // 状态管理
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
    errorMessage: "",
    logoCount: 6, // Default to 6 logos
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

  // Get actual color values
  const getActualPrimaryColor = () => {
    const selectedColor = primaryColors.find(c => c.name === wizardData.primaryColor);
    return selectedColor?.color === "custom" ? wizardData.customPrimaryColor : selectedColor?.color || "#0F6FFF";
  };
  
  const getActualBackgroundColor = () => {
    const selectedColor = backgroundColors.find(c => c.name === wizardData.backgroundColor);
    return selectedColor?.color === "custom" ? wizardData.customBackgroundColor : selectedColor?.color || "#FFFFFF";
  };

  // Load saved preferences
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load other preferences
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

  // Save preferences
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

  // Save when component mounts
  useEffect(() => {
    savePreferences();
  }, [savePreferences]);

  // Function to update wizard data
  const handleUpdateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Generate logo async function
  const generateLogo = async (appendToExisting: boolean = false) => {
    if (!isSignedIn) {
      toast({
        title: "Login Required",
        description: "Please sign in to generate logos",
        variant: "default",
      });
      return;
    }

    // 清除之前的错误，如果是追加模式则保留现有图片
    setWizardData(prev => ({ 
      ...prev, 
      isLoading: true,
      errorMessage: "",
      // 如果是追加模式，保留现有图片数组，否则清空
      generatedImages: appendToExisting ? prev.generatedImages : []
    }));
    
    if (!appendToExisting) {
      setImageError(false);
    }

    try {
      console.log("Sending logo generation request...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5分钟超时，适应生成多张图片的时间
      
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
          logoCount: wizardData.logoCount, // Add logoCount parameter to API request
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log("Response status:", res.status);
      
      // Error handling
      if (!res.ok) {
        let errorMessage = "生成Logo时发生未知错误";
        
        // Try to get error message
        if (res.headers.get("Content-Type")?.includes("text/plain")) {
          errorMessage = await res.text();
        } else if (res.headers.get("Content-Type")?.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
        
        console.error("Logo generation failed:", errorMessage);
        
        // 如果是队列满错误，设置特殊错误消息
        const isQueueFullError = res.status === 503 || 
          errorMessage.includes("Queue is full") || 
          errorMessage.includes("繁忙") || 
          errorMessage.includes("wait and retry");
        
        if (isQueueFullError) {
          errorMessage = "Replicate服务暂时繁忙，请等待几分钟后再试。";
        }
        
        // 设置错误信息到状态
        setWizardData(prev => ({ 
          ...prev, 
          isLoading: false, 
          errorMessage: errorMessage 
        }));
        
        // 显示toast提示
        toast({
          variant: "destructive",
          title: `生成失败 (${res.status})`,
          description: errorMessage,
        });
        return;
      }

      // Success handling
      try {
        const data = await res.json();
        console.log("Generation successful, received data:", data);
        
        if (data.display_urls && data.display_urls.length > 0) {
          setWizardData(prev => {
            // 如果是追加模式，将新图片添加到现有数组
            const updatedImages = appendToExisting
              ? [...prev.generatedImages, ...data.display_urls]
              : data.display_urls;
            
            return {
              ...prev,
              isLoading: false,
              generatedImages: updatedImages,
              errorMessage: ""
            };
          });
          
          // 只在非追加模式下保存到历史记录
          if (!appendToExisting) {
            saveToHistory(data.display_urls[0]);
          }
          
          // 生成成功后，立即刷新用户额度信息
          try {
            // 触发一个自定义事件，通知UserCreditsDisplay组件刷新
            const refreshEvent = new CustomEvent('refreshUserCredits', { detail: { forceRefresh: true } });
            window.dispatchEvent(refreshEvent);
            console.log("已触发用户额度刷新事件");
          } catch (error) {
            console.error("触发用户额度刷新事件失败:", error);
          }
          
          // 根据模式显示不同的成功提示
          toast({
            title: "Logo生成成功",
            description: appendToExisting 
              ? "已为您加载更多Logo设计方案" 
              : "已生成Logo方案供您选择，处理时间较长请耐心等待",
          });
        } else {
          throw new Error("No images were generated");
        }
      } catch (jsonError) {
        console.error("Failed to parse generation response:", jsonError);
        setWizardData(prev => ({ 
          ...prev, 
          isLoading: false,
          errorMessage: "无法解析生成结果，请重试"
        }));
        setImageError(true);
        
        toast({
          variant: "destructive",
          title: "生成失败",
          description: "无法解析生成结果，请重试",
        });
      }
    } catch (error) {
      console.error("Logo generation error:", error);
      
      let errorMessage = "生成Logo时发生错误，请稍后重试";
      
      // 处理中断错误
      if (error instanceof DOMException && error.name === "AbortError") {
        errorMessage = "请求超时。请稍后重试。";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setWizardData(prev => ({ 
        ...prev, 
        isLoading: false, 
        errorMessage: errorMessage 
      }));
      setImageError(true);
      
      toast({
        variant: "destructive",
        title: "生成失败",
        description: errorMessage,
      });
    }
  };

  // 加载更多Logo的函数
  const loadMoreLogos = async () => {
    console.log(`正在加载更多Logo，数量: ${wizardData.logoCount}`);
    
    // 添加调试输出
    console.log("当前状态:", JSON.stringify({
      companyName: wizardData.companyName,
      style: wizardData.style,
      logoCount: wizardData.logoCount
    }));
    
    await generateLogo(true);
  };

  // Logo download function
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

  // Download PNG image function
  const downloadPng = () => {
    if (!wizardData.generatedImages.length || imageError) return;
    
    const fileName = `${wizardData.companyName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
    
    // Use fetch and blob for download
    fetch(wizardData.generatedImages[0])
      .then(response => response.blob())
      .then(blob => {
        // Create blob URL for download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
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
        // Show error toast
        toast({
          title: "Download Failed",
          description: "Could not download image. Try right-clicking and selecting 'Save As...'",
          variant: "destructive",
        });
      });
  };

  // Download SVG image function
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
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = svgUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
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

  // Download JPG image function
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
      
      // Extract data from dataURL and create Blob
      const base64Data = jpgUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      
      const byteArray = new Uint8Array(byteArrays);
      const blob = new Blob([byteArray], {type: 'image/jpeg'});
      
      // Create download link
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
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
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-grow">
        <LogoWizard
          data={wizardData}
          onUpdateData={handleUpdateWizardData}
          generateLogo={() => generateLogo(false)}
          downloadPng={downloadPng}
          downloadSvg={downloadSvg}
          downloadJpg={downloadJpg}
          imageError={imageError}
          sizes={imageSizes}
          onLoadMore={loadMoreLogos}
        />
      </main>
      
      <Footer />
    </div>
  );
} 