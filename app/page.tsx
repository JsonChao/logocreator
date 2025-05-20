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
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { domain } from "@/app/lib/domain";
import InfoTooltip from "./components/InfoToolTip";

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
];

const primaryColors = [
  { name: "Blue", color: "#0F6FFF" },
  { name: "Red", color: "#FF0000" },
  { name: "Green", color: "#00FF00" },
  { name: "Yellow", color: "#FFFF00" },
];

const backgroundColors = [
  { name: "White", color: "#FFFFFF" },
  { name: "Gray", color: "#CCCCCC" },
  { name: "Black", color: "#000000" },
];

const hasClerkConfig = typeof window !== 'undefined' ? false : !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY
);

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
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

  // 修复React Hook条件调用的问题
  const clerkUser = useUser();
  const { isSignedIn = true, isLoaded = true, user = null } = hasClerkConfig 
    ? clerkUser 
    : { isSignedIn: true, isLoaded: true, user: null };

  const handleAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUserAPIKey(newValue);
    localStorage.setItem("userAPIKey", newValue);
  };

  async function generateLogo() {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    setGeneratedImage("");

    try {
      console.log("Sending logo generation request...");
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAPIKey,
          companyName,
          selectedStyle,
          selectedPrimaryColor,
          selectedBackgroundColor,
          additionalInfo,
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
            setGeneratedImage(json.display_url || json.image_url);
          }, 0);
          
          // 如果图像是临时的，显示警告
          if (json.is_temporary) {
            toast({
              title: "提示",
              description: "图像链接是临时的，可能会在一小时后过期。",
              variant: "default",
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
          await user.reload();
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
                                  <span
                                    style={{ backgroundColor: color.color }}
                                    className="mr-2 size-4 rounded-sm bg-white"
                                  />
                                  {color.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                                  <span
                                    style={{ backgroundColor: color.color }}
                                    className="mr-2 size-4 rounded-sm bg-white"
                                  />
                                  {color.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
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
                  <Image
                    className={`${isLoading ? "animate-pulse" : ""}`}
                    width={512}
                    height={512}
                    src={generatedImage}
                    alt="Generated logo"
                    priority
                    unoptimized
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 transition ${isLoading ? "bg-black/50 duration-500" : "bg-black/0 duration-0"}`}
                  />

                  <div className="absolute -right-12 top-0 flex flex-col gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      onClick={() => {
                        if (!generatedImage) return;
                        
                        // 创建一个临时链接元素来下载图像
                        const downloadLink = document.createElement('a');
                        
                        // 设置下载链接和文件名
                        downloadLink.href = generatedImage;
                        downloadLink.download = `${companyName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
                        
                        // 将链接添加到DOM中，触发点击，然后移除
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                      }}
                    >
                      <DownloadIcon />
                    </Button>
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
                  </div>
                </div>
              ) : (
                <div key="placeholder" className="h-full w-full">
                  <Spinner loading={isLoading} className="size-8 text-white">
                    <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-[#2C2C2C]">
                      <h4 className="text-center text-base leading-tight text-white">
                        Generate your dream
                        <br />
                        logo in 10 seconds!
                      </h4>
                    </div>
                  </Spinner>
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
