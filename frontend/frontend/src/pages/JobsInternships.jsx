import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { jobService } from '../services';
import { useAuth } from '../context/AuthContext';

const JobsInternships = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', description: '', location: '', salary: '', type: 'full-time' });
  const [posting, setPosting] = useState(false);

  const canPost = user.role === 'alumni' || user.role === 'admin';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await jobService.getAll();
    setJobs(res.data);
    setLoading(false);
  };

  const handleApply = async (jobId) => {
    try {
      await jobService.apply(jobId);
      setApplied(prev => ({ ...prev, [jobId]: true }));
      showToast('✅ Application submitted!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Already applied');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) { showToast('Fill required fields'); return; }
    setPosting(true);
    try {
      const res = await jobService.create(form);
      setJobs(prev => [res.data, ...prev]);
      setForm({ title: '', company: '', description: '', location: '', salary: '', type: 'full-time' });
      setShowPostForm(false);
      showToast('✅ Job posted successfully!');
    } catch { showToast('Failed to post job'); }
    finally { setPosting(false); }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    await jobService.delete(jobId);
    setJobs(prev => prev.filter(j => j._id !== jobId));
    showToast('Job removed.');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = jobs.filter(j => {
    const matchFilter = filter === 'all' || j.type === filter;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-white shadow-xl border-l-4 border-secondary rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 animate-bounce">
          {toast}
        </div>
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">Career Network</span>
          <h1 className="text-4xl font-headline font-extrabold text-primary">Jobs & Internships</h1>
          <p className="text-slate-500 mt-2">Opportunities from our global alumni network.</p>
        </div>
        {canPost && (
          <button
            onClick={() => setShowPostForm(v => !v)}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-lg font-bold hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            {showPostForm ? 'Cancel' : 'Post a Job'}
          </button>
        )}
      </header>

      {/* Post Job Form */}
      {showPostForm && (
        <form onSubmit={handlePost} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-primary mb-4">Post a New Opportunity</h3>
          </div>
          <input required placeholder="Job Title*" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-secondary/20 outline-none text-sm" />
          <input required placeholder="Company*" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-secondary/20 outline-none text-sm" />
          <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-secondary/20 outline-none text-sm" />
          <input placeholder="Salary / Stipend" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-secondary/20 outline-none text-sm" />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-secondary/20 outline-none">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
          <div className="md:col-span-2">
            <textarea required placeholder="Job Description*" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="px-4 py-3 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-secondary/20 outline-none text-sm resize-none" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={posting} className="px-8 py-3 bg-secondary text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50">
              {posting ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter */}
      <div className="bg-slate-50 rounded-xl p-4 mb-8 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[220px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-white rounded-lg shadow-sm text-sm outline-none focus:ring-2 focus:ring-secondary/20"
            placeholder="Search by role, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'full-time', 'internship', 'remote', 'part-time'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-secondary text-white' : 'bg-white text-slate-600 hover:text-secondary border border-slate-200'}`}
            >
              {f === 'all' ? 'All Roles' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading && <p className="text-slate-400 text-center py-12">Loading opportunities...</p>}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl">
          <span className="material-symbols-outlined text-6xl text-slate-300">work_off</span>
          <p className="text-slate-400 mt-4 font-medium">No opportunities found.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(job => (
          <div key={job._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-3xl">business</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${job.type === 'internship' ? 'bg-orange-100 text-orange-600' : job.type === 'remote' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{job.type}</span>
                {(user.role === 'admin' || job.postedBy?._id === user._id) && (
                  <button onClick={() => handleDelete(job._id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors">{job.title}</h3>
            <p className="text-sm text-slate-500 font-medium mb-1">{job.company}</p>
            {job.salary && <p className="text-sm font-bold text-secondary mb-3">{job.salary}</p>}
            <p className="text-sm text-slate-600 line-clamp-3 flex-1">{job.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {job.location || 'Remote'}
              </span>
              {user.role === 'student' || user.role === 'alumni' ? (
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={applied[job._id]}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${applied[job._id] ? 'bg-green-100 text-green-700 cursor-default' : 'bg-secondary text-white hover:opacity-90'}`}
                >
                  {applied[job._id] ? '✓ Applied' : 'Apply Now'}
                </button>
              ) : (
                <span className="text-xs text-slate-400">{job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            <p className="text-[10px] text-slate-300 mt-2">
              Posted {new Date(job.createdAt).toLocaleDateString()} by {job.postedBy?.name || 'Admin'}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default JobsInternships;
