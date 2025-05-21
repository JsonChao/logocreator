import Image from "next/image";
import Link from "next/link";

export default function Header({ className = "" }: { className?: string }) {
  return (
    <header className={`relative z-20 w-full bg-white ${className}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 md:px-6">
        {/* Centered Logo */}
        <Link href="/" className="flex items-center select-none">
          <Image
            src="/logoai.svg"
            alt="logoai"
            width={124}
            height={48}
            className="h-auto"
            priority
          />
        </Link>
      </div>
      
      {/* Rainbow gradient border */}
      <div className="h-[4px] w-full bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-300" />
    </header>
  );
}
