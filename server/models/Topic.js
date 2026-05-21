const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  orderIndex: { type: Number, default: 0 }
});

module.exports = mongoose.model('Topic', TopicSchema);
