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

const title = "Logo-creator.io – Generate a logo";
const description = "Generate a logo for your company";
const url = "https://www.logo-creator.io/";
const ogimage = "https://www.logo-creator.io/og-image.png";
const sitename = "logo-creator.io";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
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
        <PlausibleProvider domain="logo-creator.io" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${jura.variable} dark min-h-full bg-[#343434] font-jura antialiased`}
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
