import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  return (
    <header className={`relative z-20 w-full bg-white ${className}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100 focus:outline-none"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center select-none">
            <Image
              src="/logoai.svg"
              alt="logoai"
              width={100}
              height={40}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        {/* Favorite button */}
        <button
          onClick={() => setLiked((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100 focus:outline-none"
          aria-label="Favorite"
        >
          {liked ? (
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          ) : (
            <Heart className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      
      {/* Rainbow gradient border */}
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-300" />
    </header>
  );
}
