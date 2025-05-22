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
  const [resetting, setResetting] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch user credits information
  const fetchUserCredits = useCallback(async (forceRefresh = false) => {
    if (!isSignedIn || !user) return;
    
    try {
      setLoading(true);
      
      // Get latest credits info directly from API
      const queryParams = new URLSearchParams({
        userId: user.id,
        ...(forceRefresh ? { forceRefresh: 'true' } : {})
      });
      
      const response = await fetch(`/api/user-credits?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Received user credits data:", data);
        setRemainingCredits(data.remainingCredits);
        setLastRefreshed(Date.now());
      } else {
        console.error(`API request failed: ${response.status}`);
        throw new Error(`API request failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch user credits:", error);
      
      // If API request fails, try to get from metadata
      if (user.unsafeMetadata) {
        const metadata = user.unsafeMetadata as { remaining?: number };
        if (metadata && typeof metadata.remaining === 'number') {
          console.log("Getting credits from user metadata:", metadata.remaining);
          setRemainingCredits(metadata.remaining);
        } else {
          // If metadata doesn't have it either, set default credits
          console.log("No user credits information found, using default value 3");
          setRemainingCredits(3);
        }
      } else {
        console.log("User metadata doesn't exist, using default value 3");
        setRemainingCredits(3);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isSignedIn, user]);

  // Fetch credits when component mounts and user info changes
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log("User is logged in, fetching credits info");
      fetchUserCredits(true); // Force refresh on first load
    }
  }, [isLoaded, isSignedIn, user?.id, fetchUserCredits]);

  // Add event listener to respond to refresh user credits requests
  useEffect(() => {
    // Define event handler
    const handleRefreshEvent = (event: CustomEvent) => {
      console.log("Received refresh user credits event");
      const forceRefresh = event.detail?.forceRefresh === true;
      fetchUserCredits(forceRefresh);
    };

    // Add event listener
    window.addEventListener('refreshUserCredits', handleRefreshEvent as EventListener);

    // Cleanup function
    return () => {
      window.removeEventListener('refreshUserCredits', handleRefreshEvent as EventListener);
    };
  }, [fetchUserCredits]);

  // Refresh credits every 30 seconds
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    
    const intervalId = setInterval(() => {
      // Only refresh if last refresh was more than 30 seconds ago
      if (Date.now() - lastRefreshed > 30000) {
        console.log("Auto-refreshing user credits info");
        fetchUserCredits();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [isLoaded, isSignedIn, lastRefreshed, fetchUserCredits]);

  // Force refresh when refresh button is clicked
  const handleRefreshClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (refreshing || loading || resetting) return;
    
    console.log("Manually refreshing user credits info");
    setRefreshing(true);
    await fetchUserCredits(true);
  };

  // Reset user credits
  const resetUserCredits = async () => {
    if (!isSignedIn || !user || refreshing || loading || resetting) return;
    
    try {
      setResetting(true);
      
      // Call API to reset user credits
      const queryParams = new URLSearchParams({
        userId: user.id,
        resetCredits: 'true'
      });
      
      console.log("Resetting user credits");
      const response = await fetch(`/api/user-credits?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Reset user credits successful:", data);
        setRemainingCredits(data.remainingCredits);
        setLastRefreshed(Date.now());
        
        // Show reset success notification
        if (typeof window !== 'undefined' && 'toast' in window) {
          // @ts-ignore
          window.toast?.({
            title: "Credits Reset",
            description: `Your logo generation credits have been reset to ${data.remainingCredits}`,
          });
        } else {
          alert(`Credits reset to ${data.remainingCredits}`);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to reset user credits:", errorData);
        throw new Error(errorData.message || "Failed to reset user credits");
      }
    } catch (error) {
      console.error("Error resetting user credits:", error);
      
      // Show error notification
      if (typeof window !== 'undefined' && 'toast' in window) {
        // @ts-ignore
        window.toast?.({
          variant: "destructive",
          title: "Reset Failed",
          description: error instanceof Error ? error.message : "Failed to reset user credits",
        });
      } else {
        alert("Failed to reset user credits");
      }
    } finally {
      setResetting(false);
    }
  };
  
  // Handle long press event
  const handleTouchStart = () => {
    if (refreshing || loading || resetting) return;
    
    const timer = setTimeout(() => {
      // Trigger reset after 3 seconds of long press
      console.log("Long press triggered reset");
      resetUserCredits();
    }, 3000);
    
    setLongPressTimer(timer);
  };
  
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  // Handle double click event
  const handleDoubleClick = () => {
    if (refreshing || loading || resetting) return;
    
    console.log("Double click triggered reset");
    resetUserCredits();
  };

  if (!isLoaded || !isSignedIn || remainingCredits === null) {
    return null;
  }

  return (
    <div 
      className={cn(
        "group flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors",
        (loading || refreshing) && "opacity-70",
        resetting && "bg-red-50 text-red-700",
        className
      )}
      onClick={handleRefreshClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      title={resetting ? "Resetting credits..." : "Click to refresh credits (double-click or long press for 3 seconds to reset)"}
    >
      <Sparkles className={cn("h-4 w-4", resetting ? "text-red-500" : "text-blue-500")} />
      <span>Credits: {remainingCredits}</span>
      {refreshing ? (
        <RefreshCw className="h-3 w-3 text-blue-500 animate-spin ml-1" />
      ) : resetting ? (
        <RefreshCw className="h-3 w-3 text-red-500 animate-spin ml-1" />
      ) : (
        <RefreshCw className={cn("h-3 w-3 ml-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity", loading && "animate-spin opacity-100")} />
      )}
    </div>
  );
} 