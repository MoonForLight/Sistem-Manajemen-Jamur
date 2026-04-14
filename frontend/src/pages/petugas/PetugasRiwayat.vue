<template>
  <div class="petugas-page">
    <header class="page-header">
      <div>
        <h1>Riwayat Panen</h1>
        <p class="page-description">Lihat catatan panen dan hasil yang telah Anda laporkan.</p>
      </div>
    </header>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Total Panen</span>
        <span class="stat-value">{{ harvestRecords.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Budidaya Selesai</span>
        <span class="stat-value">{{ completedBudidaya }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Jumlah Kilogram</span>
        <span class="stat-value">{{ totalHarvestKg }}</span>
      </div>
    </div>

    <div v-if="loading" class="status-message">Memuat riwayat...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <div class="table-card" v-if="!loading && !error">
      <div class="table-header">
        <span>Budidaya</span>
        <span>Tanggal Panen</span>
        <span>Jumlah Panen</span>
        <span>Catatan</span>
      </div>

      <div v-if="harvestRecords.length === 0" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Belum ada riwayat panen.</span>
      </div>

      <div v-for="item in harvestRecords" :key="item.id_panen" class="table-row">
        <span>{{ item.id_budidaya }}</span>
        <span>{{ formatDate(item.tanggal_panen) }}</span>
        <span>{{ item.jumlah_panen ?? '-' }} kg</span>
        <span>{{ item.catatan || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usersService, budidayaService, panenService } from '../../services/dataService.js'

const assignedBudidaya = ref([])
const harvestRecords = ref([])
const loading = ref(true)
const error = ref('')

const completedBudidaya = computed(() => assignedBudidaya.value.filter(item => item.status === 'selesai').length)
const totalHarvestKg = computed(() => harvestRecords.value.reduce((sum, item) => sum + (item.jumlah_panen ?? 0), 0))

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function loadRiwayat() {
  try {
    const [meRes, budRes, panenRes] = await Promise.all([
      usersService.getMe(),
      budidayaService.getAll(),
      panenService.getAll(),
    ])

    if (!meRes?.success) {
      throw new Error('Gagal memuat profil petugas')
    }

    const userId = meRes.data.id_user
    if (budRes?.success) {
      assignedBudidaya.value = budRes.data.filter(item => item.id_petugas === userId)
    }

    if (panenRes?.success) {
      harvestRecords.value = panenRes.data
        .filter(item => item.id_petugas === userId)
        .sort((a, b) => new Date(b.tanggal_panen) - new Date(a.tanggal_panen))
    }
  } catch (err) {
    console.error(err)
    error.value = 'Tidak dapat memuat riwayat panen saat ini.'
  } finally {
    loading.value = false
  }
}

onMounted(loadRiwayat)
</script>

<style scoped>
.petugas-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #111827;
}

.page-description {
  margin: 8px 0 0;
  color: #6b7280;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #eef2ff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 10px;
  font-weight: 600;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
}

.table-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr 2fr;
  gap: 16px;
  align-items: center;
  padding: 14px 0;
}

.table-header {
  border-bottom: 1px solid #e5e7eb;
  font-weight: 700;
  color: #374151;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
}

.table-row.empty-row {
  border-bottom: none;
}

.table-row:last-child {
  border-bottom: none;
}

.status-message {
  padding: 16px;
  border-radius: 14px;
  background: #f9fafb;
  color: #374151;
}

.status-message.error {
  background: #fef2f2;
  color: #991b1b;
}

@media(max-width: 1024px) {
  .stats-row,
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }
}
</style>