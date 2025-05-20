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
  
  // Refresh user data to get latest credits - optimized with useCallback
  const refreshUserData = useCallback(async () => {
    if (!user) return;
    setCreditsLoading(true);
    try {
      await user.reload();
      console.log("User data refreshed, Credits:", user.unsafeMetadata.remaining);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setCreditsLoading(false);
    }
  }, [user]);
  
  // Refresh user data once when component loads
  useEffect(() => {
    if (isLoaded && user) {
      refreshUserData();
    }
  }, [isLoaded, user, refreshUserData]);

  return (
    <header className={`relative w-full ${className}`}>
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm md:mt-0">
        {/* Logo - left on mobile, centered on larger screens */}
        <div className="flex flex-grow justify-start xl:justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logocraftai.webp"
              alt="LogocraftAI"
              width={180}
              height={60}
              className="w-[140px] md:w-[180px] lg:w-[220px]"
              priority
            />
          </Link>
        </div>
        {/* Credits Section */}
        <div className="flex items-center space-x-3">
          <SignedOut>
            <SignInButton
              mode="modal"
              signUpForceRedirectUrl={domain}
              forceRedirectUrl={domain}
            >
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-800">
              {user?.unsafeMetadata.remaining === "BYOK" ? (
                <span>Custom API Key</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Credits:</span>
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
                          <RefreshCwIcon className={`h-3 w-3 text-gray-500 ${creditsLoading ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh credits</p>
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
