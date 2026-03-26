const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent, rsvpEvent } = require('../controllers/eventController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, restrictTo('admin'), createEvent);
router.put('/:id', protect, restrictTo('admin'), updateEvent);
router.delete('/:id', protect, restrictTo('admin'), deleteEvent);
router.post('/:id/rsvp', protect, rsvpEvent);

module.exports = router;
