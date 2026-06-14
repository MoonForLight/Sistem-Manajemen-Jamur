// Lokasi Service
import { api } from './api.js';

export const lokasiService = {
  async getAll() {
    return await api.get('/lokasi');
  },

  async getById(id) {
    return await api.get(`/lokasi/${id}`);
  },

  async create(data) {
    return await api.post('/lokasi', data);
  },

  async update(id, data) {
    return await api.put(`/lokasi/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/lokasi/${id}`);
  },

  async getByUser(userId) {
    return await api.get(`/lokasi/user/${userId}`);
  },
};

export const budidayaService = {
  async getAll() {
    return await api.get('/budidaya');
  },

  async getByPetugas(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, value);
    });
    const query = params.toString();
    return await api.get(`/budidaya/petugas/me${query ? `?${query}` : ''}`);
  },

  async getSummary() {
    return await api.get('/budidaya/summary');
  },

  async getByLokasi(lokasiId) {
    return await api.get(`/budidaya/lokasi/${lokasiId}`);
  },

  async create(data) {
    return await api.post('/budidaya', data);
  },

  async update(id, data) {
    return await api.put(`/budidaya/${id}`, data);
  },

  async updateDailyTargets(id, data) {
    return await api.patch(`/budidaya/${id}/target-harian`, data);
  },

  async selesaikan(id, alasan_selesai) {
    return await api.patch(`/budidaya/${id}/selesaikan`, { alasan_selesai });
  },

  async delete(id) {
    return await api.delete(`/budidaya/${id}`);
  },
};

export const mediaTanamService = {
  async getAll() {
    return await api.get('/media-tanam');
  },

  async getById(id) {
    return await api.get(`/media-tanam/${id}`);
  },

  async create(data) {
    return await api.post('/media-tanam', data);
  },

  async update(id, data) {
    return await api.put(`/media-tanam/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/media-tanam/${id}`);
  },
};

export const pertumbuhanService = {
  async getAll() {
    return await api.get('/pertumbuhan');
  },

  async getByBudidaya(budidayaId) {
    return await api.get(`/pertumbuhan/budidaya/${budidayaId}`);
  },

  async create(data) {
    return await api.post('/pertumbuhan', data);
  },

  async update(id, data) {
    return await api.put(`/pertumbuhan/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/pertumbuhan/${id}`);
  },
};

export const lingkunganService = {
  async getAll() {
    return await api.get('/lingkungan');
  },

  async getByBudidaya(budidayaId) {
    return await api.get(`/lingkungan/budidaya/${budidayaId}`);
  },

  async create(data) {
    return await api.post('/lingkungan', data);
  },

  async update(id, data) {
    return await api.put(`/lingkungan/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/lingkungan/${id}`);
  },
};

export const panenService = {
  async getAll() {
    return await api.get('/panen');
  },

  async getByBudidaya(budidayaId) {
    return await api.get(`/panen/budidaya/${budidayaId}`);
  },

  async create(data) {
    return await api.post('/panen', data);
  },

  async update(id, data) {
    return await api.put(`/panen/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/panen/${id}`);
  },
};

export const jenisJamurService = {
  async getAll() {
    return await api.get('/jenis-jamur');
  },

  async getById(id) {
    return await api.get(`/jenis-jamur/${id}`);
  },

  async create(data) {
    return await api.post('/jenis-jamur', data);
  },

  async update(id, data) {
    return await api.put(`/jenis-jamur/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/jenis-jamur/${id}`);
  },
};

export const usersService = {
  async getPetugasList() {
    return await api.get('/users/petugas');
  },

  async getMe() {
    return await api.get('/users/me');
  },

  async updateMe(data) {
    return await api.put('/users/me', data);
  },

  async changePassword(data) {
    return await api.put('/users/me/password', data);
  },

  async createPetugas(data) {
    return await api.post('/auth/register', data);
  },

  async updatePetugas(id, data) {
    return await api.put(`/users/${id}`, data);
  },

  async deletePetugas(id) {
    return await api.delete(`/users/${id}`);
  },
};

export const downloadService = {
  async getRekapTop(limit = 10) {
    return await api.get(`/public/admin/rekap-download-top?limit=${encodeURIComponent(limit)}`);
  },
};

export const uploadService = { 
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return await api.post('/upload', formData);
  }
};
