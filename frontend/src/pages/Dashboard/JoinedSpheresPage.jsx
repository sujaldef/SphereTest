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
import { GameSectionHeader } from '../../components/GameUI';

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
        <GameSectionHeader title="JOINED SPHERES" />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-white border-4 border-black rounded-lg animate-pulse shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 p-6 bg-red-200 border-4 border-red-500 rounded-lg font-bold">
            {error}
          </div>
        ) : spheres.length === 0 ? (
          <div className="mt-6 p-12 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] text-center">
            <LogIn size={48} className="mx-auto text-black opacity-30 mb-4" />
            <p className="text-black font-bold uppercase">
              No spheres joined yet
            </p>
            <p className="text-sm text-black font-bold mt-2">
              Join a sphere to take tests
            </p>
            <button
              onClick={() => navigate('/join')}
              className="mt-4 px-6 py-2 game-box game-btn-primary"
            >
              <div className="game-box-shadow" />
              <div className="game-box-content text-xs">Join Sphere</div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
      whileHover={{ y: -4 }}
      className="p-6 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-black line-clamp-2 uppercase">
            {sphere.title}
          </h3>
          <p className="text-xs font-bold mt-1 text-black">
            By <span className="text-yellow-600">{sphere.createdBy.name}</span>
          </p>
        </div>
        <span
          className={`shrink-0 inline-block px-3 py-1 text-xs font-black rounded-lg border-2 border-black ${statusBadge.color}`}
        >
          {statusBadge.text}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm font-bold">
        <div className="flex items-center gap-2 text-black">
          <span className="font-mono bg-yellow-200 border-2 border-black px-2 py-1 rounded text-black text-xs font-black">
            {sphere.gameCode}
          </span>
        </div>

        <div className="flex items-center gap-4 text-black">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{sphere.participants.length} participants</span>
          </div>
        </div>
      </div>

      {/* Score & Rank (Placeholders) */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-yellow-100 border-2 border-black rounded-lg text-center text-sm font-black">
        <div>
          <p className="text-xs text-black mb-1">YOUR SCORE</p>
          <p className="font-black text-black">—</p>
        </div>
        <div>
          <p className="text-xs text-black mb-1">YOUR RANK</p>
          <p className="font-black text-black">—</p>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-xs font-bold text-black">
        <span>
          {sphere.startTime
            ? new Date(sphere.startTime).toLocaleDateString()
            : 'Date TBD'}
        </span>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ y: -2 }}
        onClick={() => onNavigate(`/dashboard/sphere/${sphere._id}/analytics`)}
        className="w-full game-box game-btn-primary border-t-4 border-t-black pt-3 mt-3"
      >
        <div className="game-box-shadow" />
        <div className="game-box-content text-xs gap-2">
          <BarChart3 size={14} />
          View Leaderboard
        </div>
      </motion.button>
    </motion.div>
  );
}
