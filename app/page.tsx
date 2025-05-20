"use client";

import Spinner from "@/app/components/Spinner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { motion } from "framer-motion";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { SignInButton, useUser } from "@clerk/nextjs";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { DownloadIcon, RefreshCwIcon, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { domain } from "@/app/lib/domain";
import InfoTooltip from "./components/InfoToolTip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// const layouts = [
//   { name: "Solo", icon: "/solo.svg" },
//   { name: "Side", icon: "/side.svg" },
//   { name: "Stack", icon: "/stack.svg" },
// ];

const logoStyles = [
  { name: "Tech", icon: "/tech.svg" },
  { name: "Flashy", icon: "/flashy.svg" },
  { name: "Modern", icon: "/modern.svg" },
  { name: "Playful", icon: "/playful.svg" },
  { name: "Abstract", icon: "/abstract.svg" },
  { name: "Minimal", icon: "/minimal.svg" },
  { name: "Vintage", icon: "/minimal.svg" },
  { name: "Corporate", icon: "/tech.svg" },
];

const primaryColors = [
  { name: "Blue", color: "#0F6FFF" },
  { name: "Red", color: "#FF0000" },
  { name: "Green", color: "#00FF00" },
  { name: "Yellow", color: "#FFFF00" },
  { name: "Purple", color: "#800080" },
  { name: "Orange", color: "#FFA500" },
  { name: "Pink", color: "#FFC0CB" },
  { name: "Teal", color: "#008080" },
  { name: "自定义", color: "custom" },
];

const backgroundColors = [
  { name: "White", color: "#FFFFFF" },
  { name: "Gray", color: "#CCCCCC" },
  { name: "Black", color: "#000000" },
  { name: "Light Blue", color: "#E6F7FF" },
  { name: "Light Gray", color: "#F0F0F0" },
  { name: "Light Yellow", color: "#FFFDE7" },
  { name: "自定义", color: "custom" },
];

const imageSizes = [
  { name: "标准 (768x768)", width: 768, height: 768 },
  { name: "小尺寸 (512x512)", width: 512, height: 512 },
  { name: "大尺寸 (1024x1024)", width: 1024, height: 1024 },
  { name: "宽幅 (1024x512)", width: 1024, height: 512 },
  { name: "高幅 (512x1024)", width: 512, height: 1024 },
];

const hasClerkConfig = typeof window !== 'undefined' ? false : !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY
);

// 添加类型定义
interface UrlOptions {
  primary: string;
  all: string[];
}

