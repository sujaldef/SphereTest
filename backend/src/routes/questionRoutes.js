const express = require('express');
const {
  createQuestion,
  getQuestionsBySphere,
} = require('../controllers/questionController');

const router = express.Router();

router.post('/', createQuestion);
router.get('/:sphereId', getQuestionsBySphere);

module.exports = router;

