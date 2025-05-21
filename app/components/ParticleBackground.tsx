"use client";

import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  // 创建粒子
  const createParticles = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = [
      "rgba(59, 130, 246, 0.6)", // blue
      "rgba(139, 92, 246, 0.6)",  // purple
      "rgba(236, 72, 153, 0.6)",  // pink
      "rgba(248, 113, 113, 0.6)", // red
      "rgba(251, 191, 36, 0.6)",  // amber
    ];
    
    // 清空现有粒子
    particles.current = [];
    
    // 基于屏幕尺寸创建适当数量的粒子
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
    
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }, []);

  // 动画循环
  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新并绘制粒子
    particles.current.forEach((particle, index) => {
      // 移动粒子
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // 边界检查，若碰到边界则反转速度
      if (particle.x > canvas.width || particle.x < 0) {
        particle.speedX = -particle.speedX;
      }
      
      if (particle.y > canvas.height || particle.y < 0) {
        particle.speedY = -particle.speedY;
      }
      
      // 绘制粒子
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // 连接附近粒子
      particles.current.forEach((particle2, index2) => {
        if (index !== index2) {
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 200, 255, ${0.2 - distance / 600})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        }
      });
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // 处理窗口大小变化
  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    createParticles();
  }, [createParticles]);

  // 设置和清理
  useEffect(() => {
    createParticles();
    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [animate, createParticles, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
} 