export default function Page() {
  const [userAPIKey, setUserAPIKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userAPIKey") || "";
    }
    return "";
  });
  const [companyName, setCompanyName] = useState("");
  // const [selectedLayout, setSelectedLayout] = useState(layouts[0].name);
  const [selectedStyle, setSelectedStyle] = useState(logoStyles[0].name);
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(
    primaryColors[0].name,
  );
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    backgroundColors[0].name,
  );
  const [customPrimaryColor, setCustomPrimaryColor] = useState("#000000");
  const [customBackgroundColor, setCustomBackgroundColor] = useState("#ffffff");
  const [selectedSize, setSelectedSize] = useState(imageSizes[0].name);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{
    rating: number | null;
    comment: string;
  }>({ rating: null, comment: "" });
  const [generationHistory, setGenerationHistory] = useState<Array<{
    imageUrl: string;
    companyName: string;
    style: string;
    date: Date;
  }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

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
          console.error("解析历史记录失败:", e);
        }
      }
    }
  }, []);

  // 保存历史记录到localStorage
  const saveToHistory = (imageUrl: string) => {
    if (!imageUrl || !companyName) return;
    
    const newHistoryItem = {
      imageUrl,
      companyName,
      style: selectedStyle,
      date: new Date()
    };
    
    const updatedHistory = [newHistoryItem, ...generationHistory].slice(0, 10); // 只保留最近10条
    setGenerationHistory(updatedHistory);
    
    // 保存到localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("logoHistory", JSON.stringify(updatedHistory));
    }
  };

  const handleAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUserAPIKey(newValue);
    localStorage.setItem("userAPIKey", newValue);
  };

  // 获取实际使用的颜色值
  const getActualPrimaryColor = () => {
    const selectedColor = primaryColors.find(c => c.name === selectedPrimaryColor);
    return selectedColor?.color === "custom" ? customPrimaryColor : selectedColor?.color || "#0F6FFF";
  };
  
  const getActualBackgroundColor = () => {
    const selectedColor = backgroundColors.find(c => c.name === selectedBackgroundColor);
    return selectedColor?.color === "custom" ? customBackgroundColor : selectedColor?.color || "#FFFFFF";
  };

  // 加载保存的偏好设置
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 加载API密钥已经在state初始化中处理了
      
      // 加载其他偏好设置
      const savedPreferences = localStorage.getItem("logoPreferences");
      if (savedPreferences) {
        try {
          const preferences = JSON.parse(savedPreferences);
          if (preferences.style) {
            setSelectedStyle(preferences.style);
          }
          if (preferences.primaryColor) {
            setSelectedPrimaryColor(preferences.primaryColor);
          }
          if (preferences.backgroundColor) {
            setSelectedBackgroundColor(preferences.backgroundColor);
          }
          if (preferences.customPrimaryColor) {
            setCustomPrimaryColor(preferences.customPrimaryColor);
          }
          if (preferences.customBackgroundColor) {
            setCustomBackgroundColor(preferences.customBackgroundColor);
          }
          if (preferences.size) {
            setSelectedSize(preferences.size);
          }
        } catch (e) {
          console.error("解析偏好设置失败:", e);
        }
      }
    }
  }, []);

  // 保存偏好设置
  const savePreferences = useCallback(() => {
    if (typeof window !== "undefined") {
      const preferences = {
        style: selectedStyle,
        primaryColor: selectedPrimaryColor,
        backgroundColor: selectedBackgroundColor,
        customPrimaryColor,
        customBackgroundColor,
        size: selectedSize,
      };
      localStorage.setItem("logoPreferences", JSON.stringify(preferences));
    }
  }, [selectedStyle, selectedPrimaryColor, selectedBackgroundColor, 
      customPrimaryColor, customBackgroundColor, selectedSize]);

  // 当组件挂载时保存
  useEffect(() => {
    savePreferences();
  }, [savePreferences]);

  async function generateLogo() {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    setGeneratedImage("");
    setImageError(false);

    try {
      console.log("Sending logo generation request...");
      
      // 获取选择的尺寸
      const sizeOption = imageSizes.find(size => size.name === selectedSize) || imageSizes[0];
      
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAPIKey,
          companyName,
          selectedStyle,
          selectedPrimaryColor: getActualPrimaryColor(),
          selectedBackgroundColor: getActualBackgroundColor(),
          additionalInfo,
          width: sizeOption.width,
          height: sizeOption.height,
        }),
      });

      console.log("Response status:", res.status);
      
      // 错误情况
      if (!res.ok) {
        let errorMessage = "An unknown error occurred";
        
        // 尝试获取错误消息
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

      // 成功情况
      try {
        const json = await res.json();
        console.log("Successfully received logo data:", json);
        
        // 处理响应中的图像URL
        if (json.image_url) {
          // 直接使用返回的URL
          setTimeout(() => {
            // 优先使用所提供的多种URL选项
            const imageOptions = [
              json.display_url,
              json.backup_url, 
              json.original_url,
              json.image_url
            ].filter(Boolean); // 过滤掉undefined/null值
            
            console.log("可用图像URL选项:", imageOptions);
            
            // 默认使用第一个有效选项
            const imageUrlToUse = imageOptions[0] || json.image_url;
            console.log("使用图像URL:", imageUrlToUse);
            
            // 保存所有URL选项以便日后需要切换时使用
            const urlOptions = {
              primary: imageUrlToUse,
              all: imageOptions
            };
            
            // 本地存储暂时使用选中的URL
            window.localStorage.setItem(`logo_url_options_${Date.now()}`, JSON.stringify(urlOptions));
            
            setGeneratedImage(imageUrlToUse);
            
            // 添加到历史记录
            saveToHistory(imageUrlToUse);
          }, 0);
          
          // 如果图像是临时的，显示警告
          if (json.is_temporary) {
            toast({
              title: "提示",
              description: "图像链接是临时的，可能会在一小时后过期。",
              variant: "default",
            });
          }
          
          // 如果上传过程中有错误，显示提示
          if (json.error) {
            toast({
              title: "警告",
              description: "图像已生成但永久存储遇到问题: " + json.error,
              variant: "destructive",
            });
          }
        } else if (json.b64_json) {
          // 向后兼容 - 如果还有base64数据的情况
          setTimeout(() => {
            setGeneratedImage(`data:image/png;base64,${json.b64_json}`);
          }, 0);
        } else {
          throw new Error("Missing image data in response");
        }
        
        if (user) {
          try {
            console.log("刷新用户数据以获取最新Credits信息");
            await user.reload();
            console.log("用户数据已刷新，Credits:", user.unsafeMetadata.remaining);
          } catch (reloadError) {
            console.error("刷新用户数据失败:", reloadError);
          }
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        toast({
          variant: "destructive",
          title: "错误",
          description: "无法处理生成的Logo。",
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
      setIsLoading(false);
    }
  }

  // 提交Logo反馈
  const submitFeedback = () => {
    if (feedback.rating === null) {
      toast({
        title: "请先评分",
        description: "请先为Logo质量评分后再提交",
        variant: "destructive",
      });
      return;
    }
    
    // 这里可以添加将反馈发送到服务器的逻辑
    // 目前仅在本地记录
    console.log("用户反馈:", {
      ...feedback,
      logoUrl: generatedImage,
      companyName,
      style: selectedStyle,
    });
    
    toast({
      title: "谢谢您的反馈",
      description: "您的反馈将帮助我们改进Logo生成服务",
      variant: "default",
    });
    
    setShowFeedback(false);
    setFeedback({ rating: null, comment: "" });
  };

  // 下载图像的函数
  const downloadImage = (format = 'png') => {
    if (!generatedImage || imageError) return;
    
    // 目前只支持PNG，但保留扩展空间
    const extension = format.toLowerCase();
    
    // 创建临时链接元素
    const downloadLink = document.createElement('a');
    
    // 设置下载链接和文件名
    downloadLink.href = generatedImage;
    downloadLink.download = `${companyName.replace(/\s+/g, '-').toLowerCase()}-logo.${extension}`;
    
    // 将链接添加到DOM中，触发点击，然后移除
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "下载成功",
      description: `已下载 ${companyName} 的Logo（${extension.toUpperCase()}格式）`,
      variant: "default",
    });
  };

  // 更新图像加载失败处理逻辑
  const handleImageError = () => {
    console.error("图像加载失败:", generatedImage);
    setImageError(true);
    
    // 尝试从localStorage获取该图像的备用URLs
    const storedOptions = Object.keys(localStorage)
      .filter(key => key.startsWith('logo_url_options_'))
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key) || '{}') as UrlOptions;
        } catch {
          // 忽略解析错误
          return null;
        }
      })
      .filter((options): options is UrlOptions => 
        options !== null && 
        typeof options === 'object' &&
        Array.isArray(options.all)
      )
      .find(options => 
        options.all.some(url => url === generatedImage || 
          url.replace('i.ibb.co', 'image.ibb.co') === generatedImage)
      );
    
    if (storedOptions && storedOptions.all.length > 1) {
      // 找到当前URL的索引
      const currentIndex = storedOptions.all.findIndex(url => 
        url === generatedImage || url.replace('i.ibb.co', 'image.ibb.co') === generatedImage
      );
      
      // 选择下一个URL
      if (currentIndex !== -1 && currentIndex < storedOptions.all.length - 1) {
        const nextUrl = storedOptions.all[currentIndex + 1];
        console.log("自动尝试下一个备用URL:", nextUrl);
        
        setTimeout(() => {
          setImageError(false);
          setGeneratedImage(nextUrl);
        }, 1000);
        return;
      }
    }
    
    // 如果没有找到存储的选项，回退到域名替换策略
    if (generatedImage.includes('i.ibb.co')) {
      const newUrl = generatedImage.replace('i.ibb.co', 'image.ibb.co');
      console.log("尝试使用替代URL:", newUrl);
      
      setTimeout(() => {
        setImageError(false);
        setGeneratedImage(newUrl);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-y-auto overflow-x-hidden bg-[#343434] md:flex-row">
      <Header className="block md:hidden" />

      <div className="flex w-full flex-col md:flex-row">
        <div className="relative flex h-full w-full flex-col bg-[#2C2C2C] text-[#F3F3F3] md:max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setGeneratedImage("");
              generateLogo();
            }}
            className="flex h-full w-full flex-col"
          >
            <fieldset className="flex grow flex-col" disabled={!isSignedIn}>
              <div className="flex-grow overflow-y-auto">
                <div className="px-8 pb-0 pt-4 md:px-6 md:pt-6">
                  {/* API Key Section */}
                  <div className="mb-6">
                    <label
                      htmlFor="api-key"
                      className="mb-2 block text-xs font-bold uppercase text-[#F3F3F3]"
                    >
                      REPLICATE API KEY
                      <span className="ml-2 text-xs uppercase text-[#6F6F6F]">
                        [OPTIONAL]
                      </span>
                    </label>
                    <Input
                      value={userAPIKey}
                      onChange={handleAPIKeyChange}
                      placeholder="API Key"
                      type="password"
                    />
                  </div>
                  <div className="-mx-6 mb-6 h-px w-[calc(100%+48px)] bg-[#343434]"></div>
                  <div className="mb-6">
                    <label
                      htmlFor="company-name"
                      className="mb-2 block text-xs font-bold uppercase text-[#6F6F6F]"
                    >
                      Company Name
                    </label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Sam's Burgers"
                      required
                    />
                  </div>
                  {/* Layout Section */}
                  {/* <div className="mb-6">
                    <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
                      Layout
                      <InfoTooltip content="Select a layout for your logo" />
                    </label>
                    <RadioGroup.Root
                      value={selectedLayout}
                      onValueChange={setSelectedLayout}
                      className="group/root grid grid-cols-3 gap-3"
                    >
                      {layouts.map((layout) => (
                        <RadioGroup.Item
                          value={layout.name}
                          key={layout.name}
                          className="group text-[#6F6F6F] focus-visible:outline-none data-[state=checked]:text-white"
                        >
                          <Image
                            src={layout.icon}
                            alt={layout.name}
                            width={96}
                            height={96}
                            className="w-full rounded-md border border-transparent group-focus-visible:outline group-focus-visible:outline-offset-2 group-focus-visible:outline-gray-400 group-data-[state=checked]:border-white"
                          />
                          <span className="text-xs">{layout.name}</span>
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </div> */}
                  {/* Logo Style Section */}
                  <div className="mb-6">
                    <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
                      STYLE
                      <InfoTooltip content="Choose a style for your logo" />
                    </label>
                    <RadioGroup.Root
                      value={selectedStyle}
                      onValueChange={setSelectedStyle}
                      className="grid grid-cols-3 gap-3"
                    >
                      {logoStyles.map((logoStyle) => (
                        <RadioGroup.Item
                          value={logoStyle.name}
                          key={logoStyle.name}
                          className="group text-[#6F6F6F] focus-visible:outline-none data-[state=checked]:text-white"
                        >
                          <Image
                            src={logoStyle.icon}
                            alt={logoStyle.name}
                            width={96}
                            height={96}
                            className="w-full rounded-md border border-transparent group-focus-visible:outline group-focus-visible:outline-offset-2 group-focus-visible:outline-gray-400 group-data-[state=checked]:border-white"
                          />
                          <span className="text-xs">{logoStyle.name}</span>
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </div>
                  {/* Color Picker Section */}
                  <div className="mb-[25px] flex flex-col md:flex-row md:space-x-3">
                    <div className="mb-4 flex-1 md:mb-0">
                      <label className="mb-1 block text-xs font-bold uppercase text-[#6F6F6F]">
                        Primary
                      </label>
                      <Select
                        value={selectedPrimaryColor}
                        onValueChange={setSelectedPrimaryColor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {primaryColors.map((color) => (
                              <SelectItem key={color.color} value={color.name}>
                                <span className="flex items-center">
                                  {color.color !== "custom" && (
                                    <span
                                      style={{ backgroundColor: color.color }}
                                      className="mr-2 size-4 rounded-sm bg-white"
                                    />
                                  )}
                                  {color.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      
                      {selectedPrimaryColor === "自定义" && (
                        <div className="mt-2 flex items-center">
                          <Input
                            type="text"
                            value={customPrimaryColor}
                            onChange={(e) => setCustomPrimaryColor(e.target.value)}
                            placeholder="#RRGGBB"
                            className="mr-2"
                          />
                          <div 
                            className="size-6 rounded-sm border border-gray-500" 
                            style={{ backgroundColor: customPrimaryColor }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block items-center text-xs font-bold uppercase text-[#6F6F6F]">
                        Background
                      </label>
                      <Select
                        value={selectedBackgroundColor}
                        onValueChange={setSelectedBackgroundColor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {backgroundColors.map((color) => (
                              <SelectItem key={color.color} value={color.name}>
                                <span className="flex items-center">
                                  {color.color !== "custom" && (
                                    <span
                                      style={{ backgroundColor: color.color }}
                                      className="mr-2 size-4 rounded-sm bg-white"
                                    />
                                  )}
                                  {color.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      
                      {selectedBackgroundColor === "自定义" && (
                        <div className="mt-2 flex items-center">
                          <Input
                            type="text"
                            value={customBackgroundColor}
                            onChange={(e) => setCustomBackgroundColor(e.target.value)}
                            placeholder="#RRGGBB"
                            className="mr-2"
                          />
                          <div 
                            className="size-6 rounded-sm border border-gray-500" 
                            style={{ backgroundColor: customBackgroundColor }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 图像尺寸选择 */}
                  <div className="mb-6">
                    <label className="mb-1 block text-xs font-bold uppercase text-[#6F6F6F]">
                      图像尺寸
                      <InfoTooltip content="选择生成图像的尺寸" />
                    </label>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择尺寸" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {imageSizes.map((size) => (
                            <SelectItem key={size.name} value={size.name}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Additional Options Section */}
                  <div className="mb-1">
                    <div className="mt-1">
                      <div className="mb-1">
                        <label
                          htmlFor="additional-info"
                          className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]"
                        >
                          Additional Info
                          <InfoTooltip content="Provide any additional information about your logo" />
                        </label>
                        <Textarea
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          placeholder="Enter additional information"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-8 py-4 md:px-6 md:py-6">
                <Button
                  size="lg"
                  className="w-full text-base font-bold"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loader mr-2" />
                  ) : (
                    <Image
                      src="/generate-icon.svg"
                      alt="Generate Icon"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                  )}
                  {isLoading ? "Loading..." : "Generate Logo"}{" "}
                </Button>
              </div>
            </fieldset>
          </form>

          {isLoaded && !isSignedIn && hasClerkConfig ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 px-6"
            >
              <div className="rounded bg-gray-200 p-4 text-gray-900">
                <p className="text-lg">
                  Create a free account to start making logos:
                </p>

                <div className="mt-4">
                  <SignInButton
                    mode="modal"
                    signUpForceRedirectUrl={domain}
                    forceRedirectUrl={domain}
                  >
                    <Button
                      size="lg"
                      className="w-full text-base font-semibold"
                      variant="secondary"
                    >
                      Sign in
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>

        <div className="flex w-full flex-col pt-12 md:pt-0">
          <Header className="hidden md:block" />{" "}
          {/* Show header on larger screens */}
          <div className="relative flex flex-grow items-center justify-center px-4">
            <div className="relative aspect-square w-full max-w-lg">
              {generatedImage ? (
                <div key="generated-image" className="relative h-full w-full">
                  {imageError ? (
                    // 显示错误回退UI
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#2C2C2C] p-4 text-center">
                      <p className="mb-2 text-red-400">图像加载失败</p>
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={handleImageError}
                      >
                        重试加载
                      </Button>
                    </div>
                  ) : (
                    <Image
                      className={`${isLoading ? "animate-pulse" : ""}`}
                      width={512}
                      height={512}
                      src={generatedImage}
                      alt="Generated logo"
                      priority
                      unoptimized
                      loading="eager"
                      crossOrigin="anonymous"
                      onError={handleImageError}
                    />
                  )}
                  <div
                    className={`pointer-events-none absolute inset-0 transition ${isLoading ? "bg-black/50 duration-500" : "bg-black/0 duration-0"}`}
                  />

                  <div className="absolute -right-12 top-0 flex flex-col gap-2">
                    <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
                      <PopoverTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          disabled={imageError}
                        >
                          <DownloadIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="right" className="w-48 p-2">
                        <div className="flex flex-col gap-1">
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              downloadImage('png');
                              setShowExportOptions(false);
                            }}
                            className="justify-start"
                          >
                            下载为PNG
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            disabled={true}
                            className="justify-start text-gray-500"
                            title="即将推出，敬请期待"
                          >
                            下载为SVG (即将推出)
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            disabled={true}
                            className="justify-start text-gray-500"
                            title="即将推出，敬请期待"
                          >
                            下载为JPG (即将推出)
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      size="icon"
                      onClick={() => {
                        if (!isLoading) generateLogo(); 
                      }}
                      variant="secondary"
                      disabled={isLoading}
                    >
                      <Spinner loading={isLoading}>
                        <RefreshCwIcon />
                      </Spinner>
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => setShowFeedback(!showFeedback)}
                      variant="outline"
                      disabled={imageError}
                    >
                      {feedback.rating === 1 ? <ThumbsUp className="text-green-500" /> : 
                       feedback.rating === 0 ? <ThumbsDown className="text-red-500" /> :
                       <span className="text-xs font-medium">评价</span>}
                    </Button>
                  </div>
                  
                  {/* 评分反馈面板 */}
                  {showFeedback && (
                    <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-gray-800 p-4">
                      <div className="mb-2 flex justify-between">
                        <h4 className="text-sm font-medium">Logo质量评价</h4>
                        <button 
                          onClick={() => setShowFeedback(false)}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          关闭
                        </button>
                      </div>
                      
                      <div className="mb-3 flex justify-center space-x-4">
                        <Button
                          variant={feedback.rating === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFeedback({...feedback, rating: 1})}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>满意</span>
                        </Button>
                        <Button
                          variant={feedback.rating === 0 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFeedback({...feedback, rating: 0})}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>不满意</span>
                        </Button>
                      </div>
                      
                      <Textarea
                        value={feedback.comment}
                        onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                        placeholder="请输入您对Logo的具体反馈（可选）"
                        className="mb-3 h-20"
                      />
                      
                      <Button 
                        onClick={submitFeedback} 
                        size="sm" 
                        className="w-full"
                      >
                        提交反馈
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div key="placeholder" className="h-full w-full">
                  <Spinner loading={isLoading} className="size-8 text-white">
                    <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-[#2C2C2C]">
                      {!showHistory || generationHistory.length === 0 ? (
                        <h4 className="text-center text-base leading-tight text-white">
                          Generate your dream
                          <br />
                          logo in 10 seconds!
                        </h4>
                      ) : (
                        <div className="flex h-full w-full flex-col overflow-hidden">
                          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
                            <h4 className="text-sm font-medium">历史记录</h4>
                            <button 
                              onClick={() => setShowHistory(false)} 
                              className="text-xs text-gray-400 hover:text-white"
                            >
                              关闭
                            </button>
                          </div>
                          <div className="flex-grow overflow-y-auto p-2">
                            <div className="grid grid-cols-2 gap-2">
                              {generationHistory.map((item, index) => (
                                <div 
                                  key={index} 
                                  className="cursor-pointer rounded-md border border-gray-700 p-1 hover:border-gray-500"
                                  onClick={() => {
                                    setGeneratedImage(item.imageUrl);
                                    setCompanyName(item.companyName);
                                    // 可选：恢复其他设置
                                    setSelectedStyle(item.style);
                                  }}
                                >
                                  <div className="relative aspect-square w-full overflow-hidden rounded">
                                    <Image
                                      fill
                                      src={item.imageUrl}
                                      alt={`${item.companyName} logo`}
                                      className="object-cover"
                                      unoptimized
                                      onError={(e) => {
                                        // 处理加载错误
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                      }}
                                    />
                                  </div>
                                  <div className="mt-1 truncate text-xs">
                                    {item.companyName}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Spinner>
                  
                  {!isLoading && !showHistory && generationHistory.length > 0 && (
                    <button
                      onClick={() => setShowHistory(true)}
                      className="mt-2 text-xs text-gray-400 hover:text-white"
                    >
                      查看历史记录
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
