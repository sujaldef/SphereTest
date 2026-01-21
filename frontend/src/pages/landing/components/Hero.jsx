import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

import hero from './../../../assets/hero.png'; // Ensure this path is correct

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="flex items-center bg-[#FFFDF0] min-h-[90vh] relative overflow-hidden">
      {/* CSS for the Buttons */}
      <style>{`
        .uiverse-btn-2x {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;              /* Reduced gap */
          padding: 6px 16px;     /* Reduced padding */
          color: #1a1a1a;
          text-shadow: none;
          text-transform: uppercase;
          cursor: pointer;
          border: solid 2px #1a1a1a; /* Thinner border */
          letter-spacing: 1px;
          font-weight: 800;
          font-size: 14px;       /* Reduced font size */
          background-color: #FFFDD0;
          border-radius: 50px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.15); /* Softer shadow */
          min-width: 130px;      /* Reduced width */
          height: 42px;          /* Reduced height */
        }

        .uiverse-btn-2x:active {
          transform: scale(0.95);
        }

        .uiverse-btn-2x svg {
          transition: all 0.45s ease;
          z-index: 2;
          width: 24px;           /* Reduced icon size */
          height: 24px;          /* Reduced icon size */
        }

        /* Default visible text */
        .play-text {
          transition: all 0.45s ease;
          transition-delay: 100ms;
          position: relative;
          z-index: 2;
        }

        /* Hover: Move icon and default text out/explode */
        .uiverse-btn-2x:hover svg {
          transform: scale(1.5) translate(50%, -10%); /* Adjusted scale for smaller button */
          opacity: 0.2;
        }

        .uiverse-btn-2x:hover .play-text {
          transform: translateX(150%);
          opacity: 0;
        }

        /* Hover: Slide in new text */
        .now-text {
          position: absolute;
          left: 0;
          width: 100%;
          text-align: center;
          transform: translateX(-100%);
          transition: all 0.45s ease;
          z-index: 3;
          font-size: 14px;      /* Matched new font size */
          font-weight: 900;
        }

        .uiverse-btn-2x:hover .now-text {
          transform: translateX(0);
          transition-delay: 100ms;
        }
        
        /* Variant for the second button */
        .btn-join {
           background-color: #ffffff;
        }
      `}</style>

      <div className="container mx-auto px-6 py-[5%] relative z-10">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {/* Left Side - Text */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col justify-center text-left"
          >
            <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 leading-tight text-stone-900">
              Test Smarter.
              <br />
              <span className="text-gray-400">Together.</span>
            </h1>

            <p className="text-xl md:text-2xl text-stone-600 max-w-xl mb-10 font-light">
              <strong>SphereTest</strong> is the live group-testing platform for
              modern educators. Create dynamic, secure “spheres” for quizzes &
              coding assessments.
            </p>

            {/* Side-by-Side Buttons */}
            <div className="flex flex-wrap gap-4"> {/* Reduced between buttonss */}
              {/* BUTTON 1: CREATE SPHERE here */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="uiverse-btn-2x"
                onClick={() => navigate("/create")}
              >

                {/* Rocket Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
                  <path
                    fill="#e53935"
                    d="M38.67,42H11.52C11.27,40.62,11,38.57,11,36c0-5,0-11,0-11s1.44-7.39,3.22-9.59 c1.67-2.06,2.76-3.48,6.78-4.41c3-0.7,7.13-0.23,9,1c2.15,1.42,3.37,6.67,3.81,11.29c1.49-0.3,5.21,0.2,5.5,1.28 C40.89,30.29,39.48,38.31,38.67,42z"
                  ></path>
                  <path
                    fill="#b71c1c"
                    d="M39.02,42H11.99c-0.22-2.67-0.48-7.05-0.49-12.72c0.83,4.18,1.63,9.59,6.98,9.79 c3.48,0.12,8.27,0.55,9.83-2.45c1.57-3,3.72-8.95,3.51-15.62c-0.19-5.84-1.75-8.2-2.13-8.7c0.59,0.66,3.74,4.49,4.01,11.7 c0.03,0.83,0.06,1.72,0.08,2.66c4.21-0.15,5.93,1.5,6.07,2.35C40.68,33.85,39.8,38.9,39.02,42z"
                  ></path>
                  <path
                    fill="#212121"
                    d="M35,27.17c0,3.67-0.28,11.2-0.42,14.83h-2C32.72,38.42,33,30.83,33,27.17 c0-5.54-1.46-12.65-3.55-14.02c-1.65-1.08-5.49-1.48-8.23-0.85c-3.62,0.83-4.57,1.99-6.14,3.92L15,16.32 c-1.31,1.6-2.59,6.92-3,8.96v10.8c0,2.58,0.28,4.61,0.54,5.92H10.5c-0.25-1.41-0.5-3.42-0.5-5.92l0.02-11.09 c0.15-0.77,1.55-7.63,3.43-9.94l0.08-0.09c1.65-2.03,2.96-3.63,7.25-4.61c3.28-0.76,7.67-0.25,9.77,1.13 C33.79,13.6,35,22.23,35,27.17z"
                  ></path>
                  <path
                    fill="#01579b"
                    d="M17.165,17.283c5.217-0.055,9.391,0.283,9,6.011c-0.391,5.728-8.478,5.533-9.391,5.337 c-0.913-0.196-7.826-0.043-7.696-5.337C9.209,18,13.645,17.32,17.165,17.283z"
                  ></path>
                  <path
                    fill="#212121"
                    d="M40.739,37.38c-0.28,1.99-0.69,3.53-1.22,4.62h-2.43c0.25-0.19,1.13-1.11,1.67-4.9 c0.57-4-0.23-11.79-0.93-12.78c-0.4-0.4-2.63-0.8-4.37-0.89l0.1-1.99c1.04,0.05,4.53,0.31,5.71,1.49 C40.689,24.36,41.289,33.53,40.739,37.38z"
                  ></path>
                  <path
                    fill="#81d4fa"
                    d="M10.154,20.201c0.261,2.059-0.196,3.351,2.543,3.546s8.076,1.022,9.402-0.554 c1.326-1.576,1.75-4.365-0.891-5.267C19.336,17.287,12.959,16.251,10.154,20.201z"
                  ></path>
                  <path
                    fill="#212121"
                    d="M17.615,29.677c-0.502,0-0.873-0.03-1.052-0.069c-0.086-0.019-0.236-0.035-0.434-0.06 c-5.344-0.679-8.053-2.784-8.052-6.255c0.001-2.698,1.17-7.238,8.986-7.32l0.181-0.002c3.444-0.038,6.414-0.068,8.272,1.818 c1.173,1.191,1.712,3,1.647,5.53c-0.044,1.688-0.785,3.147-2.144,4.217C22.785,29.296,19.388,29.677,17.615,29.677z M17.086,17.973 c-7.006,0.074-7.008,4.023-7.008,5.321c-0.001,3.109,3.598,3.926,6.305,4.27c0.273,0.035,0.48,0.063,0.601,0.089 c0.563,0.101,4.68,0.035,6.855-1.732c0.865-0.702,1.299-1.57,1.326-2.653c0.051-1.958-0.301-3.291-1.073-4.075 c-1.262-1.281-3.834-1.255-6.825-1.222L17.086,17.973z"
                  ></path>
                  <path
                    fill="#e1f5fe"
                    d="M15.078,19.043c1.957-0.326,5.122-0.529,4.435,1.304c-0.489,1.304-7.185,2.185-7.185,0.652 C12.328,19.467,15.078,19.043,15.078,19.043z"
                  ></path>
                </svg>
                <span className="now-text text-stone-800">Launch!</span>
                <span className="play-text">Create</span>
              </motion.button>

              {/* BUTTON 2: JOIN SPHERE */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="uiverse-btn-2x btn-join"
                onClick={() => navigate("/join")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-stone-900"
                >
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="12"
                    rx="2"
                    fill="#FDE047"
                    stroke="black"
                    strokeWidth="2"
                  ></rect>
                  <path d="M6 12h4m-2-2v4" stroke="black" strokeWidth="2"></path>
                  <line x1="15" y1="11" x2="15.01" y2="11" stroke="black" strokeWidth="3"></line>
                  <line x1="18" y1="13" x2="18.01" y2="13" stroke="black" strokeWidth="3"></line>
                </svg>

                <span className="now-text text-stone-800">Enter!</span>
                <span className="play-text">Join</span>
              </motion.button>

            </div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img
              src={hero}
              alt="Hero Visual"
              className="w-full max-w-lg h-auto pt-5 object-contain rounded-3xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://cdn.dribbble.com/users/1894420/screenshots/14022201/media/2d08a5c3707604313d461cb2820d859d.png?resize=800x600&vertical=center';
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}