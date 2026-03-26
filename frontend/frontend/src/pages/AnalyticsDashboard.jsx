import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { analyticsService } from '../services';

// Simple bar chart component (no external library needed)
const BarChart = ({ data, label }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-32 mt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-secondary">{d.count}</span>
          <div
            className="w-full bg-secondary rounded-t-md transition-all duration-700"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: '4px' }}
          />
          <span className="text-[9px] text-slate-400 truncate w-full text-center">{d._id?.slice(5) || d._id}</span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ icon, value, label, sub, color = 'secondary', trend }) => {
  const colors = {
    secondary: 'from-secondary/20 to-secondary/5 text-secondary',
    primary: 'from-primary/20 to-primary/5 text-primary',
    green: 'from-green-500/20 to-green-500/5 text-green-500',
    red: 'from-red-500/20 to-red-500/5 text-red-500',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-500',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{label}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsService.getOverview()
      .then(res => setData(res.data))
      .catch(e => setError(e.response?.data?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-red-300">error</span>
          <p className="text-red-500 mt-4 font-medium">{error}</p>
        </div>
      </div>
    </DashboardLayout>
  );

  const { overview, mentorship, recentUsers, userGrowth } = data;
  const mentorshipTotal = mentorship.pending + mentorship.accepted + mentorship.rejected || 1;

  return (
    <DashboardLayout>
      <header className="mb-10">
        <span className="text-red-500 font-bold text-xs uppercase tracking-widest block mb-2">Admin Only</span>
        <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Analytics Dashboard</h1>
        <p className="text-slate-500 mt-1">Real-time platform insights and metrics.</p>
      </header>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard icon="group" value={overview.totalUsers} label="Total Users" sub={`${overview.totalAlumni} alumni · ${overview.totalStudents} students`} color="primary" />
        <StatCard icon="event" value={overview.totalEvents} label="Events" color="secondary" />
        <StatCard icon="work" value={overview.totalJobs} label="Active Jobs" color="amber" />
        <StatCard icon="volunteer_activism" value={`$${overview.totalDonations || 0}`} label="Total Donated" sub={`${overview.totalDonors} donors`} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-primary text-lg">User Growth</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full font-semibold">Last 6 Months</span>
          </div>
          <p className="text-slate-400 text-xs mb-2">New registrations per month</p>
          {userGrowth.length > 0
            ? <BarChart data={userGrowth} label="Users" />
            : <div className="h-32 flex items-center justify-center text-slate-300 text-sm">Not enough data yet</div>
          }
        </div>

        {/* Mentorship Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-primary text-lg mb-4">Mentorship Status</h3>
          <div className="space-y-4">
            {[
              { label: 'Accepted', count: mentorship.accepted, color: 'bg-green-500' },
              { label: 'Pending', count: mentorship.pending, color: 'bg-amber-400' },
              { label: 'Rejected', count: mentorship.rejected, color: 'bg-red-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-600">{item.label}</span>
                  <span className="font-bold text-slate-800">{item.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(item.count / mentorshipTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400 flex justify-between">
              <span>Total Requests</span>
              <span className="font-bold text-slate-700">{mentorship.pending + mentorship.accepted + mentorship.rejected}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-primary mb-4">User Breakdown</h3>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-20 h-20 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9155" fill="none" stroke="#3b82f6" strokeWidth="3"
                  strokeDasharray={`${(overview.totalAlumni / (overview.totalUsers || 1)) * 100} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-extrabold text-primary">{Math.round((overview.totalAlumni / (overview.totalUsers || 1)) * 100)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-blue-500"/><span className="text-slate-600">Alumni ({overview.totalAlumni})</span></div>
              <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-green-500"/><span className="text-slate-600">Students ({overview.totalStudents})</span></div>
            </div>
          </div>
        </div>

        {/* Events & Jobs card */}
        <div className="bg-gradient-to-br from-primary to-secondary/80 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-white/80 text-sm uppercase tracking-widest mb-4">Platform Activity</h3>
          <div className="space-y-4">
            {[
              { icon: 'event', label: 'Events Created', val: overview.totalEvents },
              { icon: 'work', label: 'Jobs Listed', val: overview.totalJobs },
              { icon: 'volunteer_activism', label: 'Donations Made', val: overview.totalDonors },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white/70 text-sm">{item.icon}</span>
                  <span className="text-sm text-white/80">{item.label}</span>
                </div>
                <span className="font-extrabold text-lg">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donation stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-primary mb-2">Donations</h3>
          <p className="text-4xl font-extrabold text-green-500 mt-2">${overview.totalDonations || 0}</p>
          <p className="text-slate-400 text-xs mt-1">Total raised from {overview.totalDonors} donors</p>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400">Avg per donor</p>
            <p className="font-bold text-slate-700 text-lg">${overview.totalDonors > 0 ? Math.round(overview.totalDonations / overview.totalDonors) : 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-primary text-lg">Recent Registrations</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {['Member', 'Role', 'Joined'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentUsers.map(u => (
              <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                      {initials(u.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-600' : u.role === 'alumni' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{u.role}</span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
