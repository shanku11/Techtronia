const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const coursesRoutes = require('./routes/courses');
const leaderboardRoutes = require('./routes/leaderboard');
const enrollmentsRoutes = require('./routes/enrollments');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/technotronia')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io for Realtime
io.on('connection', (socket) => {
  console.log('Client connected for real-time updates');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
