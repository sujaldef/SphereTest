import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { updateSphere } from '../services/api';

const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTimeForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export default function EditSphereModal({ sphere, isOpen, onClose, onUpdate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: sphere.title || '',
    description: sphere.description || '',
    maxPlayers: sphere.maxPlayers || 50,
    difficulty: sphere.difficulty || 'medium',
    startTime: sphere.startTime || '',
    endTime: sphere.endTime || '',
    security: sphere.security || {
      faceId: false,
      fullscreen: false,
      tabSwitchDetection: false,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const updated = await updateSphere(sphere._id, {
        title: formData.title,
        description: formData.description,
        maxPlayers: Number(formData.maxPlayers),
        difficulty: formData.difficulty,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        security: formData.security,
      });

      onUpdate(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update sphere');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-stone-900 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-stone-900">Edit Sphere</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-400 rounded-lg text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
              placeholder="Sphere title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
              placeholder="Sphere description"
              rows="3"
            />
          </div>

          {/* Difficulty and Max Players */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-stone-900 rounded-lg focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Max Players
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={formData.maxPlayers}
                onChange={(e) =>
                  setFormData({ ...formData, maxPlayers: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-stone-900 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Start Time */}
          <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-400">
            <p className="text-xs font-black uppercase text-stone-700 mb-3">
              Session Timing
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.startTime)}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [year, month, day] = e.target.value
                        .split('-')
                        .map(Number);
                      const localDate = new Date(year, month - 1, day);

                      const existingTime = formData.startTime
                        ? new Date(formData.startTime)
                        : null;
                      if (existingTime) {
                        localDate.setHours(
                          existingTime.getHours(),
                          existingTime.getMinutes(),
                          0,
                        );
                      } else {
                        localDate.setHours(0, 0, 0);
                      }

                      setFormData({
                        ...formData,
                        startTime: localDate.toISOString(),
                      });
                    } else {
                      setFormData({ ...formData, startTime: '' });
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg bg-white font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formatTimeForInput(formData.startTime)}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [hours, minutes] = e.target.value
                        .split(':')
                        .map(Number);
                      let localDate;

                      if (formData.startTime) {
                        localDate = new Date(formData.startTime);
                      } else {
                        localDate = new Date();
                      }

                      localDate.setHours(hours, minutes, 0, 0);
                      setFormData({
                        ...formData,
                        startTime: localDate.toISOString(),
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg bg-white font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* End Time */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.endTime)}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [year, month, day] = e.target.value
                        .split('-')
                        .map(Number);
                      const localDate = new Date(year, month - 1, day);

                      const existingTime = formData.endTime
                        ? new Date(formData.endTime)
                        : null;
                      if (existingTime) {
                        localDate.setHours(
                          existingTime.getHours(),
                          existingTime.getMinutes(),
                          0,
                        );
                      } else {
                        localDate.setHours(23, 59, 59);
                      }

                      setFormData({
                        ...formData,
                        endTime: localDate.toISOString(),
                      });
                    } else {
                      setFormData({ ...formData, endTime: '' });
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg bg-white font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={formatTimeForInput(formData.endTime)}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [hours, minutes] = e.target.value
                        .split(':')
                        .map(Number);
                      let localDate;

                      if (formData.endTime) {
                        localDate = new Date(formData.endTime);
                      } else {
                        localDate = new Date();
                      }

                      localDate.setHours(hours, minutes, 0, 0);
                      setFormData({
                        ...formData,
                        endTime: localDate.toISOString(),
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg bg-white font-mono text-sm focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[10px] text-stone-600 mt-2">
              Leave blank for immediate/on-demand session
            </p>
          </div>

          {/* Security Options */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase text-stone-700">
              Security Options
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border-2 border-stone-200 cursor-pointer hover:border-stone-900 transition-all">
                <input
                  type="checkbox"
                  checked={formData.security.faceId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      security: {
                        ...formData.security,
                        faceId: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-stone-700">
                  Face ID Verification
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border-2 border-stone-200 cursor-pointer hover:border-stone-900 transition-all">
                <input
                  type="checkbox"
                  checked={formData.security.fullscreen}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      security: {
                        ...formData.security,
                        fullscreen: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-stone-700">
                  Force Fullscreen
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border-2 border-stone-200 cursor-pointer hover:border-stone-900 transition-all">
                <input
                  type="checkbox"
                  checked={formData.security.tabSwitchDetection}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      security: {
                        ...formData.security,
                        tabSwitchDetection: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-stone-700">
                  Tab Switch Detection
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-stone-900">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border-2 border-stone-900 rounded-lg font-bold text-stone-900 hover:bg-stone-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
