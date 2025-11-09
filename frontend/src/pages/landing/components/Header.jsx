import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FBF9F1]/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-black">
          Sphere<span className="text-gray-500">Test</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-5 rounded-full flex items-center"
        >
          <FaRocket className="mr-1.5" /> Create Your Own Sphere
        </motion.button>
      </div>
    </nav>
  );
}