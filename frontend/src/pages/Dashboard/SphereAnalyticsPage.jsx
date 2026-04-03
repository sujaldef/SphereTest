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
      <div className="w-full min-h-screen global-bg flex items-center justify-center p-8">
        <div className="animate-pulse space-y-6 w-full max-w-4xl">
          <div className="h-12 bg-white border-2 border-black rounded w-48 shadow-[4px_4px_0px_rgba(0,0,0,1)]"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white border-4 border-black rounded shadow-[6px_6px_0px_rgba(0,0,0,1)]"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen global-bg flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] text-red-600 font-bold"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  if (!sphere) {
    return (
      <div className="w-full min-h-screen global-bg flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="p-12 bg-white rounded-lg border-4 border-black text-center shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <BarChart size={48} className="mx-auto text-black mb-4" />
            <p className="text-black text-lg font-bold uppercase">
              Sphere not found
            </p>
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
    },
    {
      label: 'Questions',
      value: questions.length,
      icon: FileText,
    },
    {
      label: 'Avg Score',
      value: '—',
      icon: TrendingUp,
    },
    {
      label: 'Duration',
      value: `${sphere.duration} min`,
      icon: Clock,
    },
  ];

  return (
    <div className="w-full min-h-screen global-bg p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-white border-4 border-black rounded-lg p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]"
      >
        <div>
          <h1 className="text-3xl font-black text-black mb-2 uppercase">
            {sphere.title}
          </h1>
          <p className="text-black/50 text-sm font-bold">
            GAME CODE:{' '}
            <span className="font-mono font-bold text-black">
              {sphere.gameCode}
            </span>
          </p>
        </div>
        <button
          onClick={handleExport}
          className="game-box flex items-center gap-2 px-4 py-2"
        >
          <div className="game-box-shadow bg-yellow-400"></div>
          <div className="game-box-content bg-yellow-300 border-2 border-black gap-2 flex items-center">
            <Download size={16} /> EXPORT
          </div>
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
              className="p-6 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-black text-sm font-bold uppercase">
                  {stat.label}
                </p>
                <div className="w-10 h-10 bg-yellow-200 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <Icon size={20} className="text-black" />
                </div>
              </div>
              <p className="text-3xl font-black text-black">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Participants Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-4 border-black rounded-lg overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)]"
      >
        <div className="px-6 py-4 border-b-4 border-black bg-yellow-300">
          <h2 className="text-lg font-black text-black uppercase">
            PARTICIPANTS
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-yellow-200 border-b-2 border-black">
                <th className="px-6 py-3 text-left text-black font-bold uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left text-black font-bold uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-black font-bold uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-black font-bold uppercase">
                  Join Time
                </th>
              </tr>
            </thead>
            <tbody>
              {sphere.participants?.length > 0 ? (
                sphere.participants.map((participant, i) => (
                  <tr
                    key={i}
                    className="border-b-2 border-black hover:bg-yellow-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-black font-mono font-bold">
                      {i + 1}
                    </td>
                    <td className="px-6 py-3 text-black font-bold">
                      {participant.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-3 text-black/50 text-xs font-bold">
                      {participant.email || '—'}
                    </td>
                    <td className="px-6 py-3 text-black/50 text-xs font-bold">
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
                    className="px-6 py-8 text-center text-black/50 font-bold"
                  >
                    NO PARTICIPANTS YET
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
        className="bg-white border-4 border-black rounded-lg overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)]"
      >
        <div className="px-6 py-4 border-b-4 border-black bg-yellow-300">
          <h2 className="text-lg font-black text-black uppercase">QUESTIONS</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-yellow-200 border-b-2 border-black">
                <th className="px-6 py-3 text-left text-black font-bold uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left text-black font-bold uppercase">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-black font-bold uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-black font-bold uppercase">
                  Answer
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((question, i) => (
                  <tr
                    key={i}
                    className="border-b-2 border-black hover:bg-yellow-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-black font-mono font-bold">
                      {i + 1}
                    </td>
                    <td className="px-6 py-3 text-black font-bold truncate max-w-xs">
                      {question.questionText}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-200 text-black border-2 border-black">
                        {question.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-black/50 text-xs font-mono font-bold">
                      {String(question.correctAnswer).substring(0, 30)}...
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-black/50 font-bold"
                  >
                    NO QUESTIONS ADDED YET
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
