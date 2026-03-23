const Sphere = require('../models/Sphere');
const User = require('../models/User');
const { asyncHandler } = require('../utils/errorHandler');

// @desc    Get aggregated dashboard data for the current user
// @route   GET /api/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  // Current user
  const currentUser = await User.findById(req.user._id).select(
    'name email role badge avgScore spheresCount',
  );

  // Spheres the user created or participates in
  const spheres = await Sphere.find({
    $or: [{ createdBy: req.user._id }, { participants: req.user._id }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const totalActiveSpheres = spheres.filter(
    (s) => s.status === 'Active',
  ).length;

  const allParticipantIds = new Set();
  spheres.forEach((s) => {
    (s.participants || []).forEach((p) => {
      allParticipantIds.add(String(p));
    });
  });

  const totalPlayers = allParticipantIds.size;

  const scores = spheres
    .map((s) => s.avgScore)
    .filter((n) => typeof n === 'number' && !Number.isNaN(n));
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, n) => sum + n, 0) / scores.length)
      : 0;

  const recentSpheres = spheres.slice(0, 10).map((s) => ({
    id: s._id,
    title: s.title,
    type: s.type === 'mcq' ? 'MCQ' : s.type === 'coding' ? 'Coding' : 'Hybrid',
    players: (s.participants || []).length,
    status: s.status || 'Active',
    score: typeof s.avgScore === 'number' ? s.avgScore : 0,
    createdAt: s.createdAt,
  }));

  // Students & leaderboard (all students in the system)
  const students = await User.find({ role: 'student' })
    .select('name email badge avgScore spheresCount isOnline')
    .lean();

  const studentRoster = students.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    spheres: u.spheresCount ?? 0,
    avgScore: u.avgScore ?? 0,
    badge: u.badge || 'Bronze',
    active: Boolean(u.isOnline),
  }));

  const leaderboard = [...students]
    .sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0))
    .slice(0, 10)
    .map((u, idx) => ({
      rank: idx + 1,
      name: u.name,
      score: Math.round((u.avgScore || 0) * 30),
      streak: 1 + (u.spheresCount || 0),
      badge: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐',
    }));

  // Basic analytics (placeholder, but coming from backend)
  const topics = [
    { name: 'JavaScript', score: 82, attempts: 45, color: 'bg-yellow-400' },
    { name: 'React', score: 74, attempts: 32, color: 'bg-blue-400' },
    { name: 'CSS', score: 91, attempts: 28, color: 'bg-pink-400' },
    { name: 'Node.js', score: 61, attempts: 67, color: 'bg-green-400' },
    { name: 'TypeScript', score: 78, attempts: 21, color: 'bg-purple-400' },
  ];

  const weakAreas = [
    { topic: 'Async/Await', severity: 'High', students: 18 },
    { topic: 'CSS Flexbox', severity: 'Medium', students: 11 },
    { topic: 'React Hooks', severity: 'Medium', students: 9 },
  ];

  res.json({
    user: currentUser,
    stats: {
      activeSpheres: totalActiveSpheres,
      totalPlayers,
      avgScore,
    },
    spheres: recentSpheres,
    students: studentRoster,
    leaderboard,
    analytics: {
      topics,
      weakAreas,
    },
  });
});

module.exports = { getDashboard };

