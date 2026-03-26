import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { userService, mentorshipService } from '../services';
import { useAuth } from '../context/AuthContext';

const Directory = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('');
  const [requested, setRequested] = useState({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    const res = await userService.getAll(params);
    setUsers(res.data.filter(u => u._id !== user._id));
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers({ search: e.target.value, role: roleFilter !== 'all' ? roleFilter : undefined });
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    fetchUsers({ role: role !== 'all' ? role : undefined, search });
  };

  const handleBatchFilter = (e) => {
    setBatchFilter(e.target.value);
    fetchUsers({ batch: e.target.value || undefined, role: roleFilter !== 'all' ? roleFilter : undefined, search });
  };

  const handleConnect = async (mentorId) => {
    try {
      await mentorshipService.request(mentorId);
      setRequested(prev => ({ ...prev, [mentorId]: true }));
      showToast('✅ Connection request sent!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Request failed');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const roleColors = { alumni: 'bg-blue-100 text-blue-600', student: 'bg-green-100 text-green-600', admin: 'bg-red-100 text-red-600' };

  const batches = [...new Set(users.map(u => u.batch).filter(Boolean))].sort((a, b) => b - a);

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-white shadow-xl border-l-4 border-secondary rounded-lg px-4 py-3 text-sm font-semibold text-slate-700">
          {toast}
        </div>
      )}

      <section className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Our Network</span>
            <h2 className="text-4xl lg:text-5xl font-headline font-extrabold text-primary">Alumni & Student Directory</h2>
            <p className="text-slate-500 mt-2">{users.length} members in network</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[220px] relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 outline-none"
              placeholder="Search by name, company, role..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'alumni', 'student'].map(r => (
              <button
                key={r}
                onClick={() => handleRoleFilter(r)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${roleFilter === r ? 'bg-secondary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-secondary'}`}
              >
                {r === 'all' ? 'All Members' : r + 's'}
              </button>
            ))}
          </div>
          <div className="min-w-[140px]">
            <select
              value={batchFilter}
              onChange={handleBatchFilter}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-secondary outline-none"
            >
              <option value="">All Batches</option>
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <button
            onClick={() => { setSearch(''); setRoleFilter('all'); setBatchFilter(''); fetchUsers(); }}
            className="p-2.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all"
            title="Reset filters"
          >
            <span className="material-symbols-outlined text-slate-500">sync</span>
          </button>
        </div>
      </section>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-100 animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-xl bg-slate-200" />
                <div className="flex-1"><div className="h-4 bg-slate-200 rounded mb-2" /><div className="h-3 bg-slate-100 rounded w-2/3" /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl">
          <span className="material-symbols-outlined text-6xl text-slate-300">person_search</span>
          <p className="text-slate-400 mt-4 font-medium">No members found. Try adjusting your filters.</p>
        </div>
      )}

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map(member => (
          <div key={member._id} className="bg-white group rounded-xl p-6 transition-all duration-300 hover:shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${roleColors[member.role] || 'bg-slate-100 text-slate-500'}`}>{member.role}</span>
              {member.batch && <span className="text-[10px] text-slate-400 font-bold">Class of {member.batch}</span>}
            </div>
            <div className="flex items-start gap-4 mb-5">
              {member.profilePicture
                ? <img className="w-20 h-20 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={member.profilePicture} alt={member.name} />
                : <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-extrabold">{initials(member.name)}</div>
              }
              <div className="flex-1 pt-5">
                <h3 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors">{member.name}</h3>
                {member.position && <p className="text-sm text-slate-500">{member.position}</p>}
                {member.company && (
                  <div className="flex items-center gap-1 text-secondary text-xs font-semibold mt-1">
                    <span className="material-symbols-outlined text-sm">apartment</span>
                    {member.company}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-50">
              {member.course && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="material-symbols-outlined text-slate-400 text-lg">school</span>
                  {member.course}
                </div>
              )}
              {member.location && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                  {member.location}
                </div>
              )}
              {member.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {member.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary rounded-full font-semibold">{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-5 flex gap-3">
              {member.role === 'alumni' && user.role !== 'admin' ? (
                <button
                  onClick={() => handleConnect(member._id)}
                  disabled={requested[member._id]}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${requested[member._id] ? 'bg-green-100 text-green-700' : 'bg-secondary text-white hover:opacity-90 active:scale-95'}`}
                >
                  {requested[member._id] ? '✓ Request Sent' : 'Request Mentorship'}
                </button>
              ) : (
                <div className="flex-1 py-2.5 rounded-lg bg-slate-50 text-slate-400 text-sm font-semibold text-center">
                  {member.role === 'student' ? 'Student' : 'Admin'}
                </div>
              )}
              {member.socialLinks?.linkedin && (
                <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
                  <span className="material-symbols-outlined">link</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Directory;
