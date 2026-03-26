const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateProfile, deleteUser, verifyUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateProfile);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);
router.patch('/:id/verify', protect, restrictTo('admin'), verifyUser);

module.exports = router;
