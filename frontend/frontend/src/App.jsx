import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import MentorshipHub from './pages/MentorshipHub';
import EventsNetworking from './pages/EventsNetworking';
import JobsInternships from './pages/JobsInternships';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AIRecommendations from './pages/AIRecommendations';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected - all authenticated users */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><MentorshipHub /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsNetworking /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobsInternships /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AnalyticsDashboard /></ProtectedRoute>} />

        {/* All authenticated users */}
        <Route path="/ai-recommendations" element={<ProtectedRoute><AIRecommendations /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
