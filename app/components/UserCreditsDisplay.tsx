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
        console.log("获取到用户额度数据:", data);
        setRemainingCredits(data.remainingCredits);
        setLastRefreshed(Date.now());
      } else {
        console.error(`API请求失败: ${response.status}`);
        throw new Error(`API请求失败: ${response.status}`);
      }
    } catch (error) {
      console.error("获取用户额度失败:", error);
      
      // 如果API请求失败，尝试从元数据中获取
      if (user.unsafeMetadata) {
        const metadata = user.unsafeMetadata as { remaining?: number };
        if (metadata && typeof metadata.remaining === 'number') {
          console.log("从用户元数据获取额度:", metadata.remaining);
          setRemainingCredits(metadata.remaining);
        } else {
          // 如果元数据也没有，设置默认额度
          console.log("未找到用户额度信息，使用默认值3");
          setRemainingCredits(3);
        }
      } else {
        console.log("用户元数据不存在，使用默认值3");
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
      console.log("用户已登录，获取额度信息");
      fetchUserCredits(true); // 首次加载强制刷新
    }
  }, [isLoaded, isSignedIn, user?.id, fetchUserCredits]);

  // 添加事件监听器，响应刷新用户额度的请求
  useEffect(() => {
    // 定义事件处理函数
    const handleRefreshEvent = (event: CustomEvent) => {
      console.log("收到刷新用户额度事件");
      const forceRefresh = event.detail?.forceRefresh === true;
      fetchUserCredits(forceRefresh);
    };

    // 添加事件监听器
    window.addEventListener('refreshUserCredits', handleRefreshEvent as EventListener);

    // 清理函数
    return () => {
      window.removeEventListener('refreshUserCredits', handleRefreshEvent as EventListener);
    };
  }, [fetchUserCredits]);

  // 每30秒刷新一次额度信息
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    
    const intervalId = setInterval(() => {
      // 仅在最后刷新时间超过30秒时刷新
      if (Date.now() - lastRefreshed > 30000) {
        console.log("自动刷新用户额度信息");
        fetchUserCredits();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [isLoaded, isSignedIn, lastRefreshed, fetchUserCredits]);

  // 点击刷新按钮时强制刷新
  const handleRefreshClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (refreshing || loading) return;
    
    console.log("手动刷新用户额度信息");
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