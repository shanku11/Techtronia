const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://techtronia.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true
  }
});

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disabled for APIs to prevent interfering with Dev environments
}));
app.use(mongoSanitize());

app.use(cors({
  origin: [
    "https://techtronia.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());

// Expose Socket.io instance on request object for routers to access
app.use((req, res, next) => {
  req.io = io;
  next();
});

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const coursesRoutes = require('./routes/courses');
const leaderboardRoutes = require('./routes/leaderboard');
const enrollmentsRoutes = require('./routes/enrollments');
const usersRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB connection configuration (Secure, resilient options)
const dbOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

const primaryURI = process.env.MONGODB_URI;
const localFallbackURI = 'mongodb://127.0.0.1:27017/techtronia';

if (primaryURI) {
  mongoose.connect(primaryURI, dbOptions)
    .then(() => console.log('✅ MongoDB connected securely to primary Atlas database'))
    .catch(err => {
      console.warn('⚠️ MongoDB Atlas primary connection failed:', err.message);
      console.log('🔄 Seamlesly falling back to secure local MongoDB connection...');
      
      mongoose.connect(localFallbackURI, dbOptions)
        .then(() => console.log('✅ MongoDB connected securely to local fallback database'))
        .catch(fallbackErr => {
          console.error('❌ Local MongoDB fallback failed as well:', fallbackErr.message);
          if (process.env.NODE_ENV === 'production') {
            process.exit(1);
          }
        });
    });
} else {
  mongoose.connect(localFallbackURI, dbOptions)
    .then(() => console.log('✅ MongoDB connected securely to local database'))
    .catch(err => {
      console.error('❌ Local MongoDB connection error:', err.message);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
}

// Socket.io for Realtime Syncs
io.on('connection', (socket) => {
  console.log(`🔌 Client connected for real-time updates: ${socket.id}`);
  
  socket.on('join_global', () => {
    socket.join('global_room');
    console.log(`👤 Client joined real-time sync (global_room): ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
