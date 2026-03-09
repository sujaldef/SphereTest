const Sphere = require('../models/Sphere');
const User = require('../models/User');
const { asyncHandler } = require('../utils/errorHandler');

// @desc    Create a new sphere
// @route   POST /api/spheres
// @access  Private
const createSphere = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    startTime,
    duration,
    maxPlayers,
    difficulty,
    security,
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const sphere = await Sphere.create({
    title,
    description,
    type: type || 'mcq',
    createdBy: req.user._id,
    participants: [req.user._id],
    startTime: startTime ? new Date(startTime) : undefined,
    duration: duration || 60,
    maxPlayers: maxPlayers || 50,
    difficulty: difficulty || 'medium',
    security: {
      faceId: security?.faceId || false,
      fullscreen: security?.fullscreen || false,
      tabSwitchDetection: security?.tabSwitchDetection || false,
    },
  });

  await sphere.populate('createdBy', 'name email');
  await sphere.populate('participants', 'name email');

  res.status(201).json(sphere);
});

// @desc    Get all spheres
// @route   GET /api/spheres
// @access  Public
const getSpheres = asyncHandler(async (req, res) => {
  const spheres = await Sphere.find()
    .populate('createdBy', 'name email')
    .populate('participants', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(spheres);
});

// @desc    Get a single sphere by ID
// @route   GET /api/spheres/:id
// @access  Public
const getSphereById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sphere = await Sphere.findById(id)
    .populate('createdBy', 'name email')
    .populate('participants', 'name email');

  if (!sphere) {
    res.status(404);
    throw new Error('Sphere not found');
  }

  res.status(200).json(sphere);
});

// @desc    Get sphere by game code
// @route   GET /api/spheres/code/:code
// @access  Public
const getSphereByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const sphere = await Sphere.findOne({ gameCode: code.toUpperCase() })
    .populate('createdBy', 'name email')
    .populate('participants', 'name email');

  if (!sphere) {
    res.status(404);
    throw new Error('Sphere not found');
  }

  res.status(200).json(sphere);
});

// @desc    Join a sphere by game code
// @route   POST /api/spheres/join
// @access  Private
const joinSphere = asyncHandler(async (req, res) => {
  const { gameCode } = req.body;

  if (!gameCode) {
    res.status(400);
    throw new Error('Game code is required');
  }

  const sphere = await Sphere.findOne({ gameCode: gameCode.toUpperCase() });

  if (!sphere) {
    res.status(404);
    throw new Error('Sphere not found');
  }

  // Check if user is already a participant
  if (sphere.participants.includes(req.user._id)) {
    res.status(400);
    throw new Error('Already joined this sphere');
  }

  // Check max players
  if (sphere.participants.length >= sphere.maxPlayers) {
    res.status(400);
    throw new Error('Sphere is full');
  }

  sphere.participants.push(req.user._id);
  await sphere.save();

  await sphere.populate('createdBy', 'name email');
  await sphere.populate('participants', 'name email');

  res.status(200).json(sphere);
});

// @desc    Delete a sphere by ID
// @route   DELETE /api/spheres/:id
// @access  Private (only creator)
const deleteSphere = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sphere = await Sphere.findById(id);

  if (!sphere) {
    res.status(404);
    throw new Error('Sphere not found');
  }

  // Check if user is the creator
  if (sphere.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this sphere');
  }

  await sphere.deleteOne();

  res.status(200).json({ message: 'Sphere deleted successfully' });
});

module.exports = {
  createSphere,
  getSpheres,
  getSphereById,
  getSphereByCode,
  joinSphere,
  deleteSphere,
};

