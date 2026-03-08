const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    sphereId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sphere',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    // Store the correct answer as the exact option string.
    // In the future you could switch this to an index if needed.
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

