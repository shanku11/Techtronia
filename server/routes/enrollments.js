const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');

// Get all user enrollments
router.get('/my-enrollments', authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.userId })
      .populate('courseId', 'name slug');
    
    // Format to match old supabase structure for React components
    const formatted = enrollments.map(e => ({
      id: e._id,
      course_id: e.courseId ? e.courseId._id : null,
      progress_percentage: e.progressPercentage,
      status: e.status,
      courses: e.courseId ? { name: e.courseId.name, slug: e.courseId.slug } : null
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Request enrollment
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    let enrollment = await Enrollment.findOne({ userId: req.user.userId, courseId });
    
    if (enrollment) {
      return res.status(400).json({ message: 'Enrollment already exists' });
    }

    enrollment = new Enrollment({
      userId: req.user.userId,
      courseId,
      status: 'pending'
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
