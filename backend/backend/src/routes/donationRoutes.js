const express = require('express');
const router = express.Router();
const { makeDonation, getMyDonations, getAllDonations } = require('../controllers/donationController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', protect, makeDonation);
router.get('/my', protect, getMyDonations);
router.get('/', protect, restrictTo('admin'), getAllDonations);

module.exports = router;
