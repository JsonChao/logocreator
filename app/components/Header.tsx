import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Menu, X, History } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import UserCreditsDisplay from "./UserCreditsDisplay";
import { cn } from "@/lib/utils";

export default function Header({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();
  
  // Only show back button on the create path
  const showBackButton = pathname === "/create";

  const links = [
    {
      href: "/pricing",
      label: "Pricing",
    },
    {
      href: "/about",
      label: "About Us",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-white/95 py-3"
      } ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                LogoCreator
              </span>
              <div className="ml-1 py-1 px-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold rounded">
                AI
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {isSignedIn && (
              <Link 
                href="/history" 
                className="font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50 flex items-center gap-1"
              >
                <History className="h-4 w-4" />
                My Logos
              </Link>
            )}

            <div className="pl-4 flex items-center space-x-3">
              {isSignedIn ? (
                <>
                  <UserCreditsDisplay />
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9 border-2 border-blue-100 hover:border-blue-200 transition-all rounded-full shadow-sm"
                      }
                    }}
                  />
                </>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isSignedIn && <UserCreditsDisplay className="mr-2" />}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-2 text-base font-medium",
                      pathname === link.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {isSignedIn && (
                  <Link 
                    href="/history" 
                    className="block font-medium text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 flex items-center gap-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <History className="h-4 w-4" />
                    My Logos
                  </Link>
                )}
              </div>
            </div>
            
            {isSignedIn ? (
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-500">
                  Signed In
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="px-4 py-4 border-t border-gray-200">
                <SignInButton mode="modal">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
