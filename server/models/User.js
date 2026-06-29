const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, sparse: true, unique: true },
  fullName: { type: String },
  username: { type: String },
  xpPoints: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  avatarUrl: { type: String },
  roles: [{ type: String, enum: ['user', 'admin', 'trainer'], default: 'user' }],
  skills: [{ type: String }],
  progress: { type: Map, of: Number, default: {} },
  weakTopics: [{ type: String }],
  mentorNotes: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
