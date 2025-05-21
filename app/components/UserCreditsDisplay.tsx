import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, RefreshCw } from "lucide-react";

interface UserCreditsDisplayProps {
  className?: string;
}

export default function UserCreditsDisplay({ className }: UserCreditsDisplayProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(0);

  // 获取用户额度信息
  const fetchUserCredits = useCallback(async (forceRefresh = false) => {
    if (!isSignedIn || !user) return;
    
    try {
      setLoading(true);
      
      // 直接从API获取最新额度信息
      const queryParams = new URLSearchParams({
        userId: user.id,
        ...(forceRefresh ? { forceRefresh: 'true' } : {})
      });
      
      const response = await fetch(`/api/user-credits?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRemainingCredits(data.remainingCredits);
        setLastRefreshed(Date.now());
        
        if (forceRefresh) {
          console.log("已强制刷新用户额度信息", data);
        }
      } else {
        throw new Error(`API请求失败: ${response.status}`);
      }
    } catch (error) {
      console.error("获取用户额度失败:", error);
      
      // 如果API请求失败，尝试从元数据中获取
      const metadata = user.unsafeMetadata as { remaining?: number };
      if (metadata && typeof metadata.remaining === 'number') {
        setRemainingCredits(metadata.remaining);
      } else {
        // 如果元数据也没有，设置默认额度
        setRemainingCredits(3);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isSignedIn, user]);

  // 组件挂载和用户信息变化时获取额度
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUserCredits(true); // 首次加载强制刷新
    }
  }, [isLoaded, isSignedIn, user?.id, fetchUserCredits]);

  // 每60秒刷新一次额度信息
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    
    const intervalId = setInterval(() => {
      // 仅在最后刷新时间超过60秒时刷新
      if (Date.now() - lastRefreshed > 60000) {
        fetchUserCredits();
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [isLoaded, isSignedIn, lastRefreshed, fetchUserCredits]);

  // 点击刷新按钮时强制刷新
  const handleRefreshClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (refreshing || loading) return;
    
    setRefreshing(true);
    await fetchUserCredits(true);
  };

  if (!isLoaded || !isSignedIn || remainingCredits === null) {
    return null;
  }

  return (
    <div 
      className={cn(
        "group flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors",
        (loading || refreshing) && "opacity-70",
        className
      )}
      onClick={handleRefreshClick}
      title="点击刷新额度信息"
    >
      <Sparkles className="h-4 w-4 text-blue-500" />
      <span>剩余额度: {remainingCredits}</span>
      {refreshing ? (
        <RefreshCw className="h-3 w-3 text-blue-500 animate-spin ml-1" />
      ) : (
        <RefreshCw className={cn("h-3 w-3 ml-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity", loading && "animate-spin opacity-100")} />
      )}
    </div>
  );
} 