<template>
  <div class="admin-page fade-in">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Log Unduhan Publik</h1>
        <p>Analisis pemanfaatan data budidaya oleh publik</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Cari nama atau instansi..." />
        </div>
        <!-- <button class="btn outline" @click="loadData">
          <svg viewBox="0 0 24 24" style="width:18px;height:18px;margin-right:6px"><path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Refresh Data
        </button> -->
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat data analitik...</p>
    </div>
    
    <div v-else class="dashboard-content">
      <!-- 4 KPI Cards -->
      <div class="stats-grid">
        <div class="stat-card glass-card">
          <div class="stat-icon bg-blue-light">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Unduhan</span>
            <span class="stat-value">{{ data.ringkasan.total_download }}</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon bg-green-light">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Pengunduh Unik</span>
            <span class="stat-value">{{ data.ringkasan.pengunduh_unik }}</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon bg-purple-light">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Instansi Terjangkau</span>
            <span class="stat-value">{{ data.ringkasan.instansi_unik }}</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon bg-orange-light">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Bulan Ini</span>
            <span class="stat-value">{{ data.ringkasan.download_bulan_ini }}</span>
          </div>
        </div>
      </div>

      <!-- Top Rankings -->
      <div class="ranking-grid">
        <div class="ranking-card glass-card">
          <h3>Top Laporan Diminati</h3>
          <ul class="ranking-list">
            <li v-for="(item, i) in data.top_tipe_laporan" :key="i">
              <span class="rank-number">{{ i + 1 }}</span>
              <span class="rank-name">{{ formatTipeLaporan(item.tipe_laporan) }}</span>
              <span class="rank-score">{{ item.total }}x</span>
            </li>
            <li v-if="!data.top_tipe_laporan.length" class="empty-list">Belum ada data</li>
          </ul>
        </div>
        
        <div class="ranking-card glass-card">
          <h3>Top Pengunduh Aktif</h3>
          <ul class="ranking-list">
            <li v-for="(item, i) in data.top_pengunduh" :key="i">
              <span class="rank-number">{{ i + 1 }}</span>
              <div class="rank-user">
                <span class="rank-email">{{ item.email }}</span>
              </div>
              <span class="rank-score">{{ item.total }}x</span>
            </li>
            <li v-if="!data.top_pengunduh.length" class="empty-list">Belum ada data</li>
          </ul>
        </div>
      </div>

      <!-- Detail Table -->
      <div class="table-container glass-card">
        <h3>Riwayat Detail 50 Unduhan Terakhir</h3>
        <table class="modern-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Pengunduh</th>
              <th>Instansi</th>
              <th>Tujuan</th>
              <th>Laporan Diunduh</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in filteredTerbaru" :key="log.id_log">
              <td>
                <div class="date-cell">
                  <span>{{ formatRelativeTime(log.tanggal_download) }}</span>
                  <span class="time-text">{{ formatDate(log.tanggal_download) }} {{ formatTime(log.tanggal_download) }}</span>
                </div>
              </td>
              <td>
                <div class="user-cell">
                  <span class="user-name">{{ log.nama }}</span>
                  <span class="user-email">{{ log.email }}</span>
                </div>
              </td>
              <td>{{ log.instansi }}</td>
              <td>{{ log.tujuan }}</td>
              <td>
                <span class="badge" :class="getBadgeClass(log.tipe_laporan)">
                  {{ formatTipeLaporan(log.tipe_laporan) }}
                </span>
                <div v-if="log.bulan" class="sub-badge">{{ log.bulan }}</div>
                <div v-if="log.id_budidaya" class="sub-badge">BDY-{{ String(log.id_budidaya).padStart(3, '0') }}</div>
              </td>
            </tr>
            <tr v-if="!filteredTerbaru.length">
              <td colspan="5" class="empty-state">Belum ada riwayat unduhan publik.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../services/api'

const loading = ref(true)
const searchQuery = ref('')
const data = ref({
  ringkasan: { total_download: 0, pengunduh_unik: 0, instansi_unik: 0, download_bulan_ini: 0 },
  top_tipe_laporan: [],
  top_pengunduh: [],
  terbaru: []
})

const filteredTerbaru = computed(() => {
  if (!searchQuery.value) return data.value.terbaru
  const q = searchQuery.value.toLowerCase()
  return data.value.terbaru.filter(log => 
    log.nama?.toLowerCase().includes(q) || 
    log.instansi?.toLowerCase().includes(q) ||
    log.email?.toLowerCase().includes(q)
  )
})

async function loadData() {
  loading.value = true
  try {
    const res = await api.get('/public/admin/rekap-download-top?limit=50')
    if (res.success) {
      data.value = res.data
    }
  } catch (error) {
    console.error('Gagal mengambil data log unduhan:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const diffMs = new Date() - d
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit lalu`
  if (diffHour < 24) return `${diffHour} jam lalu`
  if (diffDay === 1) return 'Kemarin'
  if (diffDay < 7) return `${diffDay} hari lalu`
  
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatTipeLaporan(val) {
  if (val === 'bulanan') return 'Laporan Bulanan'
  if (val === '3_bulan') return 'Laporan Kuartal (3 Bln)'
  if (val === 'rumah_jamur') return 'Laporan Rumah Jamur'
  if (val === 'per_jamur') return 'Laporan Siklus Budidaya'
  return val
}

function getBadgeClass(val) {
  if (val === 'bulanan') return 'badge-blue'
  if (val === '3_bulan') return 'badge-purple'
  if (val === 'rumah_jamur') return 'badge-green'
  if (val === 'per_jamur') return 'badge-orange'
  return 'badge-gray'
}
</script>

<style scoped>
.admin-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.header-text p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}


.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Glass Card Base */
.glass-card {
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.bg-blue-light { background: #eff6ff; color: #3b82f6; }
.bg-green-light { background: #f0fdf4; color: #22c55e; }
.bg-purple-light { background: #faf5ff; color: #a855f7; }
.bg-orange-light { background: #fff7ed; color: #f97316; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  margin-top: 4px;
}

/* Rankings Grid */
.ranking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.ranking-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.ranking-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-list li {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.ranking-list li:hover {
  background: #f9fafb;
}

.rank-number {
  width: 28px;
  height: 28px;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  margin-right: 12px;
}

.rank-name {
  flex: 1;
  font-weight: 500;
  color: #374151;
}

.rank-user {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.rank-email {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-score {
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.empty-list {
  color: #9ca3af;
  font-style: italic;
  justify-content: center;
  padding: 16px !important;
}

/* Table Container */
.table-container h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  text-align: left;
  padding: 12px 16px;
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 2px solid #e5e7eb;
}

.modern-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  font-size: 14px;
}

.date-cell, .user-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-text {
  font-size: 12px;
  color: #9ca3af;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.user-email {
  font-size: 12px;
  color: #6b7280;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.badge-blue { background: #eff6ff; color: #1d4ed8; }
.badge-purple { background: #faf5ff; color: #7e22ce; }
.badge-green { background: #f0fdf4; color: #15803d; }
.badge-orange { background: #fff7ed; color: #c2410c; }
.badge-gray { background: #f3f4f6; color: #4b5563; }

.sub-badge {
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
}

.empty-state {
  text-align: center;
  padding: 32px !important;
  color: #6b7280;
  font-style: italic;
}

/* Animations */
.fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn.outline {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn.outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
</style>
