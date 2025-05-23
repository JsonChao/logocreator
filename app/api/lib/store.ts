// app/api/lib/store.ts
// 模拟数据库存储
// 在实际项目中，这应该使用真实的数据库，如Prisma + PostgreSQL

export interface LogoRecord {
  id: string;
  userId: string;
  createdAt: string;
  companyName: string;
  style: string;
  primaryColor: string;
  backgroundColor: string;
  imageUrl: string;
  liked: boolean;
}

// 全局内存存储，模拟数据库
export const userLogos: Record<string, Array<LogoRecord>> = {}; 