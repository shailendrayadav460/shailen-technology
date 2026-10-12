import { request } from './http.js';

export const authService = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

export const adminService = {
  // Posts
  listPosts: () => request('/admin/posts'),
  createPost: (post) => request('/admin/posts', { method: 'POST', body: post }),
  updatePost: (id, post) => request(`/admin/posts/${id}`, { method: 'PUT', body: post }),
  deletePost: (id) => request(`/admin/posts/${id}`, { method: 'DELETE' }),
  // Messages
  listMessages: () => request('/admin/messages'),
  markRead: (id) => request(`/admin/messages/${id}/read`, { method: 'PATCH' }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),
  // Services
  listServices: () => request('/admin/services'),
  createService: (data) => request('/admin/services', { method: 'POST', body: data }),
  updateService: (id, data) => request(`/admin/services/${id}`, { method: 'PUT', body: data }),
  deleteService: (id) => request(`/admin/services/${id}`, { method: 'DELETE' }),
  // What We Do
  listWhatWeDo: () => request('/admin/whatwedo'),
  createWhatWeDo: (data) => request('/admin/whatwedo', { method: 'POST', body: data }),
  updateWhatWeDo: (id, data) => request(`/admin/whatwedo/${id}`, { method: 'PUT', body: data }),
  deleteWhatWeDo: (id) => request(`/admin/whatwedo/${id}`, { method: 'DELETE' }),
  // Projects
  listProjects: () => request('/admin/projects'),
  createProject: (data) => request('/admin/projects', { method: 'POST', body: data }),
  updateProject: (id, data) => request(`/admin/projects/${id}`, { method: 'PUT', body: data }),
  deleteProject: (id) => request(`/admin/projects/${id}`, { method: 'DELETE' }),
};
