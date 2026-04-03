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
import { GameSectionHeader } from '../../components/GameUI';

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
        <GameSectionHeader title="MY SPHERES" />

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
            <Bookmark
              size={48}
              className="mx-auto text-black opacity-30 mb-4"
            />
            <p className="text-black font-bold uppercase">
              No spheres created yet
            </p>
            <p className="text-sm text-black font-bold mt-2">
              Create a sphere to get started
            </p>
            <button
              onClick={() => navigate('/dashboard/create')}
              className="mt-4 px-6 py-2 game-box game-btn-primary"
            >
              <div className="game-box-shadow" />
              <div className="game-box-content text-xs">Create Sphere</div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
      whileHover={{ y: -4 }}
      className="p-6 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-black line-clamp-2 uppercase">
            {sphere.title}
          </h3>
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs font-black rounded-lg border-2 border-black ${statusBadge.color}`}
          >
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Game Code */}
      <div className="font-mono bg-yellow-200 border-2 border-black px-3 py-2 rounded-lg text-black font-black text-sm break-all">
        {sphere.gameCode}
      </div>

      {/* Badges & Details */}
      <div className="space-y-2 text-sm font-bold">
        <div className="flex flex-wrap gap-2">
          {sphere.type && (
            <span className="px-2 py-1 bg-yellow-300 text-black rounded-lg text-xs font-black border border-black">
              {sphere.type.toUpperCase()}
            </span>
          )}
          {sphere.difficulty && (
            <span className="px-2 py-1 bg-purple-200 text-black rounded-lg text-xs font-black border border-black">
              {sphere.difficulty.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-black font-bold">
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
      <div className="flex gap-2 pt-3 border-t-2 border-black">
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => onEdit(sphere)}
          className="flex-1 game-box game-btn-secondary min-w-0"
        >
          <div className="game-box-shadow" />
          <div className="game-box-content">
            <Edit3 size={14} />
            EDIT
          </div>
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() =>
            onNavigate(`/dashboard/sphere/${sphere._id}/questions`)
          }
          className="flex-1 game-box game-btn-primary min-w-0"
        >
          <div className="game-box-shadow" />
          <div className="game-box-content">
            <Edit3 size={14} />
            MANAGE
          </div>
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() =>
            onNavigate(`/dashboard/sphere/${sphere._id}/analytics`)
          }
          className="flex-1 game-box game-btn-secondary min-w-0"
        >
          <div className="game-box-shadow" />
          <div className="game-box-content">
            <BarChart3 size={14} />
            STATS
          </div>
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => onDelete(sphere._id, sphere.title)}
          className="flex-1 game-box game-btn-danger min-w-0"
        >
          <div className="game-box-shadow" />
          <div className="game-box-content">
            <Trash2 size={14} />
            DELETE
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
