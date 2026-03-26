const User = require('../models/User');
const Event = require('../models/Event');
const Job = require('../models/Job');
const Mentorship = require('../models/Mentorship');
const Donation = require('../models/Donation');

// @desc  Get platform-wide analytics
// @route GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAlumni,
      totalStudents,
      totalEvents,
      totalJobs,
      donationStats,
      mentorshipStats,
      recentUsers,
      userGrowth,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'alumni' }),
      User.countDocuments({ role: 'student' }),
      Event.countDocuments(),
      Job.countDocuments(),
      Donation.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Mentorship.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      // Users per month (last 6 months)
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const mentorshipMap = {};
    mentorshipStats.forEach(s => { mentorshipMap[s._id] = s.count; });

    res.json({
      overview: {
        totalUsers,
        totalAlumni,
        totalStudents,
        totalEvents,
        totalJobs,
        totalDonations: donationStats[0]?.total || 0,
        totalDonors: donationStats[0]?.count || 0,
      },
      mentorship: {
        pending: mentorshipMap['pending'] || 0,
        accepted: mentorshipMap['accepted'] || 0,
        rejected: mentorshipMap['rejected'] || 0,
      },
      recentUsers,
      userGrowth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get AI mentor matches for current user
// @route GET /api/analytics/mentor-matches
const getMentorMatches = async (req, res) => {
  try {
    const currentUser = req.user;
    const alumni = await User.find({ role: 'alumni', _id: { $ne: currentUser._id } });

    // Score each alumni vs current user
    const scored = alumni.map(mentor => {
      let score = 0;

      // Skills overlap
      const userSkills = (currentUser.skills || []).map(s => s.toLowerCase());
      const mentorSkills = (mentor.skills || []).map(s => s.toLowerCase());
      const commonSkills = userSkills.filter(s => mentorSkills.includes(s));
      score += commonSkills.length * 20;

      // Same course
      if (currentUser.course && mentor.course &&
          currentUser.course.toLowerCase() === mentor.course.toLowerCase()) {
        score += 30;
      }

      // Has a company (professional)
      if (mentor.company) score += 10;
      if (mentor.position) score += 10;

      return {
        mentor: {
          _id: mentor._id,
          name: mentor.name,
          position: mentor.position,
          company: mentor.company,
          skills: mentor.skills,
          course: mentor.course,
          batch: mentor.batch,
          profilePicture: mentor.profilePicture,
        },
        score,
        commonSkills,
        reason: commonSkills.length > 0
          ? `Shares skills: ${commonSkills.slice(0, 3).join(', ')}`
          : mentor.course === currentUser.course
            ? 'Same field of study'
            : 'Alumni network member',
      };
    });

    const top = scored.sort((a, b) => b.score - a.score).slice(0, 6);
    res.json(top);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get AI job recommendations for current user
// @route GET /api/analytics/job-recommendations
const getJobRecommendations = async (req, res) => {
  try {
    const currentUser = req.user;
    const jobs = await Job.find().populate('postedBy', 'name');

    const userSkills = (currentUser.skills || []).map(s => s.toLowerCase());
    const userCourse = (currentUser.course || '').toLowerCase();

    const scored = jobs.map(job => {
      let score = 0;
      const desc = (job.description + ' ' + job.title).toLowerCase();

      // Skills in job description
      const matchedSkills = userSkills.filter(s => desc.includes(s));
      score += matchedSkills.length * 25;

      // Course relevance
      if (userCourse && desc.includes(userCourse)) score += 20;

      // Recency bonus (newer = higher)
      const daysSincePosted = (Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24);
      if (daysSincePosted < 7) score += 15;
      else if (daysSincePosted < 30) score += 5;

      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          type: job.type,
          location: job.location,
          salary: job.salary,
          description: job.description,
          createdAt: job.createdAt,
          postedBy: job.postedBy,
        },
        score,
        matchedSkills,
        reason: matchedSkills.length > 0
          ? `Matches your skills: ${matchedSkills.slice(0, 3).join(', ')}`
          : 'Trending in your network',
      };
    });

    const top = scored.sort((a, b) => b.score - a.score).slice(0, 6);
    res.json(top);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics, getMentorMatches, getJobRecommendations };
