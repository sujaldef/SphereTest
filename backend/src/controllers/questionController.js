const Question = require('../models/Question');
const { asyncHandler } = require('../utils/errorHandler');

// @desc    Create a new question
// @route   POST /api/questions
// @access  Public (adjust as needed later)
const createQuestion = asyncHandler(async (req, res) => {
  const { sphereId, questionText, options, correctAnswer } = req.body;

  if (!sphereId || !questionText || !options || !Array.isArray(options) || options.length === 0 || !correctAnswer) {
    res.status(400);
    throw new Error(
      'sphereId, questionText, options (non-empty array), and correctAnswer are required'
    );
  }

  const question = await Question.create({
    sphereId,
    questionText,
    options,
    correctAnswer,
  });

  res.status(201).json(question);
});

// @desc    Get all questions for a sphere
// @route   GET /api/questions/:sphereId
// @access  Public
const getQuestionsBySphere = asyncHandler(async (req, res) => {
  const { sphereId } = req.params;

  const questions = await Question.find({ sphereId }).sort({ createdAt: -1 });

  res.status(200).json(questions);
});

module.exports = {
  createQuestion,
  getQuestionsBySphere,
};

