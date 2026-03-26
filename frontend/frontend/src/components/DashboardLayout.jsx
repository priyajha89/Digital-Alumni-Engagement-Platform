import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const roleColor = { admin: 'text-red-500 bg-red-50', alumni: 'text-blue-500 bg-blue-50', student: 'text-green-600 bg-green-50' };

  const navItems = [
    { icon: 'dashboard', label: 'Overview', path: '/dashboard' },
    { icon: 'group', label: 'Directory', path: '/directory' },
    { icon: 'psychology', label: 'Mentorship', path: '/mentorship' },
    { icon: 'event', label: 'Events', path: '/events' },
    { icon: 'work', label: 'Jobs', path: '/jobs' },
    { icon: 'auto_awesome', label: 'AI Matches', path: '/ai-recommendations' },
    ...(user?.role === 'admin' ? [
      { icon: 'admin_panel_settings', label: 'Admin Panel', path: '/admin' },
      { icon: 'analytics', label: 'Analytics', path: '/analytics' },
    ] : []),
  ];

  return (
    <div className="flex min-h-screen bg-surface-bright">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col p-6 space-y-2 h-screen w-64 bg-slate-50 dark:bg-slate-950 fixed left-0 top-0 z-40">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white font-headline">Alumni Portal</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Distinguished Network</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-manrope text-sm font-semibold transition-all duration-200 hover:translate-x-1 ${
                window.location.pathname === item.path
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile + Logout at bottom of sidebar */}
        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white transition-all cursor-pointer" onClick={() => setShowUserMenu(v => !v)}>
            {user?.profilePicture
              ? <img src={user.profilePicture} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
              : <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-extrabold shrink-0">{initials(user?.name)}</div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{user?.name}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColor[user?.role]}`}>{user?.role}</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-sm">{showUserMenu ? 'expand_less' : 'expand_more'}</span>
          </div>

          {showUserMenu && (
            <div className="mt-1 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 transition-all"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top Header */}
        <header className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white/70 backdrop-blur-sm sticky top-0 z-30">
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-primary tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h2>
            <p className="text-on-surface-variant text-sm font-medium mt-0.5">
              {user?.course ? `${user.course}` : user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              {user?.batch ? ` · Class of ${user.batch}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Role badge */}
            <span className={`hidden sm:block text-xs font-bold px-3 py-1 rounded-full ${roleColor[user?.role]}`}>
              {user?.role}
            </span>
            {/* Avatar / Logout button */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-slate-200"
              >
                {user?.profilePicture
                  ? <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  : <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-extrabold">{initials(user?.name)}</div>
                }
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                <span className="material-symbols-outlined text-slate-400 text-sm">arrow_drop_down</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="font-bold text-sm text-primary">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
