export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export const REQUEST_TIMEOUT = 8000; // ms before we treat the backend as down
