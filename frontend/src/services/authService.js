// Authentication Service
import { api } from './api.js';

export const authService = {
  // Login
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    if (response && response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Register
  async register(formData) {
    const response = await api.post('/auth/register', formData);
    return response;
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/';
  },

  // Get Current User
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get Current Role
  getCurrentRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  },

  // Check if logged in
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Verify Token
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response;
    } catch (error) {
      this.logout();
      return null;
    }
  },
};
