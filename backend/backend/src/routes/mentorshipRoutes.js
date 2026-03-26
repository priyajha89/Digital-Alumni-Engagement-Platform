const express = require('express');
const router = express.Router();
const { requestMentorship, getMyRequests, getMyMentors, updateStatus } = require('../controllers/mentorshipController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/request', protect, requestMentorship);
router.get('/requests', protect, getMyRequests);
router.get('/my-mentors', protect, getMyMentors);
router.patch('/:id/status', protect, updateStatus);

module.exports = router;
