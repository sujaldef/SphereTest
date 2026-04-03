import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, Clock, Plus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSpheres } from '../../services/api';
import { getSessionState } from '../../utils/sessionStateHelper';
import { GameSectionHeader } from '../../components/GameUI';

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allSpheres, setAllSpheres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSpheres = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getSpheres();
        setAllSpheres(data);
      } catch (err) {
        console.error('Failed to load spheres:', err);
        setError('Failed to load spheres');
      } finally {
        setLoading(false);
      }
    };
    loadSpheres();
  }, [user]);

  // Filter spheres: created vs joined
  const createdSpheres = allSpheres.filter(
    (s) => s.createdBy._id === user?._id,
  );
  const joinedSpheres = allSpheres.filter(
    (s) =>
      s.participants.some((p) => p._id === user?._id) &&
      s.createdBy._id !== user?._id,
  );

  // Calculate stats with proper session state consideration
  const now = new Date();
  const upcomingSpheres = allSpheres.filter((s) => {
    const state = getSessionState(s);
    return state === 'UPCOMING' || state === 'ACTIVE';
  });

  const stats = {
    created: createdSpheres.length,
    joined: joinedSpheres.length,
    upcoming: upcomingSpheres.length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full p-8 space-y-8">
      {/* Welcome Header - Game Styled */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6"
      >
        <h1 className="text-4xl font-black text-black uppercase tracking-widest">
          Welcome back, <span className="text-yellow-500">{user?.name}</span>
        </h1>
        <p className="text-black font-bold mt-2 uppercase">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <StatCard
          icon={<Plus size={24} />}
          label="Spheres Created"
          value={loading ? '...' : stats.created}
          color="from-indigo-500 to-purple-500"
          variants={itemVariants}
        />
        <StatCard
          icon={<LogIn size={24} />}
          label="Joined"
          value={loading ? '...' : stats.joined}
          color="from-blue-500 to-cyan-500"
          variants={itemVariants}
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Avg Score"
          value="—"
          color="from-green-500 to-emerald-500"
          variants={itemVariants}
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Upcoming"
          value={loading ? '...' : stats.upcoming}
          color="from-orange-500 to-red-500"
          variants={itemVariants}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.button
          variants={itemVariants}
          whileHover={{ y: -4 }}
          onClick={() => navigate('/dashboard/create')}
          className="p-6 bg-yellow-300 border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all text-left"
        >
          <Plus size={32} className="mb-3 text-black" />
          <h3 className="text-lg font-black text-black uppercase">
            Create a Sphere
          </h3>
          <p className="text-sm text-black font-bold mt-2">
            Start a new test session and invite students
          </p>
        </motion.button>

        <motion.button
          variants={itemVariants}
          whileHover={{ y: -4 }}
          onClick={() => navigate('/join')}
          className="p-6 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all text-left"
        >
          <LogIn size={32} className="mb-3 text-black" />
          <h3 className="text-lg font-black text-black uppercase">
            Join a Sphere
          </h3>
          <p className="text-sm text-black font-bold mt-2">
            Enter a code to join a live test session
          </p>
        </motion.button>
      </motion.div>

      {/* Upcoming Spheres */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <GameSectionHeader title="UPCOMING SESSIONS" />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-white border-4 border-black rounded-lg animate-pulse shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              ></div>
            ))}
          </div>
        ) : upcomingSpheres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSpheres.map((sphere) => (
              <UpcomingCard key={sphere._id} sphere={sphere} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] text-center">
            <Calendar size={32} className="mx-auto text-black mb-3" />
            <p className="text-black font-bold uppercase">
              No upcoming sessions yet
            </p>
            <button
              onClick={() => navigate('/dashboard/create')}
              className="mt-4 px-4 py-2 game-box game-btn-primary"
            >
              <div className="game-box-shadow" />
              <div className="game-box-content text-xs">Create one now</div>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, color, variants }) {
  return (
    <motion.div
      variants={variants}
      className="p-6 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 opacity-30 rounded-full"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-black text-2xl">{icon}</div>
          <div className="w-12 h-12 bg-yellow-300 border-2 border-black rounded-full flex items-center justify-center font-black text-sm"></div>
        </div>
        <p className="text-black font-bold text-sm uppercase">{label}</p>
        <p className="text-4xl font-black text-black mt-2">{value}</p>
      </div>
    </motion.div>
  );
}

function SphereCard({ sphere }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 bg-[#13131f] border border-[#1e1e2f] rounded-xl hover:border-[#6366f1]/50 transition-all cursor-pointer"
      onClick={() => navigate(`/dashboard/sphere/${sphere._id}/questions`)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-[#e2e8f0] line-clamp-2">
          {sphere.title}
        </h3>
        <span className="px-2 py-1 bg-[#6366f1]/20 text-[#6366f1] text-xs font-bold rounded">
          {sphere.status || 'UPCOMING'}
        </span>
      </div>
      <div className="space-y-2 text-sm text-[#64748b]">
        <div className="flex items-center gap-2">
          <span className="font-mono bg-[#0a0a0f] px-2 py-1 rounded text-[#6366f1] font-bold">
            {sphere.gameCode}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>
              {sphere.participants.length}/{sphere.maxPlayers || 50}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>
              {sphere.startTime
                ? new Date(sphere.startTime).toLocaleDateString()
                : 'TBD'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UpcomingCard({ sphere }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-black text-black line-clamp-2 uppercase">
          {sphere.title}
        </h3>
        <span className="px-3 py-1 bg-orange-300 border-2 border-black text-black text-xs font-black rounded-lg uppercase">
          UPCOMING
        </span>
      </div>
      <div className="space-y-2 text-sm font-bold text-black">
        <div className="flex items-center gap-2">
          <span className="font-mono bg-yellow-200 border-2 border-black px-2 py-1 rounded text-black font-black">
            {sphere.gameCode}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>
              {sphere.participants.length}/{sphere.maxPlayers || 50}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {sphere.startTime
                ? new Date(sphere.startTime).toLocaleDateString()
                : 'TBD'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
