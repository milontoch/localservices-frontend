import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const registerProvider = (data) => api.post('/auth/register-provider', data);
export const login = (data) => api.post('/auth/login', data);
export const requestOtp = (data) => api.post('/auth/request-otp', data);
export const verifyOtp = (data) => api.post('/auth/verify-otp', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// Categories
export const getCategories = () => api.get('/categories');
export const getCategory = (slug) => api.get(`/categories/${slug}`);

// Providers
export const getProviders = (params) => api.get('/providers', { params });
export const getProvider = (id) => api.get(`/providers/${id}`);
export const searchProviders = (params) => api.get('/providers/search', { params });

// Reviews
export const getProviderReviews = (providerId, params) => 
  api.get(`/providers/${providerId}/reviews`, { params });
export const createReview = (data) => api.post('/reviews', data);

// Contact Records
export const createContactRecord = (data) => api.post('/contact-records', data);
export const checkContactRecord = (params) => api.get('/contact-records/check', { params });

// Portfolio
export const uploadPortfolio = (formData) => 
  api.post('/portfolios', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const deletePortfolio = (id) => api.delete(`/portfolios/${id}`);

// Verification
export const uploadVerification = (formData) => 
  api.post('/verifications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// Blog
export const getBlogPosts = (params) => api.get('/blog', { params });
export const getBlogPost = (slug) => api.get(`/blog/${slug}`);

// Admin - Blog
export const adminGetBlogPosts = () => api.get('/admin/blog');
export const adminCreateBlogPost = (formData) => 
  api.post('/admin/blog', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const adminUpdateBlogPost = (id, formData) => 
  api.put(`/admin/blog/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const adminDeleteBlogPost = (id) => api.delete(`/admin/blog/${id}`);

// Admin - Verifications
export const adminGetVerifications = () => api.get('/admin/verifications');
export const adminUpdateVerification = (id, data) => api.put(`/admin/verifications/${id}`, data);

// Admin - Users & Providers
export const adminGetUsers = (params) => api.get('/admin/users', { params });
export const adminGetProviders = (params) => api.get('/admin/providers', { params });

// Admin - Reviews
export const adminGetReviews = (params) => api.get('/admin/reviews', { params });
export const adminDeleteReview = (id) => api.delete(`/admin/reviews/${id}`);

// Admin - Categories
export const adminGetCategories = () => api.get('/admin/categories');
export const adminCreateCategory = (data) => api.post('/admin/categories', data);

// Storage helpers
export const setAuthToken = (token) => {
  localStorage.setItem('access_token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('access_token');
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export default api;
