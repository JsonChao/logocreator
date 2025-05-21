import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Instagram, Facebook, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">LogocraftAI</h3>
            <p className="text-gray-600 text-sm">
              Transform your brand with AI-powered logo creation. Professional, unique logos in seconds.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" aria-label="Github" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/create" className="hover:text-blue-600 transition-colors">Create Logo</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Examples</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Logo Design Guide</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Brand Identity Tips</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Color Psychology</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} LogocraftAI. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-gray-500 text-sm flex items-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> in California
            </span>
          </div>
        </div>
      </div>
      
      {/* Newsletter subscription - show only on larger screens */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="hidden md:block bg-gradient-to-r from-blue-50 to-indigo-50 py-8"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-lg text-gray-900">Subscribe to our newsletter</h3>
              <p className="text-gray-600 text-sm">Get logo design tips and exclusive offers</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
