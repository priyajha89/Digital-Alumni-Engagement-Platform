import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { mentorshipService, userService } from '../services';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MentorshipHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]); // requests I made as mentee
  const [incomingRequests, setIncomingRequests] = useState([]); // requests I received as mentor
  const [requested, setRequested] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchAll();
  }, [user._id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [alumniRes, myMentorsRes] = await Promise.all([
        userService.getAll({ role: 'alumni' }),
        mentorshipService.getMyMentors(),
      ]);
      setMentors(alumniRes.data.filter(u => u._id !== user._id));
      setMyRequests(myMentorsRes.data);

      const sentIds = {};
      myMentorsRes.data.forEach(r => { sentIds[r.mentorId?._id || r.mentorId] = true; });
      setRequested(sentIds);

      // If alumni or admin, also get incoming requests as mentor
      if (user.role === 'alumni' || user.role === 'admin') {
        const incomingRes = await mentorshipService.getMyRequests();
        setIncomingRequests(incomingRes.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (mentorId) => {
    try {
      await mentorshipService.request(mentorId);
      setRequested(prev => ({ ...prev, [mentorId]: true }));
      await fetchAll();
      showToast('✅ Mentorship request sent!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Request failed');
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    setUpdating(prev => ({ ...prev, [requestId]: true }));
    try {
      await mentorshipService.updateStatus(requestId, status);
      setIncomingRequests(prev => prev.map(r => r._id === requestId ? { ...r, status } : r));
      showToast(`✅ Request ${status}!`);
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed');
    } finally {
      setUpdating(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const statusConfig = {
    pending: { color: 'bg-amber-100 text-amber-700', icon: 'schedule' },
    accepted: { color: 'bg-green-100 text-green-700', icon: 'check_circle' },
    rejected: { color: 'bg-red-100 text-red-600', icon: 'cancel' },
  };

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-white shadow-xl border-l-4 border-secondary rounded-lg px-4 py-3 text-sm font-semibold text-slate-700">
          {toast}
        </div>
      )}

      <header className="mb-10">
        <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">Alumni Guidance</span>
        <h1 className="text-5xl font-headline font-extrabold text-primary tracking-tight mb-2">Mentorship Hub</h1>
        <p className="text-slate-500 text-lg max-w-2xl">Connect with alumni for career guidance, mentorship, and professional growth.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Available Mentors */}
        <section className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Available Mentors ({mentors.length})</h2>
            <button onClick={() => navigate('/directory')} className="text-secondary font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm">
              Full Directory <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-slate-100">
                  <div className="flex gap-4 mb-4"><div className="w-16 h-16 rounded-full bg-slate-200" /><div className="flex-1"><div className="h-4 bg-slate-200 rounded mb-2" /><div className="h-3 bg-slate-100 rounded" /></div></div>
                </div>
              ))}
            </div>
          )}

          {!loading && mentors.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <span className="material-symbols-outlined text-6xl text-slate-300">group</span>
              <p className="text-slate-400 mt-4">No alumni mentors available.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map(mentor => {
              const req = myRequests.find(r => (r.mentorId?._id || r.mentorId) === mentor._id);
              const reqStatus = req?.status;
              return (
                <div key={mentor._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    {mentor.profilePicture
                      ? <img className="w-16 h-16 rounded-full object-cover" src={mentor.profilePicture} alt={mentor.name} />
                      : <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-extrabold">{initials(mentor.name)}</div>
                    }
                    <div>
                      <h3 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors">{mentor.name}</h3>
                      {mentor.position && <p className="text-sm text-secondary font-semibold">{mentor.position}</p>}
                      {mentor.company && <p className="text-xs text-slate-400">{mentor.company}</p>}
                    </div>
                  </div>
                  {mentor.course && <p className="text-slate-600 text-sm mb-4">📚 {mentor.course}, Class of {mentor.batch}</p>}
                  {mentor.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.skills.slice(0, 4).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  {reqStatus ? (
                    <div className={`w-full py-2.5 rounded-lg text-center text-sm font-bold ${statusConfig[reqStatus]?.color}`}>
                      <span className="material-symbols-outlined text-sm align-middle mr-1">{statusConfig[reqStatus]?.icon}</span>
                      {reqStatus.charAt(0).toUpperCase() + reqStatus.slice(1)}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRequest(mentor._id)}
                      className="w-full bg-secondary text-white py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-95"
                    >
                      Request Mentorship
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Status Board */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          {/* My Request History */}
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">My Requests</h2>
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              {myRequests.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No mentorship requests sent yet.</p>}
              {myRequests.map(req => {
                const mentor = req.mentorId;
                const cfg = statusConfig[req.status];
                return (
                  <div key={req._id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg?.color}`}>
                        <span className="material-symbols-outlined text-sm">{cfg?.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">{mentor?.name || 'Unknown'}</h4>
                        <p className="text-xs text-slate-400">{mentor?.company || 'Alumni'}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-extrabold uppercase rounded ${cfg?.color}`}>{req.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incoming Requests (for alumni/admin) */}
          {(user.role === 'alumni' || user.role === 'admin') && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Incoming Requests ({incomingRequests.length})</h2>
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                {incomingRequests.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No incoming requests.</p>}
                {incomingRequests.map(req => {
                  const mentee = req.menteeId;
                  const cfg = statusConfig[req.status];
                  return (
                    <div key={req._id} className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                          {initials(mentee?.name)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-primary">{mentee?.name || 'Student'}</h4>
                          <p className="text-xs text-slate-400">{mentee?.course || 'Student'}</p>
                        </div>
                        <span className={`ml-auto px-2 py-1 text-[10px] font-bold uppercase rounded ${cfg?.color}`}>{req.status}</span>
                      </div>
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'accepted')}
                            disabled={updating[req._id]}
                            className="flex-1 py-2 bg-green-500 text-white rounded-lg font-bold text-xs hover:opacity-90 disabled:opacity-50"
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'rejected')}
                            disabled={updating[req._id]}
                            className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg font-bold text-xs hover:bg-red-200 disabled:opacity-50"
                          >
                            ✕ Decline
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default MentorshipHub;
