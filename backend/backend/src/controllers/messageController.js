const Message = require('../models/Message');

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message (REST fallback, primary via Socket.io)
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await Message.create({ senderId: req.user._id, receiverId, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversation, sendMessage };
