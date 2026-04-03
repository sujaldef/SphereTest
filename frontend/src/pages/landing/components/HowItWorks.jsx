'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
// import { GameSectionHeader } from '../../../components/GameUI'; // Assuming you have this

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Admin Creates',
    desc: 'Build a quiz or coding test, set rules, and generate a unique “Sphere” link.',
    position: 'above',
  },
  {
    number: '02',
    title: 'Students Join',
    desc: 'Participants join simultaneously from any device using the shared link.',
    position: 'below',
  },
  {
    number: '03',
    title: 'Test Begins',
    desc: 'All participants start at the same time with a live countdown timer.',
    position: 'above',
  },
  {
    number: '04',
    title: 'Live Leaderboard',
    desc: 'Real-time ranking and progress tracking keeps everyone engaged.',
    position: 'below',
  },
  {
    number: '05',
    title: 'AI Analytics',
    desc: 'Instant results, weak topics, and performance insights for teachers.',
    position: 'above',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let ctx;

    mm.add('(min-width: 768px)', () => {
      ctx = gsap.context(() => {
        const container = timelineRef.current;
        if (!container) return;

        const scrollDistance = container.scrollWidth - window.innerWidth + 600;

        const horizontalScroll = gsap.to(container, {
          x: -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        itemsRef.current.forEach((item) => {
          if (!item) return;
          gsap.fromTo(
            item,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'left 85%',
                end: 'left 60%',
                scrub: 1,
                containerAnimation: horizontalScroll,
              },
            },
          );
        });
      }, sectionRef);
    });

    return () => {
      mm.revert();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative text-black overflow-hidden font-sans"
    >
      {/* DESKTOP View */}
      <div className="hidden md:block relative z-10">
        {/* --- LEFT SIDEBAR (NOW ON TOP WITH BACKGROUND) --- */}
        <div className="fixed top-0 left-0 h-screen w-[28%] lg:w-[25%] flex items-center justify-center z-[50] bg-transparent overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-sm px-6 relative z-10"
          >
            <h1 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-tight text-black drop-shadow-[4px_4px_0px_rgba(250,204,21,1)]">
              How It
              <br />
              Works
            </h1>
            <p className="text-lg font-bold mt-6 max-w-sm text-gray-800 bg-white p-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              From creation to analysis, our process is seamless, real-time, and
              built for engagement.
            </p>
          </motion.div>
        </div>

        {/* Timeline Section (Scrolls horizontally behind the left panel) */}
        <div className="relative ml-[35%] lg:ml-[40%] h-screen flex items-center">
          {/* Horizontal Line + Star */}
          <div className="fixed top-1/2 left-[35%] lg:left-[40%] right-0 transform -translate-y-1/2 flex items-center z-0">
            <div className="h-[4px] bg-black w-full shadow-[0px_4px_0px_rgba(0,0,0,0.2)]"></div>

            {/* Gradient Star (SVG) */}
            <div className="absolute z-[100] transform -translate-x-1/2 px-2 bg-transparent">
              <svg
                width="100"
                height="60"
                viewBox="0 0 4 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93"
                  stroke="url(#grad)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF69B4" stopOpacity="1" />
                    <stop offset="50%" stopColor="#00CED1" stopOpacity="1" />
                    <stop offset="100%" stopColor="#FF00FF" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Cards Container */}
          <div
            ref={timelineRef}
            className="flex items-center space-x-20 md:space-x-32 px-16 relative z-10"
          >
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`flex-shrink-0 w-[320px] md:w-[400px] ${
                  step.position === 'above' ? 'mb-60' : 'mt-60'
                }`}
              >
                {/* Game Box - 3D Block Style */}
                <div className="relative game-card-timeline group cursor-pointer">
                  {/* Shadow Layer */}
                  <div className="absolute inset-0 bg-[#292524] transform translate-x-2 translate-y-2 rounded-xl z-0 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"></div>

                  {/* Content Layer */}
                  <div className="relative z-10 bg-white border-4 border-black p-6 md:p-8 rounded-xl transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1">
                    {/* Step Badge - Game Badge Style */}
                    <div className="absolute -top-5 -left-5 w-12 h-12 flex items-center justify-center bg-[#facc15] border-4 border-black text-black text-lg font-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      {step.number}
                    </div>

                    <h3 className="text-lg md:text-2xl font-black text-black mt-4 mb-3 uppercase tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-800 leading-relaxed font-bold">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-[30vw]"></div>
          </div>
        </div>
      </div>

      {/* MOBILE View */}
      <div className="block md:hidden container mx-auto px-6 py-24 relative z-10">
        <div className="mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-black drop-shadow-[2px_2px_0px_rgba(250,204,21,1)]">
            How It
          </h2>
          <p className="text-5xl font-black uppercase tracking-tighter text-black drop-shadow-[2px_2px_0px_rgba(250,204,21,1)]">
            Works
          </p>
        </div>
        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Shadow Layer */}
              <div className="absolute inset-0 bg-[#292524] transform translate-x-2 translate-y-2 rounded-xl z-0"></div>

              {/* Content Layer */}
              <div className="relative z-10 bg-white border-4 border-black p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-3">
                  <span className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#facc15] border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black font-black text-lg rounded-full">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-black">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-800 font-bold">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Smooth hover transition for the timeline cards */}
      <style>{`
        .game-card-timeline {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </section>
  );
}
