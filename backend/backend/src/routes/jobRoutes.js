const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, applyJob, deleteJob } = require('../controllers/jobController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, restrictTo('admin', 'alumni'), createJob);
router.post('/:id/apply', protect, applyJob);
router.delete('/:id', protect, restrictTo('admin'), deleteJob);

module.exports = router;
