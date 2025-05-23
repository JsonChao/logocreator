"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ClearLogosPage() {
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // 检查用户是否有权限使用此页面
  const isAuthorized = isSignedIn && user?.emailAddresses.some(
    email => email.emailAddress === "chao.qu521@gmail.com"
  );
  
  const clearAllLogos = async () => {
    if (!isSignedIn || !isAuthorized) {
      toast({
        title: "未授权",
        description: "您无权执行此操作",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      setResult(null);
      
      const response = await fetch('/api/user-logos/clear-all', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data.message);
      
      toast({
        title: "操作成功",
        description: data.message,
      });
    } catch (error) {
      console.error("清除Logo失败:", error);
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-24 pt-32 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center mb-8">清除Logo记录</h1>
        
        {!isSignedIn ? (
          <p className="text-xl text-center text-gray-600 mb-8">请登录以使用此功能</p>
        ) : !isAuthorized ? (
          <p className="text-xl text-center text-gray-600 mb-8">您无权访问此页面</p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <p className="text-lg text-center text-gray-600 max-w-lg">
              此操作将删除 <strong>chao.qu521@gmail.com</strong> 账户下的所有Logo记录。此操作不可撤销。
            </p>
            
            <Button 
              onClick={clearAllLogos}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "处理中..." : "清除所有Logo"}
            </Button>
            
            {result && (
              <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-md">
                {result}
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 