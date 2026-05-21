const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

// Register User
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, username } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });
    
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword, fullName, username });
    await user.save();

    const payload = { userId: user.id };
    const sessionToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: { id: user.id, email: user.email, fullName: user.fullName, username: user.username }, session: { token: sessionToken } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login User
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user.id };
    const sessionToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: { id: user.id, email: user.email, fullName: user.fullName, username: user.username, xpPoints: user.xpPoints, avatarUrl: user.avatarUrl }, session: { token: sessionToken } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const authMiddleware = require('../middleware/auth');

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
