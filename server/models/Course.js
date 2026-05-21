const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  isPublic: { type: Boolean, default: true },
  orderIndex: { type: Number, default: 0 }
});

module.exports = mongoose.model('Course', CourseSchema);
