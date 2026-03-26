const Mentorship = require('../models/Mentorship');

// @desc    Request a mentor
// @route   POST /api/mentorship/request
const requestMentorship = async (req, res) => {
  try {
    const { mentorId } = req.body;
    if (mentorId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot mentor yourself' });
    }
    const existing = await Mentorship.findOne({ mentorId, menteeId: req.user._id });
    if (existing) return res.status(400).json({ message: 'Request already sent' });
    const request = await Mentorship.create({ mentorId, menteeId: req.user._id });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mentorship requests (for mentor)
// @route   GET /api/mentorship/requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await Mentorship.find({ mentorId: req.user._id })
      .populate('menteeId', 'name email batch course company position profilePicture');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my mentors (as mentee)
// @route   GET /api/mentorship/my-mentors
const getMyMentors = async (req, res) => {
  try {
    const requests = await Mentorship.find({ menteeId: req.user._id })
      .populate('mentorId', 'name email batch course company position profilePicture');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or reject a mentorship request
// @route   PATCH /api/mentorship/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }
    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) return res.status(404).json({ message: 'Request not found' });
    if (mentorship.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }
    mentorship.status = status;
    await mentorship.save();
    res.json(mentorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requestMentorship, getMyRequests, getMyMentors, updateStatus };
