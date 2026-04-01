import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function LiveTestPage() {
  const { id } = useParams();

  return (
    <div className="w-full h-full flex bg-[#0a0a0f]">
      {/* Main Test Area */}
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-[#13131f] border border-[#1e1e2f] rounded-xl p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6366f1]/20 rounded-full mb-6">
              <BookOpen size={14} className="text-[#6366f1]" />
              <span className="text-xs font-bold text-[#6366f1]">
                Question 1 of 10
              </span>
            </div>

            <h2 className="text-2xl font-black text-[#e2e8f0] mb-6">
              Live Test in Progress
            </h2>

            <p className="text-[#64748b]">
              Test interface coming soon. Questions will load here during live
              sessions.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="w-80 bg-[#0f0f1a] border-l border-[#1e1e2f] p-6 overflow-y-auto">
        <h3 className="text-lg font-black text-[#e2e8f0] mb-4">
          Live Leaderboard
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-[#13131f] rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#64748b]">#{i}</span>
                <div className="w-8 h-8 bg-[#6366f1] rounded-full flex items-center justify-center text-xs font-bold">
                  {i}
                </div>
                <span className="text-sm font-semibold text-[#e2e8f0]">
                  Student {i}
                </span>
              </div>
              <span className="text-sm font-bold text-[#6366f1]">0 pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
