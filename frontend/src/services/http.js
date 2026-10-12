import { API_BASE_URL, REQUEST_TIMEOUT } from '../config/env.js';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status; // 0 means the server could not be reached
  }
  get isNetwork() {
    return this.status === 0;
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const headers = {};
  if (method !== 'GET') headers['X-Requested-With'] = 'ShailendraTech';
  if (body) headers['Content-Type'] = 'application/json';

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(data?.message || 'Request failed', res.status);
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('The server is not reachable right now.', 0);
  } finally {
    clearTimeout(timer);
  }
}
