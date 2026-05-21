const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ orderIndex: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const Topic = require('../models/Topic');

// Get a course by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get topics for a course slug
router.get('/slug/:slug/topics', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const topics = await Topic.find({ courseId: course._id }).sort({ orderIndex: 1 });
    // Keep format similar for frontend mapping
    const formatted = topics.map(t => ({
      id: t._id,
      course_id: t.courseId,
      name: t.name,
      slug: t.slug,
      description: t.description,
      order_index: t.orderIndex
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
