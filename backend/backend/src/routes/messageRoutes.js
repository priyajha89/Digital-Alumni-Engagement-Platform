const express = require('express');
const router = express.Router();
const { getConversation, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:userId', protect, getConversation);
router.post('/', protect, sendMessage);

module.exports = router;
