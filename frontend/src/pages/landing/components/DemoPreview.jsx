import { useState } from 'react';
import { motion } from 'framer-motion';

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

export default function DemoPreview() {
  const [activeTab, setActiveTab] = useState('Admin Dashboard');

  const tabs = [
    { name: 'Admin Dashboard', color: 'bg-[#a2d2ff]' }, // Pastel Blue
    { name: 'Live Leaderboard', color: 'bg-[#d0f4de]' }, // Pastel Green
    { name: 'Coding Environment', color: 'bg-[#e4c1f9]' }, // Pastel Purple
  ];

  return (
    <section className="py-24 relative overflow-hidden font-sans text-center">
      <div className="container mx-auto px-6 relative z-10">
        {/* --- HEADER --- */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12"
        >
          <div className="inline-block bg-white border-4 border-black px-8 py-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-widest">
              See It in Action
            </h2>
          </div>
        </motion.div>

        {/* --- MAIN CONSOLE / MONITOR --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          viewport={{ once: true }}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-[10px_10px_0px_rgba(0,0,0,1)] border-4 border-black max-w-5xl mx-auto relative"
        >
          {/* Console "Lights" Decoration */}
          <div className="absolute top-4 left-6 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"></div>
          </div>

          <div className="absolute top-3 right-6 text-xs font-black uppercase tracking-widest text-black/50">
            SYS.PREVIEW.v1
          </div>

          {/* THE SCREEN (Replace the text inside here with your <img> later) */}
          <div className="mt-6 bg-gray-900 h-64 sm:h-[450px] rounded-xl flex items-center justify-center border-4 border-black relative overflow-hidden shadow-inner">
            {/* Screen Glare Effect */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none transform -skew-x-12 translate-x-20"></div>

            {/* Placeholder Content */}
            <motion.div
              key={activeTab} // Forces re-animation when tab changes
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center p-6"
            >
              <div className="text-5xl mb-4 animate-pulse">📸</div>
              <p className="text-[#FACC15] font-bold text-xl uppercase tracking-widest font-mono">
                [ {activeTab} Screenshot ]
              </p>
              <p className="text-gray-400 mt-2 text-sm font-mono">
                Awaiting visual feed...
              </p>
            </motion.div>
          </div>

          {/* --- INTERACTIVE TABS (Buttons) --- */}
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <motion.button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  className={`
                    relative px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide border-2 border-black transition-colors duration-200
                    ${
                      isActive
                        ? `${tab.color} text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] translate-y-[-2px]`
                        : 'bg-white text-gray-500 hover:text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                    }
                  `}
                >
                  {tab.name}
                  {/* Small dot to indicate active state */}
                  {isActive && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-black border border-white"></span>
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* --- BACKGROUND STYLES --- */}
    </section>
  );
}
