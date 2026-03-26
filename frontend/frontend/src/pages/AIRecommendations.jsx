import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { analyticsService, mentorshipService, jobService } from '../services';
import { useAuth } from '../context/AuthContext';

const AIRecommendations = () => {
  const { user } = useAuth();
  const [mentorMatches, setMentorMatches] = useState([]);
  const [jobRecs, setJobRecs] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [requested, setRequested] = useState({});
  const [applied, setApplied] = useState({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    analyticsService.getMentorMatches()
      .then(res => setMentorMatches(res.data))
      .finally(() => setLoadingMentors(false));

    analyticsService.getJobRecommendations()
      .then(res => setJobRecs(res.data))
      .finally(() => setLoadingJobs(false));
  }, []);

  const handleRequest = async (mentorId) => {
    try {
      await mentorshipService.request(mentorId);
      setRequested(prev => ({ ...prev, [mentorId]: true }));
      showToast('✅ Mentorship request sent!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Already requested');
    }
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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl p-5 border border-slate-100 animate-pulse">
      <div className="flex gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="h-8 bg-slate-100 rounded-lg" />
    </div>
  );

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-white shadow-xl border-l-4 border-secondary rounded-lg px-4 py-3 text-sm font-semibold text-slate-700">
          {toast}
        </div>
      )}

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-secondary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
          </div>
          <span className="text-secondary font-bold text-xs uppercase tracking-widest">AI-Powered</span>
        </div>
        <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Smart Recommendations</h1>
        <p className="text-slate-500 mt-1 text-lg">Personalized matches based on your skills, course, and profile.</p>
      </header>

      {/* Profile Match Score */}
      <div className="bg-gradient-to-r from-primary via-primary to-secondary/80 rounded-2xl p-6 mb-10 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-extrabold">
              {initials(user.name)}
            </div>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest">Matching for</p>
              <h2 className="text-2xl font-extrabold">{user.name}</h2>
              <p className="text-white/70 text-sm">{user.course || user.role} {user.batch ? `· Class of ${user.batch}` : ''}</p>
            </div>
          </div>
          <div className="md:ml-auto grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold">{(user.skills || []).length}</p>
              <p className="text-white/60 text-xs uppercase tracking-widest">Skills on Profile</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold">{mentorMatches.length + jobRecs.length}</p>
              <p className="text-white/60 text-xs uppercase tracking-widest">Total Matches</p>
            </div>
          </div>
        </div>
        {(user.skills || []).length === 0 && (
          <div className="mt-4 bg-white/10 border border-white/20 rounded-lg px-4 py-3 flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-amber-300 text-sm">lightbulb</span>
            <span>Add skills to your profile to get better AI matches!</span>
          </div>
        )}
      </div>

      {/* AI Mentor Matches */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-600 text-sm">psychology</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">AI Mentor Matches</h2>
            <p className="text-slate-400 text-sm">Ranked by skill compatibility and professional fit</p>
          </div>
        </div>

        {loadingMentors && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loadingMentors && mentorMatches.length === 0 && (
          <div className="text-center py-14 bg-slate-50 rounded-2xl">
            <span className="material-symbols-outlined text-6xl text-slate-300">psychology</span>
            <p className="text-slate-400 mt-3 font-medium">No alumni mentors in network yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentorMatches.map(({ mentor, score, commonSkills, reason }) => (
            <div key={mentor._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              {/* Match score badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${score >= 50 ? 'bg-green-100 text-green-700' : score >= 20 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                  {score >= 50 ? 'Strong Match' : score >= 20 ? 'Good Match' : 'Community Match'}
                </div>
                <span className="text-xs font-extrabold text-primary">{Math.min(score, 99) || 10}% fit</span>
              </div>

              {/* Mentor info */}
              <div className="flex items-center gap-3 mb-4">
                {mentor.profilePicture
                  ? <img src={mentor.profilePicture} alt={mentor.name} className="w-14 h-14 rounded-full object-cover" />
                  : <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-extrabold">{initials(mentor.name)}</div>
                }
                <div className="min-w-0">
                  <h3 className="font-bold text-primary text-base truncate group-hover:text-secondary transition-colors">{mentor.name}</h3>
                  {mentor.position && <p className="text-xs text-secondary font-semibold truncate">{mentor.position}</p>}
                  {mentor.company && <p className="text-xs text-slate-400 truncate">{mentor.company}</p>}
                </div>
              </div>

              {/* Match reason */}
              <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">lightbulb</span>
                <p className="text-xs text-slate-600">{reason}</p>
              </div>

              {/* Common skills */}
              {commonSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {commonSkills.slice(0, 4).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">{s}</span>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleRequest(mentor._id)}
                disabled={requested[mentor._id]}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${requested[mentor._id] ? 'bg-green-100 text-green-700' : 'bg-secondary text-white hover:opacity-90 active:scale-95'}`}
              >
                {requested[mentor._id] ? '✓ Request Sent' : 'Request Mentorship'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AI Job Recommendations */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-600 text-sm">work</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">AI Job Recommendations</h2>
            <p className="text-slate-400 text-sm">Best opportunities ranked by your skill match</p>
          </div>
        </div>

        {loadingJobs && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loadingJobs && jobRecs.length === 0 && (
          <div className="text-center py-14 bg-slate-50 rounded-2xl">
            <span className="material-symbols-outlined text-6xl text-slate-300">work_off</span>
            <p className="text-slate-400 mt-3 font-medium">No jobs posted in the network yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobRecs.map(({ job, score, matchedSkills, reason }) => (
            <div key={job._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
              {/* Match badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${score >= 40 ? 'bg-green-100 text-green-700' : score >= 15 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  {score >= 40 ? '🔥 Top Match' : score >= 15 ? '✨ Good Match' : '📌 Explore'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">{job.type}</span>
              </div>

              {/* Job info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-2xl">business</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-primary text-base group-hover:text-secondary transition-colors">{job.title}</h3>
                  <p className="text-xs text-slate-500">{job.company}</p>
                  {job.salary && <p className="text-xs font-bold text-secondary">{job.salary}</p>}
                </div>
              </div>

              {/* Reason */}
              <div className="bg-amber-50 rounded-lg px-3 py-2 mb-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">stars</span>
                <p className="text-xs text-slate-600">{reason}</p>
              </div>

              {/* Matched skills */}
              {matchedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {matchedSkills.slice(0, 4).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">{s}</span>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {job.location || 'Remote'}
              </p>

              <div className="mt-auto">
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={applied[job._id]}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${applied[job._id] ? 'bg-green-100 text-green-700 cursor-default' : 'bg-primary text-white hover:bg-secondary active:scale-95'}`}
                >
                  {applied[job._id] ? '✓ Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AIRecommendations;
