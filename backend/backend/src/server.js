const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected to Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/mentorship', require('./routes/mentorshipRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Alumni Network API is running ✅', version: '1.0.0' });
});

// --- Real-time Socket.io Messaging ---
const Message = require('./models/Message');
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  // Register user as online
  socket.on('user:join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    io.emit('users:online', Array.from(onlineUsers.keys()));
    console.log(`User ${userId} is online`);
  });

  // Send a direct message
  socket.on('message:send', async ({ receiverId, content }) => {
    try {
      const message = await Message.create({
        senderId: socket.userId,
        receiverId,
        content,
      });

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('message:receive', message);
      }
      // Also confirm to sender
      socket.emit('message:sent', message);
    } catch (err) {
      socket.emit('message:error', { error: err.message });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    }
    console.log('🔌 Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
