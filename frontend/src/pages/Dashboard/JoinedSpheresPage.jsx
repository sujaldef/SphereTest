import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Users, Award, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSpheres } from '../../services/api';
import {
  getSessionState,
  getStatusBadge,
} from '../../utils/sessionStateHelper';

export default function JoinedSpheresPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [spheres, setSpheres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSpheres();
  }, [user]);

  const loadSpheres = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSpheres();
      const joinedSpheres = data.filter(
        (s) =>
          s.participants.some((p) => p._id === user?._id) &&
          s.createdBy._id !== user?._id,
      );
      setSpheres(joinedSpheres);
    } catch (err) {
      console.error('Failed to load spheres:', err);
      setError('Failed to load spheres');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeForSphere = (sphere) => {
    const state = getSessionState(sphere);
    const badge = getStatusBadge(state);
    // Map DRAFT state to PENDING for joined spheres
    if (state === 'DRAFT') {
      return { text: 'PENDING', color: 'bg-gray-500/20 text-gray-400' };
    }
    // Map ENDED state to different color for joined spheres (show completion status)
    if (state === 'ENDED') {
      return { text: 'ENDED', color: 'bg-green-500/20 text-green-400' };
    }
    return badge;
  };

  return (
    <div className="w-full p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-black text-[#e2e8f0] mb-6">
          Joined Spheres
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-[#13131f] rounded-xl border border-[#1e1e2f] animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        ) : spheres.length === 0 ? (
          <div className="p-12 bg-[#13131f] rounded-xl border border-[#1e1e2f] text-center">
            <LogIn
              size={48}
              className="mx-auto text-[#64748b] opacity-30 mb-4"
            />
            <p className="text-[#64748b] text-lg">No spheres joined yet</p>
            <p className="text-sm text-[#64748b] mt-2">
              Join a sphere to take tests
            </p>
            <button
              onClick={() => navigate('/dashboard/join')}
              className="mt-4 px-6 py-2 bg-[#6366f1] text-white rounded-lg font-semibold hover:bg-[#6366f1]/80 transition-all"
            >
              Join Sphere
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spheres.map((sphere) => (
              <JoinedCard
                key={sphere._id}
                sphere={sphere}
                onNavigate={navigate}
                statusBadge={getStatusBadgeForSphere(sphere)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function JoinedCard({ sphere, onNavigate, statusBadge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-[#13131f] border border-[#1e1e2f] rounded-xl hover:border-[#6366f1]/50 transition-all space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#e2e8f0] line-clamp-2">
            {sphere.title}
          </h3>
          <p className="text-xs text-[#64748b] mt-1">
            Hosted by{' '}
            <span className="text-[#6366f1]">{sphere.createdBy.name}</span>
          </p>
        </div>
        <span
          className={`shrink-0 inline-block px-2 py-1 text-xs font-bold rounded ${statusBadge.color}`}
        >
          {statusBadge.text}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-[#64748b]">
          <span className="font-mono bg-[#0a0a0f] px-2 py-1 rounded text-[#6366f1] text-xs font-bold">
            {sphere.gameCode}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[#64748b]">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{sphere.participants.length} participants</span>
          </div>
        </div>
      </div>

      {/* Score & Rank (Placeholders) */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-[#0a0a0f] rounded-lg text-center text-sm">
        <div>
          <p className="text-xs text-[#64748b] mb-1">Your Score</p>
          <p className="font-bold text-[#6366f1]">—</p>
        </div>
        <div>
          <p className="text-xs text-[#64748b] mb-1">Your Rank</p>
          <p className="font-bold text-[#6366f1]">—</p>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-xs text-[#64748b]">
        <span>
          {sphere.startTime
            ? new Date(sphere.startTime).toLocaleDateString()
            : 'Date TBD'}
        </span>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => onNavigate(`/dashboard/sphere/${sphere._id}/analytics`)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#6366f1]/20 text-[#6366f1] rounded-lg text-sm font-semibold hover:bg-[#6366f1]/30 transition-all border-t border-[#1e1e2f] pt-3 mt-3"
      >
        <BarChart3 size={14} /> View Leaderboard
      </motion.button>
    </motion.div>
  );
}
