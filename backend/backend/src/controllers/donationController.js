const Donation = require('../models/Donation');

// @desc    Make a donation (simplified - no payment gateway)
// @route   POST /api/donations
const makeDonation = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid donation amount' });
    const donation = await Donation.create({ userId: req.user._id, amount, status: 'completed' });
    res.status(201).json({ message: 'Thank you for your donation!', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donation history for current user
// @route   GET /api/donations/my
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all donations (admin)
// @route   GET /api/donations
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('userId', 'name email').sort({ createdAt: -1 });
    const total = donations.reduce((acc, d) => acc + d.amount, 0);
    res.json({ total, donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { makeDonation, getMyDonations, getAllDonations };
