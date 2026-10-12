import { request } from './http.js';

export const blogService = {
  list: (page = 1, limit = 9) => request(`/posts?page=${page}&limit=${limit}`),
  get: (slug) => request(`/posts/${encodeURIComponent(slug)}`),
};

export const siteService = {
  services: () => request('/services'),
  whatWeDo: () => request('/whatwedo'),
  projects: () => request('/projects'),
};

export const contactService = {
  send: (data) => request('/contact', { method: 'POST', body: data }),
};

export const aiService = {
  chat: (message, history = []) =>
    request('/ai/chat', { method: 'POST', body: { message, history } }),
};
