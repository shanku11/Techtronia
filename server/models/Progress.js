const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicSlug: { type: String, required: true },
  stage: { type: String, required: true }, // e.g. animation, explanation, practice, test, realworld
  stageCompleted: { type: Boolean, default: false },
  score: { type: Number, default: null }
}, {
  timestamps: true
});

ProgressSchema.index({ userId: 1, topicSlug: 1, stage: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
