import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import { getSpheres } from '../../services/api';
import { GameSectionHeader } from '../../components/GameUI';

// Mock leaderboard data for demonstration
const mockLeaderboards = {
  all: [
    {
      rank: 1,
      name: 'AlexCoder',
      sphere: 'JS Fundamentals',
      score: 950,
      date: '2024-01-15',
    },
    {
      rank: 2,
      name: 'WebMaster92',
      sphere: 'React Advanced',
      score: 920,
      date: '2024-01-14',
    },
    {
      rank: 3,
      name: 'DataNinja',
      sphere: 'Algorithms 101',
      score: 890,
      date: '2024-01-13',
    },
    {
      rank: 4,
      name: 'FullStackDev',
      sphere: 'Full Stack Mastery',
      score: 850,
      date: '2024-01-12',
    },
    {
      rank: 5,
      name: 'CodeBreaker',
      sphere: 'Debugging Lab',
      score: 820,
      date: '2024-01-11',
    },
  ],
};

export default function LeaderboardPage() {
  const [spheres, setSpheres] = useState([]);
  const [selectedSphere, setSelectedSphere] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboards.all);

  useEffect(() => {
    const fetchSpheres = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getSpheres();
        setSpheres(data);
        setSelectedSphere('all');
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load spheres');
      } finally {
        setLoading(false);
      }
    };

    fetchSpheres();
  }, []);

  const handleSphereChange = (sphereId) => {
    setSelectedSphere(sphereId);
    // Filter leaderboard data by sphere when implemented
    setLeaderboardData(mockLeaderboards.all);
  };

  if (loading && spheres.length === 0) {
    return (
      <div className="w-full p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-white border-4 border-black rounded w-48"></div>
          <div className="h-10 bg-white border-4 border-black rounded w-64"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-white border-4 border-black rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block bg-yellow-300 border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={32} className="text-black" />
          <h1 className="text-3xl font-black text-black uppercase tracking-widest">
            Global Leaderboard
          </h1>
        </div>
        <p className="text-black font-bold">
          Top performers across all spheres
        </p>
      </motion.div>

      {/* Filter Dropdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <label className="text-black font-black uppercase text-sm">
          Filter by Sphere:
        </label>
        <select
          value={selectedSphere}
          onChange={(e) => handleSphereChange(e.target.value)}
          className="px-4 py-2 bg-white border-2 border-black rounded-lg text-black font-bold focus:outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          <option value="all">All Spheres</option>
          {spheres.map((sphere) => (
            <option key={sphere._id} value={sphere._id}>
              {sphere.title}
            </option>
          ))}
        </select>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-200 border-4 border-red-500 rounded-lg font-bold text-red-900"
        >
          {error}
        </motion.div>
      )}

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-4 border-black rounded-lg overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)]"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-yellow-300 border-b-4 border-black">
                <th className="px-6 py-4 text-left text-black font-black text-sm uppercase">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-black font-black text-sm uppercase">
                  Player
                </th>
                <th className="px-6 py-4 text-left text-black font-black text-sm uppercase">
                  Sphere
                </th>
                <th className="px-6 py-4 text-left text-black font-black text-sm uppercase">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-black font-black text-sm uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.length > 0 ? (
                leaderboardData.map((entry, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b-2 border-black hover:bg-yellow-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-black font-black">
                      <div className="flex items-center gap-2">
                        {entry.rank <= 3 && (
                          <span className="text-lg">
                            {entry.rank === 1
                              ? '🥇'
                              : entry.rank === 2
                                ? '🥈'
                                : '🥉'}
                          </span>
                        )}
                        <span className="text-sm">{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-300 border-2 border-black rounded-full flex items-center justify-center text-black font-black text-sm">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-black font-black">
                          {entry.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black text-sm font-bold">
                      {entry.sphere}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-black font-black">
                        <Zap size={16} />
                        {entry.score}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black text-sm font-bold">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-black font-bold"
                  >
                    No leaderboard data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-yellow-100 border-4 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)]"
      >
        <p className="text-black font-bold uppercase">
          💡 Live data available after sessions run. Current data shows mock
          leaderboard for demonstration.
        </p>
      </motion.div>
    </div>
  );
}
