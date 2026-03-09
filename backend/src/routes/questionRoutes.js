const express = require('express');
const {
  createQuestion,
  getQuestionsBySphere,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createQuestion);
router.get('/:sphereId', getQuestionsBySphere);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;

