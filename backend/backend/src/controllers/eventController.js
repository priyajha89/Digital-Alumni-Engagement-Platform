const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email').sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy attendees', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create event (admin only)
// @route   POST /api/events
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, imageUrl, type } = req.body;
    const event = await Event.create({ title, description, date, location, imageUrl, type, createdBy: req.user._id });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event (admin only)
// @route   PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event (admin only)
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    RSVP to event
// @route   POST /api/events/:id/rsvp
const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const alreadyRsvped = event.attendees.includes(req.user._id);
    if (alreadyRsvped) {
      event.attendees = event.attendees.filter(id => id.toString() !== req.user._id.toString());
      await event.save();
      return res.json({ message: 'RSVP cancelled', event });
    }
    event.attendees.push(req.user._id);
    await event.save();
    res.json({ message: 'RSVP confirmed', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, rsvpEvent };
