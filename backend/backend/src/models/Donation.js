const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String }, // Optional, for future integration
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'completed' 
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
