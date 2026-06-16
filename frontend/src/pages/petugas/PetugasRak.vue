<template>
  <div class="rack-page">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Daftar Siklus Budidaya</h1>
        <p class="page-description">Daftar siklus Jamur yang ada di rumah jamur.</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <select v-model="statusFilter" class="modern-select" @change="loadFiltered">
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" style="position:absolute; left:14px; width:16px; height:16px; color:#9ca3af;"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input v-model.trim="search" class="modern-input" style="padding-left: 38px; width: 220px;" placeholder="Cari ID, jenis..." @keyup.enter="loadFiltered" />
        </div>
        <button class="btn-primary" @click="loadFiltered">Terapkan</button>
      </div>
    </header>

    <div v-if="loading" class="empty fade-in">
       <div class="loader-spinner"></div>
       <p>Memuat data siklus...</p>
    </div>
    <div v-else-if="groups.length === 0" class="empty fade-in">
       <svg viewBox="0 0 24 24" class="icon-empty"><path fill="currentColor" d="M22 2H2v20l4-4h16V2zM12 11H9V8h3v3zm5 0h-3V8h3v3z"/></svg>
       <h3>Tidak ada siklus</h3>
       <p>Tidak ada siklus budidaya yang sesuai dengan filter pencarian.</p>
    </div>

    <div v-else class="content-wrapper">
      <section v-for="group in groups" :key="group.id_lokasi" class="location-section fade-in">
        <!-- <div class="location-heading">
          <div class="heading-left">
            <svg viewBox="0 0 24 24" class="icon-location"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <div>
              <h2>{{ group.nama_lokasi }}</h2>
              <span>{{ group.totalRak }} Rak terpakai dari {{ group.budidayas.length }} Siklus aktif</span>
            </div>
          </div>
        </div> -->

        <div class="budidaya-grid">
          <article v-for="budidaya in group.budidayas" :key="budidaya.id_budidaya" class="budidaya-card hover-lift">
            <div class="card-header">
              <div class="badge-group">
                <span class="badge badge-id">BDY-{{ String(budidaya.id_budidaya).padStart(3, '0') }}</span>
                <span :class="['badge status-badge', budidaya.status]">{{ budidaya.status }}</span>
              </div>
              <span v-if="budidaya.status !== 'selesai'" class="age-badge">Hari ke-{{ budidaya.umurHari }}</span>
            </div>
            
            <div class="card-body">
              <h3 class="jamur-name">{{ budidaya.nama_jamur }}</h3>
              
              <div class="phase-container">
                <span class="phase-label">Fase Saat Ini:</span>
                <span :class="['phase-badge', getPhaseClass(budidaya.faseTerkini)]">
                  {{ budidaya.faseTerkini || 'Belum ada data' }}
                </span>
              </div>

              <div class="info-list">
                <div class="info-row">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z"/></svg>
                  <span>{{ budidaya.jumlah_rak }} Rak Fisik</span>
                </div>
                <div class="info-row">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.1V5l6 2.1V19z"/></svg>
                  <span>Media: {{ budidaya.nama_media }}</span>
                </div>
                <div class="info-row">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/></svg>
                  <span>Mulai: {{ formatDate(budidaya.tanggal_mulai) }}</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button
                class="btn-manage"
                :disabled="budidaya.status === 'selesai'"
                @click="openBudidaya(budidaya)"
              >
                {{ budidaya.status === 'selesai' ? 'Siklus Telah Selesai' : 'Catat Perkembangan' }}
                <svg v-if="budidaya.status !== 'selesai'" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { budidayaService, pertumbuhanService } from '../../services/dataService.js'

const router = useRouter()
const loading = ref(false)
const records = ref([])
const growthRecords = ref([])
const lokasiOptions = ref([])
const statusFilter = ref('aktif')
const search = ref('')

const enrichedRecords = computed(() => {
  return records.value.map(budidaya => {
    // Cari fase terkini
    const relatedGrowths = growthRecords.value
      .filter(g => String(g.id_budidaya) === String(budidaya.id_budidaya))
      .sort((a, b) => new Date(b.tanggal_pengamatan) - new Date(a.tanggal_pengamatan))
    
    const faseTerkini = relatedGrowths.length > 0 ? relatedGrowths[0].fase : ''

    // Hitung umur
    let umurHari = 0
    if (budidaya.tanggal_mulai) {
      const start = new Date(budidaya.tanggal_mulai)
      start.setHours(0,0,0,0)
      const now = new Date()
      now.setHours(0,0,0,0)
      const diffTime = now.getTime() - start.getTime()
      umurHari = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    }

    return {
      ...budidaya,
      faseTerkini,
      umurHari
    }
  })
})

const groups = computed(() => {
  const map = new Map()
  enrichedRecords.value.forEach((budidaya) => {
    const key = String(budidaya.id_lokasi)
    if (!map.has(key)) {
      map.set(key, {
        id_lokasi: budidaya.id_lokasi,
        nama_lokasi: budidaya.nama_lokasi,
        budidayas: [],
        totalRak: 0
      })
    }
    const group = map.get(key)
    group.budidayas.push(budidaya)
    group.totalRak += (Number(budidaya.jumlah_rak) || 0)
  })
  
  // Return sorted by location name
  return Array.from(map.values()).sort((a, b) => a.nama_lokasi.localeCompare(b.nama_lokasi))
})

