import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaBrain, FaUsers, FaLock } from 'react-icons/fa';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const card = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } } };

const features = [
  { icon: <FaChartLine size={28} />, title: 'Real-time Monitoring', desc: "Watch participants' progress live, identify who's active, and track time-per-question." },
  { icon: <FaBrain size={28} />, title: 'AI-Driven Analytics', desc: 'Instant insights on question difficulty, common mistakes, and performance patterns.' },
  { icon: <FaUsers size={28} />, title: 'Multi-Admin Management', desc: 'Collaborate with other teachers or TAs to co-manage a single test sphere.' },
  { icon: <FaLock size={28} />, title: 'Secure Environment', desc: 'Secure links, tab-switching detection, and a controlled testing room.' },
];

export default function Features() {
  return (
    <section className="py-24 bg-white border-y border-gray-200">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features for Modern Education</h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              variants={card}
            >
              <div className="text-black mb-5">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}