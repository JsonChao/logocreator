import TwitterSVG from "../../public/twitter.svg";
import GithubSVG from "../../public/Github.svg";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto px-4 py-3 text-center text-xs text-gray-400">
      <p>© {new Date().getFullYear()} LogocraftAI. 保留所有权利。</p>
    </footer>
  );
}
