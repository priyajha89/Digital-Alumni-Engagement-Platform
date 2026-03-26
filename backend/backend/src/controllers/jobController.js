const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { type, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    const jobs = await Job.find(filter).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Post a job
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { title, company, description, location, salary, type } = req.body;
    const job = await Job.create({ title, company, description, location, salary, type, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const alreadyApplied = job.applicants.includes(req.user._id);
    if (alreadyApplied) return res.status(400).json({ message: 'You have already applied' });
    job.applicants.push(req.user._id);
    await job.save();
    res.json({ message: 'Application submitted successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, applyJob, deleteJob };
