<template>
  <div class="dashboard-content">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Budidaya Aktif</span>
        <span class="stat-value">{{ activeBudidaya }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Jenis Jamur</span>
        <span class="stat-value">{{ uniqueJenis }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Catatan Hari Ini</span>
        <span class="stat-value">{{ todayTasks }}</span>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="left-col">
        <div class="chart-panel">
          <div class="panel-header-row">
            <h3 class="panel-title">Tugas Budidaya Saya</h3>
            <span class="info-chip">{{ assignedBudidaya.length }} tugas</span>
          </div>
          <div class="table-card">
            <div class="table-header">
              <span>ID Budidaya</span>
              <span>Lokasi</span>
              <span>Jenis</span>
              <span>Status</span>
            </div>
            <div v-if="loading" class="table-row empty-row">
              <span style="grid-column: 1 / -1">Memuat daftar budidaya...</span>
            </div>
            <div v-if="!loading && !assignedBudidaya.length" class="table-row empty-row">
              <span style="grid-column: 1 / -1">Belum ada budidaya yang ditugaskan.</span>
            </div>
            <div v-for="item in assignedBudidaya" :key="item.id_budidaya" class="table-row">
              <span>{{ item.id_budidaya }}</span>
              <span>{{ item.nama_lokasi }}</span>
              <span>{{ item.nama_jamur }}</span>
              <span>
                <span :class="['status-chip', item.status === 'aktif' ? 'active' : 'inactive']">
                  {{ item.status || 'Tidak diketahui' }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div class="chart-panel">
          <div class="panel-header-row">
            <h3 class="panel-title">Performa</h3>
            <span class="info-chip">{{ recentActivities.length }} aktifitas</span>
          </div>
          <div class="chart-placeholder">
            <svg viewBox="0 0 500 200" class="mock-chart">
              <path d="M0,170 L100,120 L180,150 L250,90 L320,105 L400,70 L500,90" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="0" y1="180" x2="500" y2="180" stroke="#e5e7eb" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="right-col">
        <div class="side-panel">
          <h3 class="panel-title">Notifikasi</h3>
          <p class="panel-subtitle">Tugas penting hari ini</p>

          <div class="list-container">
            <div v-if="notifications.length === 0" class="notif-empty">Tidak ada notifikasi baru.</div>
            <div v-for="(note, index) in notifications" :key="index" class="notif-item">
              <div :class="['badge', note.type]">{{ note.label }}</div>
              <div class="notif-text">
                <strong>{{ note.title }}</strong> <span class="time">{{ note.time }}</span>
                <p>{{ note.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="side-panel">
          <h3 class="panel-title">Riwayat Aktivitas</h3>
          <p class="panel-subtitle">Catatan terbaru</p>

          <div class="list-container">
            <div v-if="recentActivities.length === 0" class="notif-empty">Belum ada aktivitas terbaru.</div>
            <div v-for="item in recentActivities" :key="item.id" class="activity-item">
              <span class="act-icon">{{ item.icon }}</span>
              <div class="act-details">
                <span>{{ item.title }}</span>
                <span class="time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usersService, budidayaService, pertumbuhanService, panenService } from '../../services/dataService.js'

const assignedBudidaya = ref([])
const growthRecords = ref([])
const harvestRecords = ref([])
const user = ref(null)
const loading = ref(true)
const error = ref('')

const activeBudidaya = computed(() => assignedBudidaya.value.filter(item => item.status === 'aktif').length)
const uniqueJenis = computed(() => new Set(assignedBudidaya.value.map(item => item.nama_jamur)).size)
const today = new Date().toISOString().slice(0, 10)
const todayTasks = computed(() => growthRecords.value.filter(item => item.tanggal_pengamatan?.startsWith(today)).length)

const notifications = computed(() => {
  const notes = []
  if (assignedBudidaya.value.length > 0) {
    notes.push({
      label: 'INFO',
      type: 'badge-info',
      title: `${assignedBudidaya.value.length} budidaya aktif`,
      message: 'Periksa kondisi suhu dan kelembapan hari ini.',
      time: 'sekarang',
    })
  }
  if (todayTasks.value > 0) {
    notes.push({
      label: 'SUCCESS',
      type: 'badge-success',
      title: `${todayTasks.value} pengamatan hari ini`,
      message: 'Lanjutkan input data pertumbuhan untuk budidaya aktif.',
      time: 'hari ini',
    })
  }
  if (harvestRecords.value.length > 0) {
    notes.push({
      label: 'ALERT',
      type: 'badge-warning',
      title: `Panen tersedia`,
      message: `${harvestRecords.value.length} catatan panen terakhir siap direview.`,
      time: 'kemarin',
    })
  }
  return notes
})

const recentActivities = computed(() => {
  const merged = [
    ...growthRecords.value.map(item => ({
      id: `g-${item.id_pertumbuhan}`,
      title: `Pengamatan dicatat — ${item.id_budidaya}`,
      time: formatDate(item.tanggal_pengamatan),
      icon: '📝',
      timestamp: item.tanggal_pengamatan,
    })),
    ...harvestRecords.value.map(item => ({
      id: `p-${item.id_panen}`,
      title: `Panen dicatat — ${item.id_budidaya}`,
      time: formatDate(item.tanggal_panen),
      icon: '📦',
      timestamp: item.tanggal_panen,
    })),
  ]
  return merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
})

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function loadDashboard() {
  try {
    const [meRes, budRes, growthRes, panenRes] = await Promise.all([
      usersService.getMe(),
      budidayaService.getByPetugas(),
      pertumbuhanService.getAll(),
      panenService.getAll(),
    ])

    if (!meRes?.success) {
      throw new Error('Gagal memuat profil petugas')
    }

    user.value = meRes.data

    if (budRes?.success) {
      assignedBudidaya.value = budRes.data
    }

    const assignedIds = new Set(assignedBudidaya.value.map(item => item.id_budidaya))

    if (growthRes?.success) {
      growthRecords.value = growthRes.data.filter(item => assignedIds.has(item.id_budidaya))
    }
    if (panenRes?.success) {
      harvestRecords.value = panenRes.data.filter(item => item.id_petugas === user.value.id_user)
    }
  } catch (err) {
    console.error(err)
    error.value = 'Tidak dapat memuat dashboard petugas.'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #111827;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media(max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart-panel,
.side-panel {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.panel-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.panel-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.info-chip {
  padding: 6px 12px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #166534;
  font-size: 12px;
  font-weight: 700;
}

.table-card {
  background: #f8fafc;
  border-radius: 14px;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.3fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 14px 20px;
}

.table-header {
  color: #475569;
  font-weight: 700;
  border-bottom: 1px solid #e2e8f0;
}

.table-row {
  background: white;
  border-bottom: 1px solid #f1f5f9;
}

.table-row.empty-row {
  justify-items: center;
  color: #6b7280;
}

.status-chip {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-chip.active {
  background: #dcfce7;
  color: #166534;
}

.status-chip.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 12px;
}

.notif-item,
.activity-item {
  display: flex;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.notif-item:last-child,
.activity-item:last-child {
  border-bottom: none;
}

.notif-text,
.act-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time {
  color: #94a3b8;
  font-size: 12px;
}

.badge-info {
  background: #eff6ff;
  color: #1d4ed8;
}

.badge-success {
  background: #ecfdf5;
  color: #166534;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.notif-empty {
  color: #6b7280;
  font-size: 14px;
}

.link-all {
  display: inline-block;
  margin-top: 8px;
  color: #16a34a;
  font-weight: 700;
  text-decoration: none;
}
</style>