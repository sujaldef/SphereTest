import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, Clock, Plus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSpheres } from '../../services/api';
import { getSessionState } from '../../utils/sessionStateHelper';

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
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-[#e2e8f0]">
          Welcome back, <span className="text-[#6366f1]">{user?.name}</span>
        </h1>
        <p className="text-[#64748b] mt-2">
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
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/dashboard/create')}
          className="p-6 bg-gradient-to-br from-[#6366f1] to-[#6366f1]/80 rounded-xl border border-[#6366f1]/30 hover:border-[#6366f1] transition-all shadow-lg shadow-[#6366f1]/20"
        >
          <Plus size={32} className="mb-3" />
          <h3 className="text-lg font-bold text-white">Create a Sphere</h3>
          <p className="text-sm text-[#e2e8f0]/80 mt-2">
            Start a new test session and invite students
          </p>
        </motion.button>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/dashboard/join')}
          className="p-6 bg-gradient-to-br from-[#1e293b] to-[#1e293b]/80 rounded-xl border border-[#64748b]/30 hover:border-[#6366f1] transition-all shadow-lg hover:shadow-[#6366f1]/20"
        >
          <LogIn size={32} className="mb-3" />
          <h3 className="text-lg font-bold text-white">Join a Sphere</h3>
          <p className="text-sm text-[#64748b] mt-2">
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
        <h2 className="text-2xl font-bold text-[#e2e8f0]">Upcoming Sessions</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-[#13131f] rounded-xl border border-[#1e1e2f] animate-pulse"
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
          <div className="p-8 bg-[#13131f] rounded-xl border border-[#1e1e2f] text-center">
            <Calendar
              size={32}
              className="mx-auto text-[#64748b] mb-3 opacity-50"
            />
            <p className="text-[#64748b]">No upcoming sessions yet</p>
            <button
              onClick={() => navigate('/dashboard/create')}
              className="mt-4 px-4 py-2 bg-[#6366f1] text-white rounded-lg text-sm font-semibold hover:bg-[#6366f1]/80 transition-all"
            >
              Create one now
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
      className={`p-6 bg-gradient-to-br ${color} rounded-xl shadow-lg shadow-current/20`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80">{icon}</div>
      </div>
      <p className="text-white/70 text-sm font-semibold">{label}</p>
      <p className="text-3xl font-black text-white mt-2">{value}</p>
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
      whileHover={{ scale: 1.02 }}
      className="p-5 bg-[#13131f] border border-[#1e1e2f] rounded-xl hover:border-[#6366f1]/50 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-[#e2e8f0] line-clamp-2">
          {sphere.title}
        </h3>
        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded">
          UPCOMING
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
