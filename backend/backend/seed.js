const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('./src/models/User');
const Event = require('./src/models/Event');
const Job = require('./src/models/Job');
const Mentorship = require('./src/models/Mentorship');
const Message = require('./src/models/Message');
const Donation = require('./src/models/Donation');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Event.deleteMany(),
      Job.deleteMany(),
      Mentorship.deleteMany(),
      Message.deleteMany(),
      Donation.deleteMany()
    ]);
    console.log('🗑️  Cleared existing data');

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@university.edu', passwordHash, role: 'admin', verified: true },
      { name: 'John Alumnus', email: 'alumni@university.edu', passwordHash, role: 'alumni', verified: true, company: 'Google', position: 'Software Engineer', batch: '2015', course: 'Computer Science' },
      { name: 'Jane Alumnus', email: 'jane@university.edu', passwordHash, role: 'alumni', verified: true, company: 'Meta', position: 'Product Manager', batch: '2018', course: 'MBA' },
      { name: 'Sam Student', email: 'student@university.edu', passwordHash, role: 'student', verified: true, batch: '2025', course: 'Data Science' }
    ]);
    const [admin, alumni1, alumni2, student] = users;

    // 2. Create Events
    const events = await Event.insertMany([
      { 
        title: 'Global Alumni Meet 2026', 
        description: 'Annual homecoming event for all graduates.', 
        date: new Date('2026-06-15'), 
        location: 'Main Campus Auditorium', 
        type: 'in-person',
        createdBy: admin._id,
        attendees: [alumni1._id, alumni2._id]
      },
      { 
        title: 'Tech Career Webinar', 
        description: 'Learning how to break into Big Tech.', 
        date: new Date('2026-04-20'), 
        location: 'Zoom', 
        type: 'virtual',
        createdBy: admin._id,
        attendees: [student._id, alumni1._id]
      }
    ]);

    // 3. Create Jobs
    const jobs = await Job.insertMany([
      { 
        title: 'Senior Frontend Developer', 
        company: 'Google', 
        description: 'Looking for experts in React and Node.js.', 
        location: 'Mountain View, CA', 
        salary: '$150k - $200k',
        type: 'full-time',
        postedBy: alumni1._id 
      },
      { 
        title: 'Product Management Intern', 
        company: 'Meta', 
        description: 'Summer internship for MBA students.', 
        location: 'Remote', 
        salary: '$8k/month',
        type: 'internship',
        postedBy: alumni2._id 
      }
    ]);

    // 4. Create Mentorship
    const mentorship = await Mentorship.create({
      mentorId: alumni1._id,
      menteeId: student._id,
      status: 'accepted'
    });

    // 5. Create Messages
    await Message.insertMany([
      { senderId: student._id, receiverId: alumni1._id, content: 'Hi John, I saw your profile and would love to connect!' },
      { senderId: alumni1._id, receiverId: student._id, content: 'Sure Sam, happy to help. Let us schedule a call.' }
    ]);

    // 6. Create Donations
    await Donation.insertMany([
      { userId: alumni1._id, amount: 500, status: 'completed' },
      { userId: alumni2._id, amount: 1000, status: 'completed' }
    ]);

    console.log('✨ Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
