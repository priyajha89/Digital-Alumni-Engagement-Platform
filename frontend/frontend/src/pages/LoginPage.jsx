import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [role, setRole] = useState('alumni');
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', batch: '', course: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const quickLogin = async (roleEmail) => {
    setError('');
    setLoading(true);
    try {
      const user = await login(roleEmail, 'password123');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError('Quick login failed. Please try manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        await register({ ...form, role });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-secondary/20 min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm shadow-slate-900/5 transition-all">
        <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-manrope font-extrabold text-slate-900 dark:text-slate-50">The Academic Lens</Link>
            <div className="hidden md:flex gap-6 items-center">
              <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 transition-all" to="/directory">Directory</Link>
              <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 transition-all" to="/mentorship">Mentorship</Link>
              <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 transition-all" to="/events">Events</Link>
              <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 transition-all" to="/jobs">Jobs</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-1.5 gap-2">
              <span className="material-symbols-outlined text-slate-500 text-sm">search</span>
              <input className="bg-transparent border-none text-sm focus:ring-0 w-32 focus:w-48 transition-all" placeholder="Search network..." type="text"/>
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="ml-2 px-5 py-2 bg-blue-700 text-white font-manrope font-bold rounded-lg hover:scale-95 duration-200">
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row items-stretch pt-20">
        {/* Left Column: Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-20">
          <div className="absolute inset-0 opacity-40">
            <img 
              className="w-full h-full object-cover" 
              alt="Campus Architecture" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFHXP4gVhZ8IUqHxuFzD5p85fbhPNXxsTfNL-EwdHOS8zAux60KRZ4kce4xJ-TMrV0F456eEd8qChKahr6mmzIsuJPNd9ls8a6zKG4AnzjFP1YCA1xoHXeKx5ryyTxov7paWcNf-s7eA9xpmDJij2BOhqBQpn_YvbbSM-s8saCRFf60aKjnjgQCkdz9nqvFQIsWa_-MKlX8UE69ScnRnNXmjsrT9-hp1PrGrYMidWkH-7wT-qNj156zmccAVNvSjYW_I1Tpnnw_s2C" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#031632] via-[#031632]/80 to-transparent"></div>
          <div className="relative z-10 max-w-lg">
            <h1 className="font-headline text-5xl font-extrabold text-white leading-tight mb-6">
              The Distinguished <span className="text-secondary-fixed-dim">Network</span>
            </h1>
            <p className="text-on-primary-container text-lg leading-relaxed mb-8">
              Connect with thousands of alumni worldwide. Access exclusive career opportunities, mentorship programs, and academic resources curated for your professional journey.
            </p>
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                <img className="w-12 h-12 rounded-full border-2 border-primary object-cover" alt="Alumnus 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW7BdWKgvL7fl0wAI91VXCCOKgSVb5VRzjKI3645nqlKTrgBIHB6cdj0RHn9dTnTZzEW97F0jQLgakpfjL00zaJQR-dyf3CIuNH5rlbkuXVzJWkIwkGcFDmE-4fGq2n3tKArspsjMWylRXCXL23DPD3Cp8di2a4tU-UhDNl3iSQSdyML8zfaT1jECIpEZg3DDj4QpL4o0tc_7NjXEKZBLNNML3E-ZVQTu8IOWGEOANKNCi0HGps1nLgXv0VAou2yG1zTI7cHmamELm" />
                <img className="w-12 h-12 rounded-full border-2 border-primary object-cover" alt="Alumnus 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0ehfrD7ExWBHXDe4tCmUyWIkBxrulKw7SFTVlXHZkJgBNK5fUTOr7viVUCoP1hxY5C_2ckHdu2CvZmsBOWpxkcerI6Va_hgMXPjgCndruo06LKMvTIsmeJmZVz-7rQYwr3a9mEpl4IyiTsfqabhjkUUnigiimL2lvsIA56PAAXiGJL4hBeJzOsevcGRpe1b1SyoP4xT90FVrrbv0C0WVqk_qor6gsG5SM56nZu4Vt4TGhYZsWAfSjk5a1DGiVgQkqBGdTiNaydNbo" />
                <img className="w-12 h-12 rounded-full border-2 border-primary object-cover" alt="Alumnus 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkKFUTq9fxbaH9iUqA6NfETtQxADv0Yh2dUAT4Qy0cIBntRCPKhJwvg39WcSaENhwmJUrPPuNmp08RPWp0VPEufyseQlcwIVEqFzqtlWoSiWivvaevccr-Lz3xM6W0oaW6sWKJuVL2T8Qx67NXdxHMv43qdnniFF_VdVDb3hbcRhptizzRORaFpVYdMJ-iOqNWN5KtBw-xq9KSFfFr6wlbQLatHk8BAzlrUcXcYpQL9z7EqRxPwZNmxfj5awV61KaKP_VlY3Faz6Sm" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-white font-bold text-sm">Join 12,000+ members</span>
                <span className="text-on-primary-container text-xs">Growing university ecosystem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="w-full lg:w-1/2 bg-surface-bright flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold text-on-surface">Welcome back</h2>
              <p className="text-on-surface-variant font-body">Choose your entry path to the portal.</p>
            </div>

            {/* Quick Login - Testing Only */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-blue-700">
                <span className="material-symbols-outlined text-sm">test_court</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Testing Shortcuts</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => quickLogin('admin@university.edu')} className="px-2 py-2 bg-white border border-blue-200 rounded-lg text-[11px] font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all">Admin</button>
                <button onClick={() => quickLogin('alumni@university.edu')} className="px-2 py-2 bg-white border border-blue-200 rounded-lg text-[11px] font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all">Alumni</button>
                <button onClick={() => quickLogin('student@university.edu')} className="px-2 py-2 bg-white border border-blue-200 rounded-lg text-[11px] font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all">Student</button>
              </div>
            </div>
            
            {/* Role Selection */}
            <div className="space-y-4">
              <label className="font-headline text-sm font-bold tracking-tight text-on-surface block uppercase">I am a...</label>
              <div className="flex flex-wrap gap-3">
                {['alumni', 'student', 'admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-6 py-2.5 rounded-md font-headline font-semibold text-sm transition-all duration-200 ${
                      role === r 
                      ? 'bg-secondary text-white shadow-lg shadow-blue-900/10 scale-105' 
                      : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors text-xl">alternate_email</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-slate-200 rounded-lg font-body focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" 
                    id="email" 
                    name="email"
                    placeholder="name@university.edu" 
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="password">Password</label>
                  <a className="text-xs font-bold text-secondary hover:underline" href="#">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors text-xl">lock</span>
                  <input 
                    className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest border border-slate-200 rounded-lg font-body focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" 
                    id="password" 
                    name="password"
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary"
                  >
                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">{error}</div>
              )}
              {mode === 'register' && (
                <div className="space-y-4">
                  <input className="w-full px-4 py-3 bg-surface-container-lowest border border-slate-200 rounded-lg font-body focus:ring-2 focus:ring-secondary/20 outline-none" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="px-4 py-3 bg-surface-container-lowest border border-slate-200 rounded-lg font-body focus:ring-2 focus:ring-secondary/20 outline-none" name="batch" placeholder="Batch (e.g. 2020)" value={form.batch} onChange={handleChange} />
                    <input className="px-4 py-3 bg-surface-container-lowest border border-slate-200 rounded-lg font-body focus:ring-2 focus:ring-secondary/20 outline-none" name="course" placeholder="Course / Department" value={form.course} onChange={handleChange} />
                  </div>
                </div>
              )}
              <div className="pt-4 space-y-4">
                <button 
                  className="w-full py-4 bg-secondary text-white font-headline font-bold rounded-md hover:opacity-90 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/10 disabled:opacity-60" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Portal' : 'Create Account'}
                </button>
                <div className="relative py-2 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <span className="relative bg-surface-bright px-2 text-[10px] uppercase font-bold text-on-surface-variant">{mode === 'login' ? 'New to the network?' : 'Already a member?'}</span>
                </div>
                <button 
                  className="w-full py-4 bg-surface-container-low text-secondary font-headline font-bold rounded-md hover:bg-surface-container-high transition-all" 
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                >
                  {mode === 'login' ? 'Create Alumni Account' : 'Back to Sign In'}
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-2 pt-8 opacity-60">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SSO Secured • University Standard Encryption</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 w-full py-12 px-8 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-2 text-white">
            <span className="font-headline font-bold text-lg">The Academic Lens</span>
            <p className="font-body text-xs text-slate-400">© 2024 The Academic Lens. All Rights Reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['About', 'Contact', 'Terms', 'Giving'].map(link => (
              <a key={link} className="font-body text-xs text-slate-500 hover:text-white transition-all underline decoration-blue-500 underline-offset-4" href="#">{link}</a>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all pointer">
              <span className="material-symbols-outlined text-lg">public</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all pointer">
              <span className="material-symbols-outlined text-lg">groups</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
