import type { Metadata } from "next";
import { Jura } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/app/components/ui/toaster";
import PlausibleProvider from "next-plausible";

const jura = Jura({
  subsets: ["latin"],
  variable: "--font-jura",
});

const title = "LogoCraftAI - Create Beautiful Logos with AI";
const description = "Generate professional, unique logos for your brand in seconds with AI. No design skills required.";
const url = "https://www.logocraftai.com/";
const ogimage = "https://www.logocraftai.com/images/logocraftai-og-image.png";
const sitename = "LogoCraftAI";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: [
    { rel: "icon", url: "/images/logocraftai.webp", type: "image/webp" },
    { rel: "icon", url: "/favicon.ico" }
  ],
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

// 检查是否配置了Clerk环境变量
const hasClerkConfig = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 根据Clerk配置情况选择不同的布局包装
  const AppContent = () => (
    <html lang="en" className="h-full">
      <head>
        <PlausibleProvider domain="logocraftai.com" />
        <link rel="icon" href="/images/logocraftai.webp" type="image/webp" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body
        className={`${jura.variable} min-h-full bg-white font-jura antialiased overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );

  // 如果Clerk未配置，跳过ClerkProvider
  if (!hasClerkConfig) {
    return <AppContent />;
  }

  // 正常的带有Clerk认证的布局
  return (
    <ClerkProvider>
      <AppContent />
    </ClerkProvider>
  );
}
