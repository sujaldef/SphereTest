import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';
import { BsCheckCircle } from 'react-icons/bs';

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

// --- NEW LIQUID VISUAL COMPONENT ---
const LiquidVisual = () => {
  return (
    <div className="relative flex justify-center items-center p-10">
      <style>{`
        /* From Uiverse.io by andrew-manzyk - Adapted for React & Custom Colors */
        .loader {
          /* --- CUSTOM COLORS: CREAM & BLACK --- */
          --color-one: #F5E6D3; /* Rich Cream */
          --color-two: #000000; /* Pure Black */
          --color-three: rgba(245, 230, 211, 0.5); /* Cream Glow */
          --color-four: rgba(0, 0, 0, 0.3); /* Black Shadow */
          
          --time-animation: 3s; /* Slowed down slightly for elegance */
          --size: 3.5; /* SCALED UP for the section */
          
          position: relative;
          border-radius: 50%;
          transform: scale(var(--size));
          box-shadow:
            0 0 25px 0 var(--color-three),
            0 20px 50px 0 var(--color-four);
            /* Note: We removed 'colorize' animation to keep strict Cream/Black palette */
        }

        .loader::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border-top: solid 1px var(--color-one);
          border-bottom: solid 1px var(--color-two);
          background: linear-gradient(180deg, rgba(255,255,255,0.1), var(--color-four));
          box-shadow:
            inset 0 10px 10px 0 var(--color-three),
            inset 0 -10px 10px 0 var(--color-four);
            z-index: 10;
        }

        .loader .box {
          width: 100px;
          height: 100px;
          background: linear-gradient(
            180deg,
            var(--color-one) 30%,
            var(--color-two) 70%
          );
          mask: url(#clipping);
          -webkit-mask: url(#clipping);
        }

        .loader svg {
          position: absolute;
          width: 0; height: 0; /* Hide the SVG wrapper but keep defs active */
        }

        .loader svg #clipping {
          filter: contrast(15);
          animation: roundness calc(var(--time-animation) / 2) linear infinite;
        }

        .loader svg #clipping polygon {
          filter: blur(7px);
        }

        /* Rotations for the internal liquid shapes */
        .loader svg #clipping polygon:nth-child(1) {
          transform-origin: 75% 25%;
          transform: rotate(90deg);
        }
        .loader svg #clipping polygon:nth-child(2) {
          transform-origin: 50% 50%;
          animation: rotation var(--time-animation) linear infinite reverse;
        }
        .loader svg #clipping polygon:nth-child(3) {
          transform-origin: 50% 60%;
          animation: rotation var(--time-animation) linear infinite;
          animation-delay: calc(var(--time-animation) / -3);
        }
        .loader svg #clipping polygon:nth-child(4) {
          transform-origin: 40% 40%;
          animation: rotation var(--time-animation) linear infinite reverse;
        }
        .loader svg #clipping polygon:nth-child(5) {
          transform-origin: 40% 40%;
          animation: rotation var(--time-animation) linear infinite reverse;
          animation-delay: calc(var(--time-animation) / -2);
        }
        .loader svg #clipping polygon:nth-child(6) {
          transform-origin: 60% 40%;
          animation: rotation var(--time-animation) linear infinite;
        }
        .loader svg #clipping polygon:nth-child(7) {
          transform-origin: 60% 40%;
          animation: rotation var(--time-animation) linear infinite;
          animation-delay: calc(var(--time-animation) / -1.5);
        }

        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes roundness {
          0% { filter: contrast(15); }
          20% { filter: contrast(3); }
          40% { filter: contrast(3); }
          60% { filter: contrast(15); }
          100% { filter: contrast(15); }
        }
      `}</style>

      <div className="loader">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <mask id="clipping">
              <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
              <polygon points="25,25 75,25 50,75" fill="white"></polygon>
              <polygon points="50,25 75,75 25,75" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
            </mask>
          </defs>
        </svg>
        <div className="box"></div>
      </div>
    </div>
  );
};

// --- MAIN SECTION ---
export default function SphereConcept() {
  return (
    <section className="py-24 container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 overflow-hidden">
      
      {/* --- LEFT SIDE: TEXT CONTENT (UNCHANGED) --- */}
      <motion.div
        className="md:w-1/2 text-center md:text-left"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-6">
          What is a <span className="text-gray-500">Sphere</span>?
        </motion.h2>

        <motion.p variants={fadeUp} className="text-xl text-gray-700 mb-8">
          A **Sphere** is your personal, creative test room. It’s a live, gamified environment you control – launch a pop quiz, coding challenge, or full exam. Secure, real-time, and instantly insightful.
        </motion.p>
        
        <motion.h3 variants={fadeUp} className="text-2xl font-semibold mb-5 text-left">
          Your All-in-One Testing Environment:
        </motion.h3>
        
        <motion.ul variants={fadeUp} className="space-y-3 text-left mb-10">
          {[
            "Live Leaderboards & Real-Time Engagement",
            "AI-Driven Performance Analytics",
            "Secure Rooms with Anti-Cheat Basics",
            "Custom Quizzes (MCQ, Coding, & Hybrid)"
          ].map((item, index) => (
            <li key={index} className="flex items-center text-lg text-gray-700">
              <BsCheckCircle className="inline mr-3 text-black flex-shrink-0" />
              {item}
            </li>
          ))}
        </motion.ul>

       
      </motion.div>

      {/* --- RIGHT SIDE: NEW LIQUID VISUAL --- */}
      <div className="w-full md:w-1/2 flex justify-center items-center h-[400px]">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
        >
            <LiquidVisual />
        </motion.div>
      </div>

    </section>
  );
}