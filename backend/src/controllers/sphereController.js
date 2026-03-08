const Sphere = require('../models/Sphere');
const { asyncHandler } = require('../utils/errorHandler');

// @desc    Create a new sphere
// @route   POST /api/spheres
// @access  Public (adjust as needed later)
const createSphere = asyncHandler(async (req, res) => {
  const { title, description, createdBy, participants } = req.body;

  if (!title || !createdBy) {
    res.status(400);
    throw new Error('Title and createdBy are required');
  }

  const sphere = await Sphere.create({
    title,
    description,
    createdBy,
    participants: participants || [],
  });

  res.status(201).json(sphere);
});

// @desc    Get all spheres
// @route   GET /api/spheres
// @access  Public
const getSpheres = asyncHandler(async (req, res) => {
  const spheres = await Sphere.find().sort({ createdAt: -1 });
  res.status(200).json(spheres);
});

// @desc    Get a single sphere by ID
// @route   GET /api/spheres/:id
// @access  Public
const getSphereById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sphere = await Sphere.findById(id);

  if (!sphere) {
    res.status(404);
    throw new Error('Sphere not found');
  }

  res.status(200).json(sphere);
});

// @desc    Delete a sphere by ID
// @route   DELETE /api/spheres/:id
// @access  Public (restrict later as needed)
const deleteSphere = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sphere = await Sphere.findById(id);

  if (!sphere) {
    res.status(404);
    throw new Error('Sphere not found');
  }

  await sphere.deleteOne();

  res.status(200).json({ message: 'Sphere deleted successfully' });
});

module.exports = {
  createSphere,
  getSpheres,
  getSphereById,
  deleteSphere,
};

