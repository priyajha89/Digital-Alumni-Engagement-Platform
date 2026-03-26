import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  verify: (id) => api.patch(`/users/${id}/verify`),
  delete: (id) => api.delete(`/users/${id}`),
};

export const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  rsvp: (id) => api.post(`/events/${id}/rsvp`),
};

export const jobService = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  apply: (id) => api.post(`/jobs/${id}/apply`),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const mentorshipService = {
  request: (mentorId) => api.post('/mentorship/request', { mentorId }),
  getMyRequests: () => api.get('/mentorship/requests'),
  getMyMentors: () => api.get('/mentorship/my-mentors'),
  updateStatus: (id, status) => api.patch(`/mentorship/${id}/status`, { status }),
};

export const messageService = {
  getConversation: (userId) => api.get(`/messages/${userId}`),
  send: (receiverId, content) => api.post('/messages', { receiverId, content }),
};

export const donationService = {
  donate: (amount) => api.post('/donations', { amount }),
  getMyDonations: () => api.get('/donations/my'),
  getAllDonations: () => api.get('/donations'),
};

export const analyticsService = {
  getOverview: () => api.get('/analytics'),
  getMentorMatches: () => api.get('/analytics/mentor-matches'),
  getJobRecommendations: () => api.get('/analytics/job-recommendations'),
};
