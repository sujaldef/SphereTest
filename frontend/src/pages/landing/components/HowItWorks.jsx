'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

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
      className="relative  bg-[#FFFDF0] text-black overflow-hidden font-sans"
    >
      {/* DESKTOP View */}
      <div className="hidden md:block">
        {/* Sidebar Title */}
        <div className="fixed top-0 left-0 h-screen w-[35%] lg:w-[40%] flex items-center justify-center bg-[#FFFDF0] z-[10]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-sm"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-black leading-tight">
              How It
              <br />
              <span className="text-gray-500">Works</span>
            </h1>
            <p className="text-lg text-gray-600 mt-6">
              From creation to analysis, our process is seamless, real-time, and
              built for engagement.
            </p>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <div className="relative ml-[35%] lg:ml-[40%] h-screen flex items-center">
          {/* Horizontal Line + Star */}
          <div className="fixed top-1/2 left-[35%] lg:left-[40%] right-0 transform -translate-y-1/2 flex items-center z-0">
            <div className="h-[2px] bg-gray-300 w-full"></div>

            {/* Gradient Star (SVG) */}
            <div className="absolute z-[100] transform -translate-x-1/2 bg-[#FFFDF0] px-2">
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
                  strokeWidth="1.2" // thinner stroke
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
            className="flex items-center space-x-20 md:space-x-32 px-16"
          >
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`flex-shrink-0 w-[320px] md:w-[400px] ${
                  step.position === 'above' ? 'mb-60' : 'mt-60'
                }`}
              >
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 relative">
                  <span className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center bg-black text-white text-xl font-bold rounded-full">
                    {step.number}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-black mt-8 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-[30vw]"></div>
          </div>
        </div>
      </div>

      {/* MOBILE View */}
      <div className="block md:hidden container mx-auto px-6 py-24 bg-[#FFFDF0]">
        <h2 className="text-5xl font-bold text-center mb-4">How It</h2>
        <h2 className="text-5xl font-bold text-center text-gray-500 mb-12">
          Works
        </h2>
        <div className="space-y-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black text-white text-lg font-bold rounded-full">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
