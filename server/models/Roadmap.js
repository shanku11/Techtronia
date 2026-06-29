const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: String, required: true },
  currentLevel: { type: String, required: true },
  targetTime: { type: String, required: true },
  dailyTasks: [{
    day: Number,
    title: String,
    description: String,
    completed: { type: Boolean, default: false }
  }],
  weeklyMilestones: [{
    week: Number,
    title: String,
    description: String,
    completed: { type: Boolean, default: false }
  }],
  projects: [{
    title: String,
    description: String,
    completed: { type: Boolean, default: false }
  }],
  revisionPlan: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
