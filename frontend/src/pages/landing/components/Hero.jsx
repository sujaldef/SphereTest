import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';
import hero from '../../../assets/hero.png';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

export default function Hero() {
  return (
    <section className=" flex items-center bg-cream">
      <div className="container mx-auto px-6 py-[10%]">
        <motion.div
          className="grid md:grid-cols-2 gap-16 items-center"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {/* Left Side - Text */}
          <motion.div variants={fadeUp} className="flex flex-col justify-center">
            <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 leading-tight">
              Test Smarter.
              <br />
              <span className="text-gray-500">Together.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-xl mb-10">
              <strong>SphereTest</strong> is the live group-testing platform for modern educators. Create
              dynamic, secure “spheres” for quizzes & coding assessments.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-full flex items-center w-fit"
            >
              <FaRocket className="mr-2" /> Create Your Own Sphere
            </motion.button>
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
              className="w-full max-w-lg h-auto  pt-5 object-contain rounded-3xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
