const express = require('express');
const {
  createSphere,
  getSpheres,
  getSphereById,
  deleteSphere,
} = require('../controllers/sphereController');

const router = express.Router();

router.post('/', createSphere);
router.get('/', getSpheres);
router.get('/:id', getSphereById);
router.delete('/:id', deleteSphere);

module.exports = router;

