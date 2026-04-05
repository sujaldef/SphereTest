import { motion } from 'framer-motion';
import {
  FaTrophy,
  FaBrain,
  FaShieldAlt,
  FaBolt,
  FaFire,
  FaStar,
} from 'react-icons/fa';

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

// Gamified floating animation for badges
const floatingBadge = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// --- NEW LIQUID VISUAL COMPONENT (Unchanged core, wrapped in game-like container) ---
const LiquidVisual = () => {
  return (
    <div className="relative flex justify-center items-center p-10 w-full h-full">
      <style>{`
        /* From Uiverse.io by andrew-manzyk - Adapted for React & Custom Colors */
        .loader {
          /* --- CUSTOM COLORS: CREAM & BLACK --- */
          --color-one: #F5E6D3; /* Rich Cream */
          --color-two: #000000; /* Pure Black */
          --color-three: rgba(245, 230, 211, 0.5); /* Cream Glow */
          --color-four: rgba(0, 0, 0, 0.3); /* Black Shadow */
          
          --time-animation: 3s; 
          --size: 3.5; 
          
          position: relative;
          border-radius: 50%;
          transform: scale(var(--size));
          box-shadow:
            0 0 25px 0 var(--color-three),
            0 20px 50px 0 var(--color-four);
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
          width: 0; height: 0; 
        }

        .loader svg #clipping {
          filter: contrast(15);
          animation: roundness calc(var(--time-animation) / 2) linear infinite;
        }

        .loader svg #clipping polygon {
          filter: blur(7px);
        }

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
  const gamifiedFeatures = [
    {
      title: 'Live Leaderboards',
      desc: 'Real-time competitive tracking',
      icon: <FaTrophy size={20} />,
      bgColor: 'bg-[#d0f4de]',
      iconColor: 'text-[#2d6a4f]',
    },
    {
      title: 'AI Analytics',
      desc: 'Instant insights & weak points',
      icon: <FaBrain size={20} />,
      bgColor: 'bg-[#e4c1f9]',
      iconColor: 'text-[#5a189a]',
    },
    {
      title: 'Secure Rooms',
      desc: 'Built-in anti-cheat basics',
      icon: <FaShieldAlt size={20} />,
      bgColor: 'bg-[#ffc8dd]',
      iconColor: 'text-[#c9184a]',
    },
    {
      title: 'Custom Quizzes',
      desc: 'MCQ, Coding & Hybrid formats',
      icon: <FaBolt size={20} />,
      bgColor: 'bg-[#a2d2ff]',
      iconColor: 'text-[#0077b6]',
    },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-24 font-sans">
      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        {/* --- LEFT SIDE: TEXT CONTENT --- */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={fadeUp}
            className="inline-block mb-4 px-4 py-1 border-2 border-black rounded-full bg-white font-bold text-sm uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            Level 1: The Basics
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-5xl md:text-6xl font-black mb-6 text-black tracking-tight uppercase"
          >
            What is a{' '}
            <span className="text-white custom-text-outline">Sphere</span>?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-xl text-gray-800 mb-10 font-medium bg-white/60 p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] backdrop-blur-sm"
          >
            A <strong>Sphere</strong> is your personal, creative test room. It’s
            a live, gamified environment you control – launch a pop quiz, coding
            challenge, or full exam. Secure, real-time, and instantly
            insightful.
          </motion.p>

          <motion.h3
            variants={fadeUp}
            className="text-2xl font-black uppercase tracking-tight mb-6 text-black"
          >
            Your Quest Objectives:
          </motion.h3>

          {/* Gamified Feature Grid */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
          >
            {gamifiedFeatures.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, translateY: -5 }}
                className="flex flex-col p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] ${item.bgColor} ${item.iconColor} group-hover:-translate-y-1 transition-transform`}
                  >
                    {item.icon}
                  </span>
                  <h4 className="font-black text-lg text-black uppercase tracking-tight">
                    {item.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 font-bold pl-1">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* --- RIGHT SIDE: LIQUID VISUAL + GAMIFIED ELEMENTS --- */}
        <div className="w-full lg:w-1/2 flex justify-center items-center h-[500px] relative mt-16 lg:mt-0">
          {/* Floating Gamified Badge 1 */}
          <motion.div
            variants={floatingBadge}
            animate="animate"
            className="absolute top-10 right-10 md:right-20 z-20 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest border-2 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)] rotate-6"
          >
            <FaFire className="text-[#ff5400] text-xl drop-shadow-md" /> Streak
            x5
          </motion.div>

          {/* Floating Gamified Badge 2 */}
          <motion.div
            variants={floatingBadge}
            animate="animate"
            style={{ animationDelay: '1.5s' }}
            className="absolute bottom-10 left-10 md:left-20 z-20 flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -rotate-6"
          >
            <FaStar className="text-[#FACC15] text-xl drop-shadow-md" /> +500 XP
          </motion.div>

          {/* Glowing Game Portal Ring   Behind Visual */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="w-[300px] h-[300px] border-4 border-dashed border-black rounded-full opacity-20 animate-[spin_20s_linear_infinite]"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
            className="relative z-10"
          >
            <LiquidVisual />
          </motion.div>
        </div>
      </div>

      {/* --- GAMIFIED STYLES --- */}
      <style>{`
        /* Custom Text Outline for Gamified look */
        .custom-text-outline {
          color: white;
          text-shadow: 
            -2px -2px 0 #000,  
             2px -2px 0 #000,
            -2px  2px 0 #000,
             2px  2px 0 #000,
             4px  4px 0 #000; /* Drop shadow */
        }
      `}</style>
    </section>
  );
}
