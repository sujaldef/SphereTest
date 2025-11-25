import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartLine,
  FaBrain,
  FaUsers,
  FaLock,
  FaGamepad,
  FaRocket,
  FaStar,
  FaShieldAlt,
  FaHeart,
} from 'react-icons/fa';

// --- ANIMATION VARIANTS ---
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

// --- DATA: NOW INCLUDES "FUN" ICONS FOR THE CLICK EFFECT ---
const features = [
  {
    id: 1,
    icon: <FaChartLine size={24} />,
    title: 'Live Tracking',
    desc: 'Watch XP & progress live. Identify MVPs instantly.',
    bgColor: 'bg-[#d0f4de]', // Pastel Green
    accentColor: 'bg-[#2d6a4f]',
    rarity: 'COMMON',
    barType: 'XP',
    // The fun item that flies up when clicked
    funIcon: <FaRocket size={30} className="text-green-600 drop-shadow-md" />,
    funText: '+100 XP!',
  },
  {
    id: 2,
    icon: <FaBrain size={24} />,
    title: 'AI Analytics',
    desc: 'Instant insights on boss-level difficulty & patterns.',
    bgColor: 'bg-[#e4c1f9]', // Pastel Purple
    accentColor: 'bg-[#5a189a]',
    rarity: 'EPIC',
    barType: 'MP',
    funIcon: <FaStar size={30} className="text-purple-600 drop-shadow-md" />,
    funText: 'Level Up!',
  },
  {
    id: 3,
    icon: <FaUsers size={24} />,
    title: 'Co-Op Mode',
    desc: 'Collaborate with other admins to co-manage quests.',
    bgColor: 'bg-[#a2d2ff]', // Pastel Blue
    accentColor: 'bg-[#0077b6]',
    rarity: 'RARE',
    barType: 'HP',
    funIcon: <FaHeart size={30} className="text-blue-600 drop-shadow-md" />,
    funText: 'Healed!',
  },
  {
    id: 4,
    icon: <FaLock size={24} />,
    title: 'Secure Room',
    desc: 'Anti-cheat shields & locked environments.',
    bgColor: 'bg-[#ffc8dd]', // Pastel Pink
    accentColor: 'bg-[#c9184a]',
    rarity: 'LEGENDARY',
    barType: 'DEF',
    funIcon: <FaShieldAlt size={30} className="text-pink-600 drop-shadow-md" />,
    funText: 'Shield Up!',
  },
];

export default function Features() {
  // Track which card is currently displaying the "fun" animation
  const [clickedId, setClickedId] = useState(null);

  const handleCardClick = (id) => {
    // Trigger animation
    setClickedId(id);
    // Reset after 1 second so user can click again
    setTimeout(() => setClickedId(null), 800);
  };

  return (
    <section className="py-24 bg-[#FFFDF0] relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 text-gray-900 opacity-5 rotate-12 pointer-events-none">
        <FaGamepad size={120} />
      </div>
      <div className="absolute bottom-10 right-10 text-gray-900 opacity-5 -rotate-12 pointer-events-none">
        <FaGamepad size={150} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
            Level Up Your Classroom
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
            Click the cards to power up your teaching toolkit.
          </p>
        </motion.div>

        {/* --- CARDS GRID --- */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {features.map((f) => (
            <motion.div
              key={f.id}
              variants={cardVariant}
              onClick={() => handleCardClick(f.id)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }} // Squish effect on click
              className="relative group cursor-pointer select-none"
            >
              {/* --- THE ROCKET LAUNCH ANIMATION --- */}
              <AnimatePresence>
                {clickedId === f.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, y: -150, scale: 1.5, rotate: 0 }}
                    exit={{ opacity: 0, y: -200 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 pointer-events-none"
                  >
                    {/* The Icon */}
                    <div className="mb-2">{f.funIcon}</div>
                    {/* The Text */}
                    <span className="text-black font-black text-lg bg-white border-2 border-black px-2 py-1 rounded shadow-md transform -rotate-6">
                      {f.funText}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- CARD CONTENT --- */}
              <div
                className={`${f.bgColor} h-full p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start relative overflow-hidden`}
              >
                {/* Rarity Badge */}
                <div className="absolute top-3 right-3 border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black tracking-widest rounded-md uppercase">
                  {f.rarity}
                </div>

                {/* Icon Box */}
                <div className="bg-white w-14 h-14 border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                  {f.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black mb-2 text-black uppercase tracking-tight">
                  {f.title}
                </h3>

                {/* Description */}
                <p className="text-black/70 text-sm font-medium leading-relaxed mb-6">
                  {f.desc}
                </p>

                {/* Game HUD Bar (Animates on Click) */}
                <div className="mt-auto w-full">
                  <div className="flex justify-between text-[10px] font-black text-black/60 uppercase tracking-wider mb-1">
                    <span>{f.barType}</span>
                    <span>{clickedId === f.id ? '100/100' : '40/100'}</span>
                  </div>

                  <div className="w-full bg-white h-3 rounded-full border-2 border-black relative overflow-hidden">
                    {/* The Fill Bar */}
                    <motion.div
                      className={`${f.accentColor} h-full border-r-2 border-black rounded-l-full`}
                      initial={{ width: '40%' }}
                      animate={{ width: clickedId === f.id ? '100%' : '40%' }} // Fills up on click!
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      }}
                    />
                    {/* The Shine */}
                    <div className="absolute top-0.5 left-1 w-full h-1 bg-white opacity-30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
