const express = require('express');
const router = express.Router();
const { getAnalytics, getMentorMatches, getJobRecommendations } = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, restrictTo('admin'), getAnalytics);
router.get('/mentor-matches', protect, getMentorMatches);
router.get('/job-recommendations', protect, getJobRecommendations);

module.exports = router;
