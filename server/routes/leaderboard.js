const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ xpPoints: -1 })
      .limit(10)
      .select('fullName username avatarUrl xpPoints currentStreak _id');
    
    const leaderboard = users.map((user, index) => ({
      id: user._id,
      full_name: user.fullName,
      username: user.username,
      avatar_url: user.avatarUrl,
      xp_points: user.xpPoints,
      current_streak: user.currentStreak,
      global_rank: index + 1
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
