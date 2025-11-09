import React from 'react';
import { motion } from 'framer-motion';
// Added icons for the new checklist
import { FaRocket, FaBrain, FaListOl, FaLock, FaChartLine } from 'react-icons/fa';
import { BsCheckCircle } from 'react-icons/bs';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, rotate: 10 },
  show: { opacity: 1, scale: 1, rotate: 0 },
};

export default function SphereConcept() {
  return (
    <section className="py-24 container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
      
      {/* --- UPDATED DYNAMIC VISUAL --- */}
     

      {/* --- UPDATED TEXT CONTENT --- */}
      <motion.div
        className="md:w-1/2 text-center md:text-left"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={fadeUp} className="text-4xl font-bold mb-6">
          What is a <span className="text-gray-500">Sphere</span>?
        </motion.h2>

        <motion.p variants={fadeUp} className="text-xl text-gray-700 mb-8">
          A **Sphere** is your personal, creative test room. It’s a live, gamified environment you control – launch a pop quiz, coding challenge, or full exam. Secure, real-time, and instantly insightful.
        </motion.p>
        
        {/* --- NEW CONTENT --- */}
        <motion.h3 variants={fadeUp} className="text-2xl font-semibold mb-5 text-left">
          Your All-in-One Testing Environment:
        </motion.h3>
        
        <motion.ul variants={fadeUp} className="space-y-3 text-left mb-10">
          <li className="flex items-center text-lg text-gray-700">
            <BsCheckCircle className="inline mr-3 text-black flex-shrink-0" />
            Live Leaderboards & Real-Time Engagement
          </li>
          <li className="flex items-center text-lg text-gray-700">
            <BsCheckCircle className="inline mr-3 text-black flex-shrink-0" />
            AI-Driven Performance Analytics
          </li>
          <li className="flex items-center text-lg text-gray-700">
            <BsCheckCircle className="inline mr-3 text-black flex-shrink-0" />
            Secure Rooms with Anti-Cheat Basics
          </li>
          <li className="flex items-center text-lg text-gray-700">
            <BsCheckCircle className="inline mr-3 text-black flex-shrink-0" />
            Custom Quizzes (MCQ, Coding, & Hybrid)
          </li>
        </motion.ul>
        {/* --- END NEW CONTENT --- */}

        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-black text-white font-bold py-3 px-7 rounded-full flex items-center mx-auto md:mx-0"
        >
          <FaRocket className="mr-2" /> Create Your First Sphere
        </motion.button>
      </motion.div>
    </section>
  );
}