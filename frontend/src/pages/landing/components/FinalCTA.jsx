import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold mb-6">Ready to Launch Your Sphere?</h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Build a gamified, real-time quiz or coding challenge in seconds.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-2xl flex items-center mx-auto"
        >
          <FaRocket className="mr-2" /> Create Your Own Sphere
        </motion.button>
      </div>
    </section>
  );
}