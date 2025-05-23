// app/api/lib/globals.ts
// 定义全局变量，用于跨实例通信

// 声明全局变量，用于跨实例标记
declare global {
  // eslint-disable-next-line no-var
  var __FORCE_CLEAR_LOGOS_FOR_USER: string | undefined;
}

// 重置清除标记
export function resetClearLogosMark() {
  if (global.__FORCE_CLEAR_LOGOS_FOR_USER) {
    global.__FORCE_CLEAR_LOGOS_FOR_USER = undefined;
  }
}

// 设置清除标记
export function setClearLogosMark(userId: string) {
  global.__FORCE_CLEAR_LOGOS_FOR_USER = userId;
}

// 检查是否有清除标记
export function hasClearLogosMark(userId: string): boolean {
  return global.__FORCE_CLEAR_LOGOS_FOR_USER === userId;
} 