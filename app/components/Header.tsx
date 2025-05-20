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
import { RefreshCwIcon, ArrowLeft, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useRouter } from "next/navigation";

export default function Header({ className = "" }: { className?: string }) {
  const { user, isLoaded } = useUser();
  const [creditsLoading, setCreditsLoading] = useState(false);
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  
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
    <header className={`relative z-20 w-full bg-white shadow-none ${className}`} style={{ minHeight: 72 }}>
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:px-0">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full transition hover:bg-gray-100 focus:outline-none"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-500" />
        </button>

        {/* 居中Logo */}
        <Link href="/" className="flex items-center select-none">
          <Image
            src="/logoai.svg"
            alt="logoai"
            width={40}
            height={40}
            className="mr-2"
            priority
          />
          <span className="text-2xl font-bold tracking-tight text-gray-800">logoai</span>
        </Link>

        {/* 收藏按钮 */}
        <button
          onClick={() => setLiked((v) => !v)}
          className="flex size-10 items-center justify-center rounded-full transition hover:bg-gray-100 focus:outline-none"
          aria-label="Favorite"
        >
          {liked ? (
            <Heart className="h-6 w-6 fill-red-500 text-red-500" />
          ) : (
            <Heart className="h-6 w-6 text-gray-400" />
          )}
        </button>
      </div>
      {/* 底部渐变或细线 */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-100 opacity-70" />
    </header>
  );
}
