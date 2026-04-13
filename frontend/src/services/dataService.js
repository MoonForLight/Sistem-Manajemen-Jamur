// Lokasi Service
import { api } from './api.js';

export const lokasiService = {
  // Get all locations
  async getAll() {
    return await api.get('/lokasi');
  },

  // Get location by ID
  async getById(id) {
    return await api.get(`/lokasi/${id}`);
  },

  // Create new location
  async create(data) {
    return await api.post('/lokasi', data);
  },

  // Update location
  async update(id, data) {
    return await api.put(`/lokasi/${id}`, data);
  },

  // Delete location
  async delete(id) {
    return await api.delete(`/lokasi/${id}`);
  },

  // Get locations by user
  async getByUser(userId) {
    return await api.get(`/lokasi/user/${userId}`);
  },
};

export const budidayaService = {
  // Get all budidaya records
  async getAll() {
    return await api.get('/budidaya');
  },

  // Get by location
  async getByLokasi(lokasiId) {
    return await api.get(`/budidaya/lokasi/${lokasiId}`);
  },

  // Create
  async create(data) {
    return await api.post('/budidaya', data);
  },

  // Update
  async update(id, data) {
    return await api.put(`/budidaya/${id}`, data);
  },

  // Delete
  async delete(id) {
    return await api.delete(`/budidaya/${id}`);
  },
};

export const pertumbuhanService = {
  // Get growth records
  async getAll() {
    return await api.get('/pertumbuhan');
  },

  // Get by budidaya
  async getByBudidaya(budidayaId) {
    return await api.get(`/pertumbuhan/budidaya/${budidayaId}`);
  },

  // Create growth record
  async create(data) {
    return await api.post('/pertumbuhan', data);
  },

  // Update
  async update(id, data) {
    return await api.put(`/pertumbuhan/${id}`, data);
  },

  // Delete
  async delete(id) {
    return await api.delete(`/pertumbuhan/${id}`);
  },
};

export const panenService = {
  // Get harvest records
  async getAll() {
    return await api.get('/panen');
  },

  // Get by budidaya
  async getByBudidaya(budidayaId) {
    return await api.get(`/panen/budidaya/${budidayaId}`);
  },

  // Create harvest record
  async create(data) {
    return await api.post('/panen', data);
  },

  // Update
  async update(id, data) {
    return await api.put(`/panen/${id}`, data);
  },

  // Delete
  async delete(id) {
    return await api.delete(`/panen/${id}`);
  },
};

export const jenisJamurService = {
  // Get all types
  async getAll() {
    return await api.get('/jenis-jamur');
  },

  // Get by ID
  async getById(id) {
    return await api.get(`/jenis-jamur/${id}`);
  },

  // Create
  async create(data) {
    return await api.post('/jenis-jamur', data);
  },

  // Update
  async update(id, data) {
    return await api.put(`/jenis-jamur/${id}`, data);
  },

  // Delete
  async delete(id) {
    return await api.delete(`/jenis-jamur/${id}`);
  },
};

export const usersService = {
  // Get all users (admin only)
  async getAll() {
    return await api.get('/users');
  },

  // Get user by ID
  async getById(id) {
    return await api.get(`/users/${id}`);
  },

  // Create user
  async create(data) {
    return await api.post('/users', data);
  },

  // Update user
  async update(id, data) {
    return await api.put(`/users/${id}`, data);
  },

  // Delete user
  async delete(id) {
    return await api.delete(`/users/${id}`);
  },

  // Update profile
  async updateProfile(data) {
    return await api.put('/users/profile/me', data);
  },
};
