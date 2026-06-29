const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');

// Get User Profile & Agentic Memory (for n8n to load context)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Also fetch detailed progress array
    const progressDocs = await Progress.find({ userId: req.params.id });
    
    res.json({
      user,
      detailedProgress: progressDocs
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update User Agentic Memory (for n8n to save context)
router.patch('/:id/memory', async (req, res) => {
  try {
    const { skills, weakTopics, mentorNotes } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (skills) user.skills = skills;
    if (weakTopics) user.weakTopics = weakTopics;
    
    // Append new mentor notes instead of overwriting
    if (mentorNotes && Array.isArray(mentorNotes)) {
      user.mentorNotes = [...user.mentorNotes, ...mentorNotes];
    } else if (mentorNotes && typeof mentorNotes === 'string') {
      user.mentorNotes.push(mentorNotes);
    }

    user.lastActive = Date.now();
    await user.save();

    res.json({ message: 'Memory updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
