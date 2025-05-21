import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import UserCreditsDisplay from "./UserCreditsDisplay";

export default function Header({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  
  // Only show back button on the create path
  const showBackButton = pathname === "/create";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-sm bg-white/80 ${className}`}>
      {/* Rainbow gradient decoration at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 animate-gradient-x" style={{ animationDuration: "8s" }} />
      
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Left section - Back button or Logo */}
        <div className="flex items-center">
          {showBackButton ? (
            <motion.button
              onClick={() => router.push("/")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md transition hover:shadow-lg focus:outline-none transform hover:scale-105"
              aria-label="Back to home"
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-1">
                <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 transition-colors duration-500 animate-gradient-x">
                  LogoCraftAI
                </span>
                <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
              </Link>
            </motion.div>
          )}
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-1"
          >
            <Link 
              href="/features" 
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Features
            </Link>
            <Link 
              href="/examples" 
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Examples
            </Link>
            <Link 
              href="/pricing" 
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Pricing
            </Link>
            <Link 
              href="/blog" 
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Blog
            </Link>
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
          </motion.div>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-100"
        >
          <div className="px-4 py-4 space-y-1">
            <Link 
              href="/features" 
              className="block font-medium text-gray-700 hover:text-blue-600 px-3 py-3 rounded-md hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/examples" 
              className="block font-medium text-gray-700 hover:text-blue-600 px-3 py-3 rounded-md hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Examples
            </Link>
            <Link 
              href="/pricing" 
              className="block font-medium text-gray-700 hover:text-blue-600 px-3 py-3 rounded-md hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/blog" 
              className="block font-medium text-gray-700 hover:text-blue-600 px-3 py-3 rounded-md hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            
            {isSignedIn ? (
              <div className="flex flex-col items-center pt-4 pb-2 space-y-3">
                <UserCreditsDisplay className="w-full justify-center" />
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10 border-2 border-blue-100 hover:border-blue-200 transition-all rounded-full shadow-sm"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="pt-2">
                <SignInButton mode="modal">
                  <Button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Bottom dynamic gradient decoration */}
      <div className="relative h-[1px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x" style={{ animationDuration: "15s" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500 animate-gradient-x" style={{ animationDuration: "10s", opacity: 0.7 }}></div>
      </div>
    </header>
  );
}
