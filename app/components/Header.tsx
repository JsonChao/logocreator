import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { domain } from "@/app/lib/domain";
import { RefreshCwIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function Header({ className }: { className: string }) {
  const { user, isLoaded } = useUser();
  const [creditsLoading, setCreditsLoading] = useState(false);
  
  // 刷新用户数据以获取最新Credits - 使用useCallback优化
  const refreshUserData = useCallback(async () => {
    if (!user) return;
    setCreditsLoading(true);
    try {
      await user.reload();
      console.log("用户数据已刷新，Credits:", user.unsafeMetadata.remaining);
    } catch (error) {
      console.error("刷新用户数据失败:", error);
    } finally {
      setCreditsLoading(false);
    }
  }, [user]);
  
  // 组件加载时刷新一次用户数据
  useEffect(() => {
    if (isLoaded && user) {
      refreshUserData();
    }
  }, [isLoaded, user, refreshUserData]);

  return (
    <header className={`relative w-full ${className}`}>
      <div className="flex items-center justify-between bg-[#343434] px-4 py-2 md:mt-4">
        {/* Logo - left on mobile, centered on larger screens */}
        <div className="flex flex-grow justify-start xl:justify-center">
          <Link href="https://togetherai.link/" className="flex items-center">
            <Image
              src="together-ai-logo1.svg"
              alt="together.ai"
              width={400}
              height={120}
              className="w-[220px] md:w-[330px] lg:w-[390px]"
              priority
            />
          </Link>
        </div>
        {/* Credits Section */}
        <div className="absolute right-8 flex items-center space-x-2 md:top-20 lg:top-8">
          <SignedOut>
            <SignInButton
              mode="modal"
              signUpForceRedirectUrl={domain}
              forceRedirectUrl={domain}
            />
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1 text-sm text-white">
              {user?.unsafeMetadata.remaining === "BYOK" ? (
                <span>使用自定义API密钥</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">剩余次数:</span>
                  <span className="mr-1 font-bold">{`${user?.unsafeMetadata.remaining ?? 3}`}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 rounded-full p-0" 
                          onClick={refreshUserData}
                          disabled={creditsLoading}
                        >
                          <RefreshCwIcon className={`h-3 w-3 text-gray-300 ${creditsLoading ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>刷新剩余次数</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
