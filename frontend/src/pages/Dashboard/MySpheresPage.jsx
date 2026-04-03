import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Edit3,
  BarChart3,
  Trash2,
  Users,
  Clock,
  Code,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSpheres, deleteSphere } from '../../services/api';
import {
  getSessionState,
  getStatusBadge,
} from '../../utils/sessionStateHelper';
import EditSphereModal from '../../components/EditSphereModal';

export default function MySpheresPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [spheres, setSpheres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSphere, setEditingSphere] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadSpheres();
  }, [user]);

  const loadSpheres = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSpheres();
      const mySpheres = data.filter((s) => s.createdBy._id === user?._id);
      setSpheres(mySpheres);
    } catch (err) {
      console.error('Failed to load spheres:', err);
      setError('Failed to load spheres');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(`Delete sphere "${title}"? This action cannot be undone.`)
    ) {
      return;
    }

    try {
      await deleteSphere(id);
      setSpheres((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Failed to delete sphere:', err);
      setError('Failed to delete sphere');
    }
  };

  const handleEdit = (sphere) => {
    setEditingSphere(sphere);
    setShowEditModal(true);
  };

  const handleUpdateSphere = (updatedSphere) => {
    setSpheres((prev) =>
      prev.map((s) => (s._id === updatedSphere._id ? updatedSphere : s)),
    );
  };

  const getStatusBadgeForSphere = (sphere) => {
    const state = getSessionState(sphere);
    return getStatusBadge(state);
  };

  return (
    <div className="w-full p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-black text-[#e2e8f0] mb-6">My Spheres</h1>

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
            <Bookmark
              size={48}
              className="mx-auto text-[#64748b] opacity-30 mb-4"
            />
            <p className="text-[#64748b] text-lg">No spheres created yet</p>
            <p className="text-sm text-[#64748b] mt-2">
              Create a sphere to get started
            </p>
            <button
              onClick={() => navigate('/dashboard/create')}
              className="mt-4 px-6 py-2 bg-[#6366f1] text-white rounded-lg font-semibold hover:bg-[#6366f1]/80 transition-all"
            >
              Create Sphere
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spheres.map((sphere) => (
              <SphereCard
                key={sphere._id}
                sphere={sphere}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onNavigate={navigate}
                statusBadge={getStatusBadgeForSphere(sphere)}
              />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingSphere && (
          <EditSphereModal
            sphere={editingSphere}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleUpdateSphere}
          />
        )}
      </motion.div>
    </div>
  );
}

function SphereCard({ sphere, onDelete, onEdit, onNavigate, statusBadge }) {
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
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded ${statusBadge.color}`}
          >
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Game Code */}
      <div className="font-mono bg-[#0a0a0f] px-3 py-2 rounded text-[#6366f1] font-bold text-sm break-all">
        {sphere.gameCode}
      </div>

      {/* Badges & Details */}
      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap gap-2">
          {sphere.type && (
            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs font-semibold">
              {sphere.type.toUpperCase()}
            </span>
          )}
          {sphere.difficulty && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold">
              {sphere.difficulty.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-[#64748b]">
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
              : '—'}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-3 border-t border-[#1e1e2f]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => onEdit(sphere)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-semibold hover:bg-orange-500/30 transition-all"
        >
          <Edit3 size={14} /> Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() =>
            onNavigate(`/dashboard/sphere/${sphere._id}/questions`)
          }
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#6366f1]/20 text-[#6366f1] rounded-lg text-xs font-semibold hover:bg-[#6366f1]/30 transition-all"
        >
          <Edit3 size={14} /> Manage
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() =>
            onNavigate(`/dashboard/sphere/${sphere._id}/analytics`)
          }
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-all"
        >
          <BarChart3 size={14} /> Analytics
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => onDelete(sphere._id, sphere.title)}
          className="flex items-center justify-center px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-all"
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}
