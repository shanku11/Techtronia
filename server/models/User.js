const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  username: { type: String },
  xpPoints: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  avatarUrl: { type: String },
  roles: [{ type: String, enum: ['user', 'admin', 'trainer'], default: 'user' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
