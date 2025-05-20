export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white px-6 py-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between space-y-4 text-sm md:flex-row md:items-center md:space-y-0">
          <div>
            <p className="text-gray-600">© {new Date().getFullYear()} LogocraftAI. All rights reserved.</p>
          </div>
          <div className="flex space-x-4 text-gray-500">
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
