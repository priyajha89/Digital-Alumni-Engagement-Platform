import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { eventService, jobService, mentorshipService, userService, donationService } from '../services';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, events: 0, jobs: 0 });
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [donateAmount, setDonateAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [donateMsg, setDonateMsg] = useState('');
  const [rsvped, setRsvped] = useState({});
  const [applied, setApplied] = useState({});
  const [mentorRequestSent, setMentorRequestSent] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, eventsRes, jobsRes] = await Promise.all([
        userService.getAll(),
        eventService.getAll(),
        jobService.getAll(),
      ]);
      setStats({ users: usersRes.data.length, events: eventsRes.data.length, jobs: jobsRes.data.length });
      setEvents(eventsRes.data.slice(0, 3));
      setJobs(jobsRes.data.slice(0, 3));

      const alumniRes = await userService.getAll({ role: 'alumni' });
      setMentors(alumniRes.data.filter(u => u._id !== user._id).slice(0, 3));
    };
    fetchData();

    // Socket.io
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    socket.emit('user:join', user._id);
    socket.on('users:online', (onlineList) => setOnlineUsers(onlineList));
    socket.on('message:receive', (msg) => {
      setNotifications(prev => [{ id: Date.now(), type: 'message', text: `New message from someone`, msg }, ...prev].slice(0, 10));
    });
    return () => socket.disconnect();
  }, [user._id]);

  const handleRsvp = async (eventId) => {
    const res = await eventService.rsvp(eventId);
    const isNowRsvped = res.data.event.attendees.includes(user._id);
    setRsvped(prev => ({ ...prev, [eventId]: isNowRsvped }));
    setNotifications(prev => [{ id: Date.now(), type: 'event', text: isNowRsvped ? 'RSVP Confirmed!' : 'RSVP Cancelled' }, ...prev].slice(0, 10));
  };

  const handleApply = async (jobId) => {
    try {
      await jobService.apply(jobId);
      setApplied(prev => ({ ...prev, [jobId]: true }));
      setNotifications(prev => [{ id: Date.now(), type: 'job', text: 'Application submitted!' }, ...prev].slice(0, 10));
    } catch (e) {
      setNotifications(prev => [{ id: Date.now(), type: 'error', text: e.response?.data?.message || 'Already applied' }, ...prev].slice(0, 10));
    }
  };

  const handleRequestMentor = async (mentorId) => {
    try {
      await mentorshipService.request(mentorId);
      setMentorRequestSent(prev => ({ ...prev, [mentorId]: true }));
      setNotifications(prev => [{ id: Date.now(), type: 'mentorship', text: 'Mentorship request sent!' }, ...prev].slice(0, 10));
    } catch (e) {
      setNotifications(prev => [{ id: Date.now(), type: 'error', text: e.response?.data?.message || 'Request failed' }, ...prev].slice(0, 10));
    }
  };

  const handleDonate = async () => {
    if (!donateAmount || isNaN(donateAmount) || Number(donateAmount) <= 0) { setDonateMsg('Enter a valid amount'); return; }
    setDonating(true);
    try {
      await donationService.donate(Number(donateAmount));
      setDonateMsg(`✅ Thank you! $${donateAmount} donated.`);
      setDonateAmount('');
      setNotifications(prev => [{ id: Date.now(), type: 'donation', text: `Donated $${donateAmount} 🎉` }, ...prev].slice(0, 10));
    } catch (e) {
      setDonateMsg('Donation failed');
    } finally {
      setDonating(false);
    }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const roleColor = { admin: 'bg-red-500', alumni: 'bg-blue-600', student: 'bg-green-500' };

  return (
    <DashboardLayout>
      {/* Notification Toast Bar */}
      {notifications.length > 0 && (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-xs">
          {notifications.slice(0, 3).map(n => (
            <div key={n.id} className="bg-white shadow-xl border-l-4 border-secondary rounded-lg px-4 py-3 flex items-center gap-3 animate-pulse">
              <span className="material-symbols-outlined text-secondary text-sm">
                {n.type === 'message' ? 'chat' : n.type === 'event' ? 'event' : n.type === 'job' ? 'work' : n.type === 'donation' ? 'volunteer_activism' : n.type === 'error' ? 'warning' : 'notifications'}
              </span>
              <span className="text-xs font-semibold text-slate-700">{n.text}</span>
              <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="ml-auto text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary/80 rounded-2xl p-6 mb-8 text-white flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Welcome back</p>
          <h2 className="text-3xl font-extrabold font-headline">{user.name}</h2>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${roleColor[user.role] || 'bg-slate-500'}`}>{user.role}</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="material-symbols-outlined text-4xl opacity-30">school</span>
        </div>
      </div>

      {/* Key Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-primary-container p-6 rounded-xl text-white flex flex-col relative overflow-hidden group">
          <p className="font-bold text-xs uppercase tracking-widest mb-1 text-on-primary-container">Network Members</p>
          <h3 className="text-5xl font-extrabold">{stats.users}</h3>
          <div className="absolute right-[-10%] bottom-[-20%] opacity-10"><span className="material-symbols-outlined text-[140px]">hub</span></div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-4"><span className="material-symbols-outlined text-secondary">event</span></div>
          <p className="text-on-surface-variant text-xs uppercase font-bold tracking-widest">Upcoming Events</p>
          <h3 className="text-3xl font-extrabold text-primary mt-1">{stats.events}</h3>
          <button onClick={() => navigate('/events')} className="text-secondary text-xs font-bold mt-2 hover:underline">View all →</button>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-tertiary-fixed/30 rounded-lg flex items-center justify-center mb-4"><span className="material-symbols-outlined text-tertiary-fixed-dim">work</span></div>
          <p className="text-on-surface-variant text-xs uppercase font-bold tracking-widest">Job Listings</p>
          <h3 className="text-3xl font-extrabold text-primary mt-1">{stats.jobs}</h3>
          <button onClick={() => navigate('/jobs')} className="text-secondary text-xs font-bold mt-2 hover:underline">Browse →</button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-primary">Upcoming Events</h4>
              <button onClick={() => navigate('/events')} className="text-secondary text-sm font-bold hover:underline">View All →</button>
            </div>
            {events.length === 0 && <p className="text-slate-400 text-sm">No events yet.</p>}
            <div className="space-y-4">
              {events.map(ev => (
                <div key={ev._id} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-secondary hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-primary text-base">{ev.title}</h5>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {ev.location}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${ev.type === 'virtual' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{ev.type}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{ev.attendees?.length || 0} attending</span>
                    <button
                      onClick={() => handleRsvp(ev._id)}
                      className={`px-4 py-1.5 rounded font-bold text-xs transition-all ${rsvped[ev._id] ? 'bg-green-100 text-green-700' : 'bg-secondary text-white hover:opacity-90'}`}
                    >
                      {rsvped[ev._id] ? '✓ RSVP\'d' : 'RSVP Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-primary">Latest Opportunities</h4>
              <button onClick={() => navigate('/jobs')} className="text-secondary text-sm font-bold hover:underline">View All →</button>
            </div>
            {jobs.length === 0 && <p className="text-slate-400 text-sm">No jobs posted yet.</p>}
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-bold text-primary">{job.title}</h5>
                      <p className="text-sm text-slate-500">{job.company} · <span className="font-semibold text-secondary">{job.salary || 'Salary TBD'}</span></p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500 uppercase">{job.type}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{job.location || 'Remote'}</span>
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={applied[job._id]}
                      className={`px-4 py-1.5 rounded font-bold text-xs transition-all ${applied[job._id] ? 'bg-green-100 text-green-700 cursor-default' : 'bg-primary text-white hover:bg-secondary'}`}
                    >
                      {applied[job._id] ? '✓ Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Donation Widget */}
          <div className="bg-primary p-6 rounded-xl text-white">
            <span className="material-symbols-outlined text-amber-400 text-3xl mb-2">volunteer_activism</span>
            <h4 className="font-bold text-lg mb-2">Give Back</h4>
            <p className="text-slate-400 text-xs mb-4">Your donation empowers the next generation.</p>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Amount ($)"
                value={donateAmount}
                onChange={e => setDonateAmount(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-slate-400 text-sm focus:outline-none focus:border-secondary"
              />
              <button onClick={handleDonate} disabled={donating} className="px-4 py-2 bg-secondary rounded font-bold text-sm hover:opacity-90 disabled:opacity-50">
                {donating ? '...' : 'Donate'}
              </button>
            </div>
            {donateMsg && <p className="text-xs text-green-300 mt-1">{donateMsg}</p>}
          </div>

          {/* Online Users */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h4 className="text-sm font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online Now ({onlineUsers.length})
            </h4>
            {onlineUsers.length === 0 && <p className="text-xs text-slate-400">No one else is online</p>}
            <div className="space-y-2">
              {onlineUsers.slice(0, 5).map(uid => (
                <div key={uid} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">•</div>
                  <span className="text-xs text-slate-500 font-medium">User Online</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Mentors */}
          <div className="bg-surface-container-low p-5 rounded-xl">
            <h4 className="text-sm font-extrabold text-primary uppercase tracking-widest mb-4">Recommended Mentors</h4>
            {mentors.length === 0 && <p className="text-xs text-slate-400">No alumni mentors available</p>}
            <div className="space-y-4">
              {mentors.map(mentor => (
                <div key={mentor._id} className="flex items-center gap-3">
                  {mentor.profilePicture
                    ? <img src={mentor.profilePicture} alt={mentor.name} className="w-10 h-10 rounded-full object-cover" />
                    : <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-bold">{initials(mentor.name)}</div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-primary truncate">{mentor.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{mentor.position || 'Alumni'} {mentor.company ? `@ ${mentor.company}` : ''}</p>
                  </div>
                  <button
                    onClick={() => handleRequestMentor(mentor._id)}
                    disabled={mentorRequestSent[mentor._id]}
                    className={`text-xs font-bold px-2 py-1 rounded transition-all ${mentorRequestSent[mentor._id] ? 'text-green-600 bg-green-50' : 'text-secondary hover:text-white hover:bg-secondary'}`}
                  >
                    {mentorRequestSent[mentor._id] ? '✓ Sent' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/directory')} className="w-full mt-4 py-2 border border-slate-200 rounded text-xs font-bold text-primary hover:bg-white transition-all">
              View Full Directory
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h4 className="text-sm font-extrabold text-primary uppercase tracking-widest mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'person_search', label: 'Find Mentor', path: '/mentorship' },
                { icon: 'event', label: 'Events', path: '/events' },
                { icon: 'work', label: 'Jobs', path: '/jobs' },
                { icon: 'group', label: 'Directory', path: '/directory' },
              ].map(a => (
                <button key={a.label} onClick={() => navigate(a.path)} className="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all group">
                  <span className="material-symbols-outlined text-secondary mb-2 group-hover:scale-110 transition-transform">{a.icon}</span>
                  <span className="text-[11px] font-bold text-primary">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
