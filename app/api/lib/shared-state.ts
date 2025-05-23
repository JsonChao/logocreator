// app/api/lib/shared-state.ts
// 用于在API路由之间共享状态的简单模块

// 使用普通的模块级别变量而不是全局变量
// 由于边缘函数可能在多个实例中运行，这只能在同一实例中工作
// 但对于开发目的和Vercel基本部署来说足够了
let clearLogosMarker: string | undefined = undefined;

// 重置清除标记
export function resetClearLogosMark() {
  clearLogosMarker = undefined;
}

// 设置清除标记
export function setClearLogosMark(userId: string) {
  clearLogosMarker = userId;
}

// 检查是否有清除标记
export function hasClearLogosMark(userId: string): boolean {
  return clearLogosMarker === userId;
}

// 获取当前标记的用户ID
export function getMarkedUserId(): string | undefined {
  return clearLogosMarker;
} 