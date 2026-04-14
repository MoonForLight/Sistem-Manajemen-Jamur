<template>
  <div class="dashboard-content">
    <!-- Top Stats Row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-top">
          <div class="stat-info">
            <span class="stat-label">Lokasi Budidaya</span>
            <span class="stat-value">{{ stats.lokasi }}</span>
          </div>
          <div class="stat-icon">📍</div>
        </div>
        <div class="stat-trend up">
          <span class="trend-icon">↗</span> 12% <span class="trend-text">Dari minggu lalu</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <div class="stat-info">
            <span class="stat-label">Petugas</span>
            <span class="stat-value">{{ stats.petugas }}</span>
          </div>
          <div class="stat-icon">👥</div>
        </div>
        <div class="stat-trend up">
          <span class="trend-icon">↗</span> 5% <span class="trend-text">Stabil</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <div class="stat-info">
            <span class="stat-label">Jenis Jamur</span>
            <span class="stat-value">{{ stats.jenis }}</span>
          </div>
          <div class="stat-icon">🍄</div>
        </div>
        <div class="stat-trend">
          <span class="trend-text">Kategori stabil</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <div class="stat-info">
            <span class="stat-label">Media Tanam</span>
            <span class="stat-value">{{ stats.media }}</span>
          </div>
          <div class="stat-icon">🧪</div>
        </div>
        <div class="stat-trend">
          <span class="trend-text">Tersedia untuk semua budidaya</span>
        </div>
      </div>
    </div>

    <!-- Dashboard Main Grid -->
    <div class="dashboard-grid">
      <!-- Left Column: Daftar Lokasi -->
      <div class="left-col">
        <div class="panel">
          <h3 class="panel-title mb-4">Daftar Lokasi</h3>
          <div class="location-list">
            <div class="location-item" v-for="loc in locations" :key="loc.id_lokasi">
              <span class="loc-name">{{ loc.nama_lokasi }}</span>
              <a href="#" class="loc-link">Detail →</a>
            </div>
            <div v-if="!locations.length && !isLoading" class="location-item">
              <span class="loc-name">Belum ada lokasi tersedia</span>
              <span></span>
            </div>
          </div>
          
          <!-- Peta Lokasi Box -->
          <div class="map-placeholder mt-4">
            <p class="map-text">Peta Lokasi<br/>(opsional)</p>
            <p class="map-subtext">• Bisa diganti map plugin / gambar denah.</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Detail Monitoring & Charts -->
      <div class="right-col">
        <div class="panel">
          <h3 class="panel-title">Detail Monitoring</h3>
          <p class="panel-subtitle">
            {{ latestSummary ? `${latestSummary.nama_lokasi} • ${latestSummary.nama_jamur} • BDY-${latestSummary.id_budidaya}` : 'Belum ada sesi budidaya aktif' }}
          </p>
          
          <div class="monitor-cards">
            <div class="m-card">
              <span class="m-label">Pengamatan</span>
              <div class="m-value-row">
                <span class="m-value">{{ latestSummary ? latestSummary.total_pengamatan : 0 }}</span>
              </div>
            </div>
            <div class="m-card">
              <span class="m-label">Total Panen</span>
              <div class="m-value-row">
                <span class="m-value">{{ latestSummary ? latestSummary.total_panen : 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Grafik -->
        <div class="panel">
          <h3 class="panel-title mb-4">Grafik Suhu & Kelembapan</h3>
          <div class="chart-placeholder">
            <svg viewBox="0 0 500 150" class="mock-chart">
              <path d="M0,120 L50,90 L100,110 L150,70 L200,90 L250,50 L300,80 L350,40 L400,70 L450,40 L500,80" fill="none" stroke="#eab308" stroke-width="3" stroke-linejoin="round"/>
              <path d="M0,80 L50,60 L100,80 L150,40 L200,60 L250,20 L300,50 L350,20 L400,60 L450,20 L500,60" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round"/>
              <line x1="0" y1="130" x2="500" y2="130" stroke="#f3f4f6" stroke-width="1"/>
            </svg>
          </div>
        </div>

        <!-- Logs -->
        <div class="panel">
          <h3 class="panel-title mb-4">Log Alert Terbaru</h3>
          <div class="alert-item">
            <span class="alert-msg">
              {{ latestSummary ? `Budidaya ${latestSummary.nama_jamur} di ${latestSummary.nama_lokasi} berstatus ${latestSummary.status}` : 'Belum ada alert budidaya terbaru.' }}
            </span>
            <span class="alert-time">{{ latestSummary ? 'Sekarang' : '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { lokasiService, budidayaService, jenisJamurService, mediaTanamService, usersService } from '../../services/dataService.js'

const stats = ref({ lokasi: 0, petugas: 0, jenis: 0, media: 0 })
const locations = ref([])
const latestSummary = ref(null)
const isLoading = ref(true)

const statusClass = (status) => {
  if (!status) return ''
  return status.toLowerCase() === 'aktif' ? 'status-chip active' : 'status-chip inactive'
}

const latestStatus = computed(() => latestSummary.value?.status || 'Belum ada data')

async function loadDashboard() {
  try {
    const [lokasiRes, jenisRes, mediaRes, petugasRes, summaryRes] = await Promise.all([
      lokasiService.getAll(),
      jenisJamurService.getAll(),
      mediaTanamService.getAll(),
      usersService.getPetugasList(),
      budidayaService.getSummary(),
    ])

    if (lokasiRes?.success) {
      locations.value = lokasiRes.data
      stats.value.lokasi = lokasiRes.data.length
    }

    if (jenisRes?.success) {
      stats.value.jenis = jenisRes.data.length
    }

    if (mediaRes?.success) {
      stats.value.media = mediaRes.data.length
    }

    if (petugasRes?.success) {
      stats.value.petugas = petugasRes.data.length
    }

    if (summaryRes?.success) {
      latestSummary.value = summaryRes.data?.[0] || null
    }
  } catch (error) {
    console.error('Gagal memuat dashboard admin:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

@media(max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.stat-trend {
  font-size: 11px;
  font-weight: 600;
}

.stat-trend.up {
  color: #10b981;
}

.trend-text {
  color: #9ca3af;
  font-weight: 400;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 24px;
}

@media(max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.panel-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.panel-subtitle {
  margin: 4px 0 16px 0;
  font-size: 12px;
  color: #6b7280;
}

.mb-4 { margin-bottom: 16px; }
.mt-4 { margin-top: 16px; }

/* Location List */
.location-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafbfc;
}

.loc-name {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.loc-link {
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.map-placeholder {
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px 16px;
  background: #f9fafb;
}

.map-text {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #6b7280;
}

.map-subtext {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}

/* Monitoring Cards */
.monitor-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.m-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.m-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.m-value-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.m-value {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.badge-danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 700;
}

.chart-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  background: #fafbfc;
}

.mock-chart {
  width: 100%;
  height: 100%;
  padding: 20px;
}

/* Alerts */
.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}

.alert-msg {
  color: #4b5563;
}

.alert-time {
  color: #9ca3af;
  font-size: 11px;
}
</style>
