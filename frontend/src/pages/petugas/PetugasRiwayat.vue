<template>
  <div class="petugas-page fade-in">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Riwayat Kegiatan</h1>
        <p class="page-description">Jejak seluruh aktivitas pencatatan pengamatan dan panen yang telah Anda lakukan.</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Cari ID Budidaya atau detail..." class="modern-input" />
        </div>
      </div>
    </header>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Total Aktivitas</span>
        <span class="stat-value">{{ allActivities.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Pengamatan Dicatat</span>
        <span class="stat-value text-blue">{{ totalPengamatan }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Panen Dicatat</span>
        <span class="stat-value text-green">{{ totalPanen }}</span>
      </div>
    </div>

    <!-- Table content -->
    <div class="table-card-modern mt-24">
      <div class="table-header-modern riwayat-grid">
        <span>Jenis Kegiatan</span>
        <span>ID Budidaya</span>
        <span>Tanggal</span>
        <span>Rincian & Catatan</span>
      </div>

      <div v-if="loading" class="table-row-modern riwayat-grid empty-row">
        <span class="full-span">Memuat riwayat kegiatan...</span>
      </div>
      <div v-else-if="!filteredActivities.length" class="table-row-modern riwayat-grid empty-row">
        <span class="full-span">Belum ada riwayat kegiatan yang ditemukan.</span>
      </div>

      <div v-for="item in filteredActivities" :key="item.uid" class="table-row-modern riwayat-grid has-divider">
        <!-- Jenis Kegiatan -->
        <span class="activity-type">
          <span v-if="item.tipe === 'Panen'" class="badge-tag green-tag">📦 Panen</span>
          <span v-else-if="item.tipe === 'Lingkungan'" class="badge-tag yellow-tag">🌡️ Lingkungan</span>
          <span v-else class="badge-tag blue-tag">📝 Pengamatan</span>
        </span>
        
        <!-- ID Budidaya -->
        <span class="fw-700 hitam">BDY-{{ String(item.id_budidaya).padStart(3, '0') }}</span>
        
        <!-- Tanggal -->
        <span class="text-muted">{{ formatDate(item.tanggal) }}</span>
        
        <!-- Rincian -->
        <div class="details-col">
          <span class="detail-main fw-600">{{ item.deskripsi }}</span>
          <span v-if="item.catatan" class="text-sm text-muted">Catatan: {{ item.catatan }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usersService, pertumbuhanService, panenService, lingkunganService } from '../../services/dataService.js'

const allActivities = ref([])
const loading = ref(true)
const searchQuery = ref('')

const totalPengamatan = computed(() => allActivities.value.filter(a => a.tipe === 'Pengamatan').length)
const totalPanen = computed(() => allActivities.value.filter(a => a.tipe === 'Panen').length)

const filteredActivities = computed(() => {
  if (!searchQuery.value) return allActivities.value
  const q = searchQuery.value.toLowerCase()
  return allActivities.value.filter(item => 
    (`bdy-${item.id_budidaya}`).includes(q) ||
    item.deskripsi.toLowerCase().includes(q) ||
    (item.catatan && item.catatan.toLowerCase().includes(q))
  )
})

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  // Menambahkan waktu agar lebih presisi untuk log kegiatan
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

async function loadRiwayat() {
  loading.value = true
  try {
    const [meRes, growthRes, panenRes, envRes] = await Promise.all([
      usersService.getMe(),
      pertumbuhanService.getAll(),
      panenService.getAll(),
      lingkunganService.getAll(),
    ])

    const userId = Number(meRes?.data?.id_user)
    if (!userId) return

    const combined = []

    // Map Lingkungan Harian
    if (envRes?.success) {
      const myEnv = envRes.data.filter(item => Number(item.id_petugas) === userId)
      myEnv.forEach(e => {
        combined.push({
          uid: `env_${e.id_lingkungan}`,
          tipe: 'Lingkungan',
          tanggal: e.tanggal_pengukuran,
          id_budidaya: e.id_budidaya,
          deskripsi: `Suhu ${e.suhu || '-'}°C, Kelembapan ${e.kelembaban || '-'}%`,
          catatan: e.intensitas_cahaya ? `Cahaya: ${e.intensitas_cahaya} lux` : null
        })
      })
    }

    // Map Pengamatan (Pertumbuhan / Fase)
    if (growthRes?.success) {
      const myGrowth = growthRes.data.filter(item => Number(item.id_petugas) === userId)
      myGrowth.forEach(g => {
        combined.push({
          uid: `growth_${g.id_pertumbuhan}`,
          tipe: 'Pengamatan',
          tanggal: g.tanggal_pengamatan,
          id_budidaya: g.id_budidaya,
          deskripsi: `Fase: ${g.fase || '-'}`,
          catatan: g.catatan
        })
      })
    }

    // Map Panen
    if (panenRes?.success) {
      const myHarvest = panenRes.data.filter(item => Number(item.id_petugas) === userId)
      myHarvest.forEach(p => {
        combined.push({
          uid: `harvest_${p.id_panen}`,
          tipe: 'Panen',
          tanggal: p.tanggal_panen,
          id_budidaya: p.id_budidaya,
          deskripsi: `Berhasil memanen ${p.jumlah_panen || 0} kg`,
          catatan: p.catatan
        })
      })
    }

    // Sort by Date Descending (Terbaru di atas)
    combined.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))

    allActivities.value = combined
  } catch (err) {
    console.error("Gagal memuat riwayat kegiatan:", err)
  } finally {
    loading.value = false
  }
}

onMounted(loadRiwayat)
</script>

<style scoped>
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.petugas-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-text h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
.page-description { margin: 4px 0 0; color: #6b7280; font-size: 14px; }

.search-box { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 14px; width: 16px; height: 16px; color: #9ca3af; }
.modern-input { width: 300px; padding: 10px 14px 10px 38px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s; }
.modern-input:focus { outline: none; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }

.mt-24 { margin-top: 24px; }

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stat-label { display: block; font-size: 13px; color: #6b7280; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 32px; font-weight: 800; color: #111827; }
.text-green { color: #16a34a; }
.text-blue { color: #2563eb; }

/* Table Style */
.table-card-modern {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.riwayat-grid {
  display: grid;
  grid-template-columns: 140px 120px 180px 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px 24px;
  font-size: 14px;
}

.table-header-modern {
  background: #f9fafb;
  font-weight: 700;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
}

.has-divider { border-top: 1px solid #f3f4f6; }
.table-row-modern { transition: background 0.2s; color: #111827; }
.table-row-modern:hover { background: #f9fafb; }

.empty-row { display: block; padding: 48px; text-align: center; color: #6b7280; }
.full-span { display: block; grid-column: 1 / -1; }

.hitam { color: #111827; }
.fw-600 { font-weight: 600; }
.fw-700 { font-weight: 700; }
.text-muted { color: #6b7280; }
.text-sm { font-size: 13px; margin-top: 2px; }

.details-col { display: flex; flex-direction: column; }

.badge-tag {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 12px;
}

.green-tag { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.blue-tag { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.yellow-tag { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }

@media(max-width: 1024px) {
  .stats-row { grid-template-columns: 1fr; }
  .riwayat-grid { grid-template-columns: 120px 100px 140px 1fr; padding: 16px; }
}
@media(max-width: 640px) {
  .riwayat-grid { grid-template-columns: 1fr; gap: 8px; }
}
</style>