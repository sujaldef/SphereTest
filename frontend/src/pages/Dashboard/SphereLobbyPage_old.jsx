import { motion } from 'framer-motion';
import { Users, Play } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function SphereLobbyPage() {
  const { id } = useParams();

  return (
    <div className="w-full h-full p-8 bg-[#0a0a0f]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mt-20"
      >
        <div className="bg-[#13131f] border border-[#1e1e2f] rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#6366f1]/20 rounded-full mb-6">
            <Users size={40} className="text-[#6366f1]" />
          </div>

          <h1 className="text-4xl font-black text-[#e2e8f0] mb-4">
            Waiting for Session
          </h1>

          <p className="text-[#64748b] mb-8 text-lg">
            The test will start when the instructor launches it
          </p>

          {/* Participant Count */}
          <div className="inline-block px-6 py-3 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-lg mb-8">
            <p className="text-sm text-[#64748b]">Participants</p>
            <p className="text-3xl font-black text-[#6366f1]">0</p>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-[#6366f1] rounded-full"
              />
            ))}
          </div>

          <p className="text-[#64748b] text-sm">Waiting for instructor...</p>
        </div>
      </motion.div>
    </div>
  );
}