async function loadOptions() {
  const res = await budidayaService.getByPetugas()
  const uniqueLokasi = new Map()
  ;(res?.data || []).forEach((item) => {
    if (item.id_lokasi) {
      uniqueLokasi.set(String(item.id_lokasi), {
        id_lokasi: item.id_lokasi,
        nama_lokasi: item.nama_lokasi
      })
    }
  })
  lokasiOptions.value = Array.from(uniqueLokasi.values()).sort((a, b) => a.nama_lokasi.localeCompare(b.nama_lokasi))
}

async function loadFiltered() {
  loading.value = true
  try {
    const [res, growthRes] = await Promise.all([
      budidayaService.getByPetugas({
        status: statusFilter.value,
        q: search.value
      }),
      pertumbuhanService.getAll()
    ])
    
    let data = res?.data || []
    
    records.value = data
    growthRecords.value = growthRes?.data || []
  } finally {
    loading.value = false
  }
}

function openBudidaya(budidaya) {
  router.push({
    name: 'petugas-jamur',
    query: { budidaya: budidaya.id_budidaya }
  })
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getPhaseClass(phase) {
  const p = (phase || '').toLowerCase()
  if (p.includes('inkubasi')) return 'inkubasi'
  if (p.includes('pinhead')) return 'pinhead'
  if (p.includes('pembesaran')) return 'pembesaran'
  if (p.includes('panen')) return 'panen'
  return 'default'
}

onMounted(async () => {
  await Promise.all([loadOptions(), loadFiltered()])
})
</script>

<style scoped>
.page-header-modern { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; }
.header-text h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
.page-description { margin: 4px 0 0; color: #6b7280; font-size: 14px; }
.header-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-box { position: relative; display: flex; align-items: center; }

.modern-input, .modern-select {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: #f9fafb;
  transition: all 0.2s;
  box-sizing: border-box;
}
.modern-input:focus, .modern-select:focus { outline: none; border-color: #16a34a; background: white; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }

.btn-primary {
  background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
}
.btn-primary:hover { background: #15803d; }

.rack-page { display: flex; flex-direction: column; gap: 32px; padding-bottom: 40px; }

.page-header { 
  display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; flex-wrap: wrap; 
  padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;
}
.page-header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
.page-header p { margin: 8px 0 0; color: #6b7280; font-size: 15px; }

.filters { display: flex; gap: 12px; flex-wrap: wrap; }
.control { min-height: 44px; padding: 10px 16px; border: 1px solid #d1d5db; border-radius: 10px; background: white; font-size: 14px; transition: all 0.2s; outline: none; }
.control:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.btn { background: #16a34a; color: white; border: none; border-radius: 10px; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn:hover { background: #15803d; }

.empty { 
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: white; border: 1px dashed #d1d5db; border-radius: 16px; padding: 64px 20px; text-align: center; 
}
.empty h3 { color: #111827; margin: 16px 0 8px; font-size: 18px; }
.empty p { color: #6b7280; margin: 0; }
.icon-empty { width: 48px; height: 48px; color: #9ca3af; }

.loader-spinner { width: 40px; height: 40px; border: 3px solid #f3f4f6; border-top-color: #16a34a; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

.content-wrapper { display: flex; flex-direction: column; gap: 40px; }

.location-section { display: flex; flex-direction: column; gap: 20px; }
.location-heading { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 2px solid #f3f4f6; }
.heading-left { display: flex; align-items: center; gap: 16px; }
.icon-location { width: 32px; height: 32px; color: #16a34a; background: #dcfce7; padding: 6px; border-radius: 10px; }
.location-heading h2 { margin: 0 0 4px 0; font-size: 22px; font-weight: 700; color: #1f2937; }
.location-heading span { color: #6b7280; font-size: 14px; font-weight: 500; }

.budidaya-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

.budidaya-card { 
  background: white; border: 1px solid #e5e7eb; border-radius: 16px; 
  display: flex; flex-direction: column; overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02);
}
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04); border-color: #d1d5db; }

.card-header { 
  padding: 16px 20px; border-bottom: 1px solid #f3f4f6; background: #fafafa;
  display: flex; justify-content: space-between; align-items: center; 
}
.badge-group { display: flex; gap: 8px; align-items: center; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
.badge-id { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }
.status-badge { text-transform: uppercase; letter-spacing: 0.5px; }
.status-badge.aktif { background: #dcfce7; color: #166534; }
.status-badge.selesai { background: #e5e7eb; color: #4b5563; }
.age-badge { font-size: 12px; font-weight: 600; color: #d97706; background: #fef3c7; padding: 4px 10px; border-radius: 20px; }

.card-body { padding: 20px; flex: 1; }
.jamur-name { margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #111827; }

.phase-container { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
.phase-label { font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.phase-badge { 
  display: inline-flex; padding: 6px 12px; border-radius: 8px; font-size: 14px; font-weight: 700; width: max-content;
}
.phase-badge.inkubasi { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.phase-badge.pinhead { background: #fdf4ff; color: #a21caf; border: 1px solid #f5d0fe; }
.phase-badge.pembesaran { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
.phase-badge.panen { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
.phase-badge.default { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }

.info-list { display: flex; flex-direction: column; gap: 10px; }
.info-row { display: flex; align-items: center; gap: 10px; color: #4b5563; font-size: 14px; font-weight: 500; }
.info-row svg { width: 18px; height: 18px; color: #9ca3af; }

.card-footer { padding: 16px 20px; background: white; border-top: 1px solid #f3f4f6; }
.btn-manage { 
  width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;
  background: #16a34a; color: white; border: none; padding: 12px; border-radius: 10px; 
  font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s;
}
.btn-manage:hover:not(:disabled) { background: #15803d; }
.btn-manage:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }

.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 640px) { 
  .filters { flex-direction: column; }
  .control, .btn { width: 100%; }
}
</style>
