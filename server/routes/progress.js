const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Get all progress for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.userId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Sync/Upsert progress for a topic stage
router.post('/sync', authMiddleware, async (req, res) => {
  try {
    const { topicSlug, stage, completed, score } = req.body;
    
    let progress = await Progress.findOne({ userId: req.user.userId, topicSlug, stage });
    if (progress) {
      progress.stageCompleted = completed;
      if (score !== undefined) progress.score = score;
      await progress.save();
    } else {
      progress = new Progress({
        userId: req.user.userId,
        topicSlug,
        stage,
        stageCompleted: completed,
        score: score !== undefined ? score : null
      });
      await progress.save();
    }
    
    // Broadcast progress sync to trigger leaderboard and real-time updates
    if (req.io) {
      req.io.emit('leaderboard_update');
      
      // Get user details to send real-time notification
      const user = await User.findById(req.user.userId).select('fullName username');
      if (user && completed) {
        const stageName = stage.charAt(0).toUpperCase() + stage.slice(1);
        const topicName = topicSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        req.io.to('global_room').emit('realtime_activity', {
          username: user.fullName || user.username || 'A learner',
          type: 'progress',
          message: `completed ${topicName} - ${stageName}! 🎉`
        });
      }
    }
    
    res.json({ message: 'Progress synced', progress });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add XP to user
router.post('/xp', authMiddleware, async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.xpPoints += points;
    await user.save();
    
    // Broadcast XP and leaderboard update in real-time
    if (req.io) {
      req.io.emit('leaderboard_update');
      
      req.io.to('global_room').emit('realtime_activity', {
        username: user.fullName || user.username || 'A learner',
        type: 'xp',
        message: `earned +${points} XP points! ⚡`
      });
    }
    
    res.json({ message: 'XP updated', xpPoints: user.xpPoints });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
