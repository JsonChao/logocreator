import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | LogocraftAI',
  description: 'Discover the latest trends, tips, and best practices in logo design, brand strategy, and visual marketing.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 