import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Users,
  FileText,
  TrendingUp,
  Download,
  Clock,
} from 'lucide-react';
import { getSphereById } from '../../services/api';
import { getQuestionsBySphere } from '../../services/api';

export default function SphereAnalyticsPage() {
  const { id } = useParams();
  const [sphere, setSphere] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const sphereData = await getSphereById(id);
        setSphere(sphereData);

        const questionsData = await getQuestionsBySphere(id);
        setQuestions(questionsData);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleExport = () => {
    console.log('export sphere analytics:', sphere);
    alert('Export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="w-full p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-[#13131f] rounded w-48"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-[#13131f] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  if (!sphere) {
    return (
      <div className="w-full p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="p-12 bg-[#13131f] rounded-xl border border-[#1e1e2f] text-center">
            <BarChart
              size={48}
              className="mx-auto text-[#64748b] opacity-30 mb-4"
            />
            <p className="text-[#64748b] text-lg">Sphere not found</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Participants',
      value: sphere.participants?.length || 0,
      icon: Users,
      color: 'from-blue-500/20 to-blue-900/20',
    },
    {
      label: 'Questions',
      value: questions.length,
      icon: FileText,
      color: 'from-purple-500/20 to-purple-900/20',
    },
    {
      label: 'Avg Score',
      value: '—',
      icon: TrendingUp,
      color: 'from-green-500/20 to-green-900/20',
    },
    {
      label: 'Duration',
      value: `${sphere.duration} min`,
      icon: Clock,
      color: 'from-orange-500/20 to-orange-900/20',
    },
  ];

  return (
    <div className="w-full p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-[#e2e8f0] mb-2">
            {sphere.title}
          </h1>
          <p className="text-[#64748b] text-sm">
            Game Code:{' '}
            <span className="font-mono font-bold text-[#e2e8f0]">
              {sphere.gameCode}
            </span>
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] hover:bg-[#6366f1]/80 text-white font-bold rounded-lg transition-colors"
        >
          <Download size={16} /> Export Report
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 bg-gradient-to-br ${stat.color} border border-[#6366f1]/30 rounded-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#64748b] text-sm font-bold">{stat.label}</p>
                <Icon size={20} className="text-[#6366f1]" />
              </div>
              <p className="text-3xl font-black text-[#e2e8f0]">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Participants Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#13131f] border border-[#6366f1]/20 rounded-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#6366f1]/20">
          <h2 className="text-lg font-black text-[#e2e8f0]">Participants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0a0a0f] border-b border-[#6366f1]/20">
                <th className="px-6 py-3 text-left text-[#64748b] font-bold">
                  #
                </th>
                <th className="px-6 py-3 text-left text-[#64748b] font-bold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-[#64748b] font-bold">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-[#64748b] font-bold">
                  Join Time
                </th>
              </tr>
            </thead>
            <tbody>
              {sphere.participants?.length > 0 ? (
                sphere.participants.map((participant, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#6366f1]/10 hover:bg-[#0a0a0f]/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-[#e2e8f0] font-mono">
                      {i + 1}
                    </td>
                    <td className="px-6 py-3 text-[#e2e8f0] font-bold">
                      {participant.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-3 text-[#64748b] text-xs">
                      {participant.email || '—'}
                    </td>
                    <td className="px-6 py-3 text-[#64748b] text-xs">
                      {participant.createdAt
                        ? new Date(participant.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-[#64748b]"
                  >
                    No participants yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Questions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#13131f] border border-[#6366f1]/20 rounded-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#6366f1]/20">
          <h2 className="text-lg font-black text-[#e2e8f0]">Questions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0a0a0f] border-b border-[#6366f1]/20">
                <th className="px-6 py-3 text-left text-[#64748b] font-bold">
                  #
                </th>
                <th className="px-6 py-3 text-left text-[#64748b] font-bold">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-[#64748b] font-bold">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-[#64748b] font-bold">
                  Answer
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((question, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#6366f1]/10 hover:bg-[#0a0a0f]/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-[#e2e8f0] font-mono">
                      {i + 1}
                    </td>
                    <td className="px-6 py-3 text-[#e2e8f0] font-bold truncate max-w-xs">
                      {question.questionText}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-[#6366f1]/20 text-[#6366f1]">
                        {question.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[#64748b] text-xs font-mono">
                      {String(question.correctAnswer).substring(0, 30)}...
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-[#64748b]"
                  >
                    No questions added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#13131f] border border-[#6366f1]/20 rounded-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#6366f1]/20">
          <h2 className="text-lg font-black text-[#e2e8f0]">
            Live Leaderboard
          </h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-[#64748b]">Session not started yet</p>
          <p className="text-[#64748b] text-sm mt-2">
            Leaderboard will appear once the live test begins
          </p>
        </div>
      </motion.div>
    </div>
  );
}
