import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { userService, eventService, jobService, donationService } from '../services';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon, label, value, sub, color = 'text-secondary' }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
    <div className={`w-10 h-10 rounded-lg ${color === 'text-secondary' ? 'bg-secondary/10' : color === 'text-red-500' ? 'bg-red-50' : color === 'text-green-500' ? 'bg-green-50' : 'bg-amber-50'} flex items-center justify-center mb-3`}>
      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
    </div>
    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{label}</p>
    <h3 className="text-3xl font-extrabold text-primary mt-1">{value}</h3>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [donations, setDonations] = useState({ total: 0, donations: [] });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [tab, setTab] = useState('users');
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', type: 'in-person' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, jobsRes, donationsRes] = await Promise.all([
        userService.getAll(),
        eventService.getAll(),
        jobService.getAll(),
        donationService.getAllDonations(),
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setJobs(jobsRes.data);
      setDonations(donationsRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    await userService.verify(userId);
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, verified: true } : u));
    showToast('✅ User verified!');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    await userService.delete(userId);
    setUsers(prev => prev.filter(u => u._id !== userId));
    showToast('User deleted.');
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    await eventService.delete(eventId);
    setEvents(prev => prev.filter(e => e._id !== eventId));
    showToast('Event deleted.');
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    await jobService.delete(jobId);
    setJobs(prev => prev.filter(j => j._id !== jobId));
    showToast('Job deleted.');
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await eventService.create(eventForm);
      setEvents(prev => [res.data, ...prev]);
      setEventForm({ title: '', description: '', date: '', location: '', type: 'in-person' });
      setShowEventForm(false);
      showToast('✅ Event created!');
    } catch { showToast('Failed to create event.'); }
    finally { setPosting(false); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const unverified = users.filter(u => !u.verified);
  const alumni = users.filter(u => u.role === 'alumni');
  const students = users.filter(u => u.role === 'student');

  const tabs = [
    { id: 'users', label: 'Users', icon: 'group', count: users.length },
    { id: 'events', label: 'Events', icon: 'event', count: events.length },
    { id: 'jobs', label: 'Jobs', icon: 'work', count: jobs.length },
    { id: 'donations', label: 'Donations', icon: 'volunteer_activism', count: donations.donations?.length || 0 },
  ];

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-white shadow-xl border-l-4 border-secondary rounded-lg px-4 py-3 text-sm font-semibold text-slate-700">
          {toast}
        </div>
      )}

      <header className="mb-8">
        <span className="text-red-500 font-bold text-xs uppercase tracking-widest block mb-2">Admin Panel</span>
        <h1 className="text-4xl font-headline font-extrabold text-primary">Platform Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage users, events, jobs, and donations across the platform.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="group" label="Total Users" value={users.length} sub={`${alumni.length} alumni · ${students.length} students`} />
        <StatCard icon="warning" label="Pending Verify" value={unverified.length} sub="Awaiting verification" color="text-amber-500" />
        <StatCard icon="event" label="Events" value={events.length} />
        <StatCard icon="volunteer_activism" label="Total Donated" value={`$${donations.total || 0}`} sub={`${donations.donations?.length || 0} donors`} color="text-green-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${tab === t.id ? 'bg-secondary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-secondary'}`}
          >
            <span className="material-symbols-outlined text-sm">{t.icon}</span>
            {t.label}
            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${tab === t.id ? 'bg-white/20' : 'bg-slate-100'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {loading && <p className="text-slate-400 text-center py-10">Loading data...</p>}

      {/* Users Tab */}
      {!loading && tab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {unverified.length > 0 && (
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-sm">warning</span>
              <p className="text-amber-700 text-sm font-semibold">{unverified.length} user{unverified.length !== 1 ? 's' : ''} awaiting verification</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{['Member', 'Role', 'Batch / Course', 'Company', 'Verified', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.profilePicture
                          ? <img src={u.profilePicture} className="w-9 h-9 rounded-full object-cover" alt={u.name} />
                          : <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">{initials(u.name)}</div>
                        }
                        <div>
                          <p className="font-semibold text-primary text-sm">{u.name}</p>
                          <p className="text-slate-400 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-600' : u.role === 'alumni' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{u.batch || '—'} {u.course ? `· ${u.course}` : ''}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{u.company || '—'}</td>
                    <td className="px-6 py-4">
                      {u.verified
                        ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><span className="material-symbols-outlined text-sm">verified</span> Verified</span>
                        : <span className="text-amber-600 text-xs font-bold">Pending</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!u.verified && (
                          <button onClick={() => handleVerify(u._id)} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold text-xs hover:bg-green-200 transition-all">
                            Verify
                          </button>
                        )}
                        {u._id !== user._id && (
                          <button onClick={() => handleDeleteUser(u._id)} className="p-1 text-red-400 hover:text-red-600 transition-colors">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {!loading && tab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-500 text-sm">{events.length} events loaded</p>
            <button
              onClick={() => setShowEventForm(v => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-bold text-sm hover:opacity-90"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {showEventForm ? 'Cancel' : 'Create Event'}
            </button>
          </div>
          {showEventForm && (
            <form onSubmit={handleCreateEvent} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Event Title*" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
              <input required placeholder="Location*" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
              <input required type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
              <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-secondary/20">
                <option value="in-person">In-person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <div className="md:col-span-2">
                <textarea required placeholder="Description*" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} rows={3} className="px-4 py-3 border border-slate-200 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-secondary/20 resize-none" />
              </div>
              <div className="md:col-span-2"><button type="submit" disabled={posting} className="px-6 py-2.5 bg-secondary text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50">{posting ? 'Creating...' : 'Create Event'}</button></div>
            </form>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{['Event', 'Date', 'Type', 'Location', 'Attendees', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map(ev => (
                  <tr key={ev._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-primary text-sm">{ev.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(ev.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${ev.type === 'virtual' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-700'}`}>{ev.type}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{ev.location}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{ev.attendees?.length || 0}</td>
                    <td className="px-6 py-4"><button onClick={() => handleDeleteEvent(ev._id)} className="p-1 text-red-400 hover:text-red-600"><span className="material-symbols-outlined text-base">delete</span></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {!loading && tab === 'jobs' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{['Position', 'Company', 'Type', 'Location', 'Salary', 'Applicants', 'Posted By', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobs.map(j => (
                <tr key={j._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-primary text-sm">{j.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{j.company}</td>
                  <td className="px-6 py-4"><span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full capitalize">{j.type}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{j.location || 'Remote'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-secondary">{j.salary || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{j.applicants?.length || 0}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{j.postedBy?.name || 'Admin'}</td>
                  <td className="px-6 py-4"><button onClick={() => handleDeleteJob(j._id)} className="p-1 text-red-400 hover:text-red-600"><span className="material-symbols-outlined text-base">delete</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Donations Tab */}
      {!loading && tab === 'donations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary to-secondary/80 rounded-xl p-6 text-white">
              <p className="text-sm opacity-70 uppercase font-bold tracking-widest mb-1">Total Raised</p>
              <h3 className="text-4xl font-extrabold">${donations.total || 0}</h3>
              <p className="text-sm opacity-60 mt-2">From {donations.donations?.length || 0} donations</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-2">Most Recent</p>
              {donations.donations?.slice(0, 3).map(d => (
                <div key={d._id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-primary font-medium">{d.userId?.name || 'Anonymous'}</span>
                  <span className="text-secondary font-bold">${d.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{['Donor', 'Email', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(donations.donations || []).map(d => (
                  <tr key={d._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-primary text-sm">{d.userId?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{d.userId?.email || '—'}</td>
                    <td className="px-6 py-4 font-bold text-secondary">${d.amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full capitalize">{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
