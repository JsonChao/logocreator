import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <header className={`relative z-20 w-full bg-white ${className}`}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100 focus:outline-none"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </button>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center select-none">
            <Image
              src="/logoai.svg"
              alt="logoai"
              width={110}
              height={40}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        {/* Empty div to balance the layout */}
        <div className="h-8 w-8"></div>
      </div>
      
      {/* Rainbow gradient border - 更细的彩虹边框 */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-300" />
    </header>
  );
}
