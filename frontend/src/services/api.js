import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data) => api.post('auth/register', data),
  login: (data) => api.post('auth/login', data),
  getMe: () => api.get('auth/me'),
  updateProfile: (data) => api.put('auth/profile', data),
  forgotPassword: (email) => api.post('auth/forgot-password', { email }),
  resetPassword: (data) => api.post('auth/reset-password', data),
};

// Job API
export const jobAPI = {
  getAllJobs: (params) => api.get('jobs', { params }),
  getJobById: (id) => api.get(`jobs/${id}`),
  createJob: (data) => api.post('jobs', data),
  getMyJobs: (params) => api.get('jobs/recruiter/my-jobs', { params }),
  updateJob: (id, data) => api.put(`jobs/${id}`, data),
  deleteJob: (id) => api.delete(`jobs/${id}`),
  getJobStats: () => api.get('jobs/recruiter/stats'),
};

// Application API
export const applicationAPI = {
  applyForJob: (data) => api.post('applications', data),
  getMyApplications: (params) => api.get('applications/my-applications', { params }),
  getJobApplications: (jobId, params) => api.get(`applications/job/${jobId}`, { params }),
  getApplicationById: (id) => api.get(`applications/${id}`),
  updateApplicationStatus: (id, data) => api.put(`applications/${id}/status`, data),
  addNote: (id, data) => api.post(`applications/${id}/notes`, data),
  withdrawApplication: (id) => api.delete(`applications/${id}`),
  getApplicationStats: () => api.get('applications/stats'),
};

// Interview API
export const interviewAPI = {
  scheduleInterview: (data) => api.post('interviews', data),
  getMyInterviews: (params) => api.get('interviews/my-interviews', { params }),
  getRecruiterInterviews: (params) => api.get('interviews/recruiter-interviews', { params }),
  getInterviewById: (id) => api.get(`interviews/${id}`),
  updateInterview: (id, data) => api.put(`interviews/${id}`, data),
  addInterviewFeedback: (id, data) => api.post(`interviews/${id}/feedback`, data),
  cancelInterview: (id) => api.delete(`interviews/${id}`),
};

// Resume API (AI features - to be integrated later)
export const resumeAPI = {
  generateSuggestions: (data) => api.post('resume/suggestions', data),
  saveResume: (data) => api.post('resume/save', data),
};

// Mock Interview API (AI features - to be integrated later)
export const mockInterviewAPI = {
  generateQuestions: (data) => api.post('mock-interview/generate-questions', data),
  analyzeAnswer: (data) => api.post('mock-interview/analyze-answer', data),
  saveSession: (data) => api.post('mock-interview/save-session', data),
};
