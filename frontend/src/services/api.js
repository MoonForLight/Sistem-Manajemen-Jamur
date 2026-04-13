// API Configuration & Base Setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // PENCEGAHAN REDIRECT HARD KE /login:
      // Hanya menghapus item auth di token kadaluwarsa, tidak langsung window.location
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Tidak redirect ke /login karena login sekarang modal popup
      }

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const errorInfo = await response.json();
          if (errorInfo.message) errorMsg = errorInfo.message;
        } catch (e) {
          // kalau bukan json, biarkan error bawaan
        }
        throw new Error(errorMsg);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
