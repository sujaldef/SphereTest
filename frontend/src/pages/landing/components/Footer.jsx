import React from 'react';

export default function Footer() {
  return (
    <footer className="py-16 bg-[#FBF9F1] border-t border-gray-200">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-6 md:mb-0">
          <div className="text-xl font-bold text-black">
            Sphere<span className="text-gray-500">Test</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} SphereTest. All rights reserved.</p>
        </div>

        <div className="flex gap-8">
          <a href="#" className="text-gray-600 hover:text-black transition">About</a>
          <a href="#" className="text-gray-600 hover:text-black transition">Contact</a>
          <a href="#" className="text-gray-600 hover:text-black transition">Privacy Policy</a>
          <a href="#" className="text-gray-600 hover:text-black transition">Terms</a>
        </div>
      </div>
    </footer>
  );
}