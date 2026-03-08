const mongoose = require('mongoose');

const sphereSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Keep createdAt from above; also enable updatedAt tracking
    timestamps: { createdAt: false, updatedAt: true },
  }
);

const Sphere = mongoose.model('Sphere', sphereSchema);

module.exports = Sphere;

