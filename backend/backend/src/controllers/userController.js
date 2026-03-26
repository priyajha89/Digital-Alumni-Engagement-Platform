const User = require('../models/User');

// @desc    Get all alumni/students (with filters)
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const { role, batch, course, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (batch) filter.batch = batch;
    if (course) filter.course = course;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(filter).select('-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single user profile by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, batch, course, company, position, location, skills, socialLinks, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, batch, course, company, position, location, skills, socialLinks, profilePicture },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin verifies a user
// @route   PATCH /api/users/:id/verify
const verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { verified: true }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User verified', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateProfile, deleteUser, verifyUser };
