const express = require('express');
const {
  createSphere,
  getSpheres,
  getSphereById,
  getSphereByCode,
  joinSphere,
  deleteSphere,
} = require('../controllers/sphereController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createSphere);
router.get('/', getSpheres);
router.get('/code/:code', getSphereByCode);
router.get('/:id', getSphereById);
router.post('/join', protect, joinSphere);
router.delete('/:id', protect, deleteSphere);

module.exports = router;

