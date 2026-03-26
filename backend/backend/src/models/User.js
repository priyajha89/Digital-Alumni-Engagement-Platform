const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'alumni', 'student'], 
    default: 'student' 
  },
  verified: { type: Boolean, default: false },
  batch: { type: String },
  course: { type: String },
  company: { type: String },
  position: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    portfolio: String
  },
  profilePicture: { type: String }, // Optional URL/Link
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
