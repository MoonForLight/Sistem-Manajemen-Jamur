<template>
  <div class="dashboard-content fade-in">
    <!-- Top Stats Row -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue-light"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 12h3v8h14v-8h3L12 2zm0 2.83l5.17 5.17H17V18H7v-8H6.83L12 4.83z"/></svg></div>
        <div class="stat-info">
          <span class="stat-label">Total Rumah Jamur</span>
          <span class="stat-value">{{ stats.lokasi }} <span class="stat-sub">Lokasi</span></span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-green-light"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></div>
        <div class="stat-info">
          <span class="stat-label">Total Petugas</span>
          <span class="stat-value">{{ stats.petugas }} <span class="stat-sub">Orang</span></span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-yellow-light"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v7h4v-2zm4 4H8v-2h8v2z"/></svg></div>
        <div class="stat-info">
          <span class="stat-label">Panen Bulan Ini</span>
          <span class="stat-value">{{ stats.panenBulanIni }} <span class="stat-sub">Kg</span></span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-purple-light"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2C6.5,2,2,6.5,2,12 c0,3.3,1.6,6.3,4,8.1V22h12v-1.9c2.4-1.8,4-4.8,4-8.1C22,6.5,17.5,2,12,2z M12,4c4.4,0,8,3.6,8,8h-3c0-2.8-2.2-5-5-5S7,9.2,7,12H4 C4,7.6,7.6,4,12,4z M10,14h4v6h-4V14z"/></svg></div>
        <div class="stat-info">
          <span class="stat-label">Siklus Aktif</span>
          <span class="stat-value">{{ stats.budidayaAktif }} <span class="stat-sub">Rak</span></span>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="main-grid mt-24">
      
      <!-- Left Column: Global Trend -->
      <div class="left-col">
        <div class="panel h-full flex-col">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Tren Lingkungan Global (7 Hari)</h3>
              <p class="panel-subtitle">Rata-rata suhu & kelembapan dari seluruh rumah jamur aktif</p>
            </div>
          </div>
          <div class="chart-container flex-grow">
            <Line v-if="!isLoading" :data="suhuChartData" :options="chartOptions" />
            <div v-else class="loading-state">Memuat Grafik...</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Distribution & Composition -->
      <div class="right-col">
        <div class="panel h-full flex-col">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Komposisi Budidaya Aktif</h3>
              <p class="panel-subtitle">Distribusi jenis jamur di semua lokasi</p>
            </div>
          </div>
          <div class="chart-container-pie flex-grow">
            <Doughnut v-if="!isLoading && stats.budidayaAktif > 0" :data="jenisChartData" :options="pieOptions" />
            <div v-else-if="!isLoading" class="empty-state">Belum ada budidaya aktif</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Grid -->
    <div class="bottom-grid mt-24">
      <!-- Daftar Lokasi Operasional -->
      <div class="panel">
        <div class="panel-header flex-between">
          <div>
            <h3 class="panel-title">Status Operasional Lokasi</h3>
            <p class="panel-subtitle">Pantauan kondisi per rumah jamur</p>
          </div>
          <RouterLink to="/admin/lokasi" class="btn-link">Lihat Semua →</RouterLink>
        </div>
        
        <div class="location-list">
          <div v-if="isLoading" class="loading-state py-4">Memuat data lokasi...</div>
          <div v-else-if="locationStats.length === 0" class="empty-state py-4">Belum ada lokasi yang ditambahkan.</div>
          
          <div v-for="loc in locationStats" :key="loc.id_lokasi" class="location-item">
            <div class="loc-main">
              <div class="loc-icon">🏡</div>
              <div class="loc-details">
                <span class="loc-name">{{ loc.nama_lokasi }}</span>
                <span class="loc-sub">{{ loc.aktifCount }} Rak Aktif</span>
              </div>
            </div>
            
            <div class="loc-metrics" v-if="loc.aktifCount > 0">
              <div class="metric-mini">
                <span class="m-val" :class="getSuhuColor(loc.avgSuhu)">{{ loc.avgSuhu || '--' }}°C</span>
                <span class="m-lbl">Suhu Avg</span>
              </div>
              <div class="metric-mini">
                <span class="m-val text-blue">{{ loc.avgKelembaban || '--' }}%</span>
                <span class="m-lbl">Kelembapan</span>
              </div>
            </div>
            <div class="loc-metrics" v-else>
              <span class="badge-inactive">Tidak Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Aktivitas / Log Terbaru -->
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Log Aktivitas Terbaru</h3>
          <p class="panel-subtitle">Catatan petugas di lapangan</p>
        </div>
        
        <div class="activity-list">
          <div v-if="isLoading" class="loading-state py-4">Memuat aktivitas...</div>
          <div v-else-if="recentActivities.length === 0" class="empty-state py-4">Belum ada aktivitas tercatat.</div>
          
          <div v-for="act in recentActivities" :key="act.id" class="activity-item">
            <div class="act-icon" :class="act.type === 'panen' ? 'bg-green-light' : 'bg-blue-light'">
              {{ act.icon }}
            </div>
            <div class="act-info">
              <span class="act-title">{{ act.title }}</span>
              <span class="act-desc">{{ act.desc }}</span>
              <span class="act-time">{{ act.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { lokasiService, budidayaService, jenisJamurService, mediaTanamService, usersService, pertumbuhanService, panenService } from '../../services/dataService.js'

import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler, ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler, ArcElement)

const isLoading = ref(true)

const stats = ref({ lokasi: 0, petugas: 0, jenis: 0, media: 0, budidayaAktif: 0, panenBulanIni: 0 })
const locations = ref([])
const budidayaList = ref([])
const growthRecords = ref([])
const harvestRecords = ref([])

const today = new Date().toISOString().slice(0, 10)
const currentMonth = today.slice(0, 7)

// Computations
const locationStats = computed(() => {
  return locations.value.slice(0, 5).map(loc => {
    // Find active budidaya in this location
    const actives = budidayaList.value.filter(b => b.id_lokasi === loc.id_lokasi && b.status === 'aktif')
    
    // Find latest env records for these actives
    let sumSuhu = 0, sumKelembaban = 0, countEnv = 0
    actives.forEach(b => {
      const records = growthRecords.value.filter(g => g.id_budidaya === b.id_budidaya && g.suhu !== null && g.suhu !== undefined)
      records.sort((x, y) => new Date(y.tanggal_pengamatan) - new Date(x.tanggal_pengamatan))
      if (records.length > 0) {
        sumSuhu += Number(records[0].suhu)
        sumKelembaban += Number(records[0].kelembaban)
        countEnv++
      }
    })

    return {
      ...loc,
      aktifCount: actives.length,
      avgSuhu: countEnv > 0 ? (sumSuhu / countEnv).toFixed(1) : null,
      avgKelembaban: countEnv > 0 ? (sumKelembaban / countEnv).toFixed(1) : null
    }
  })
})

const recentActivities = computed(() => {
  const merged = [
    ...growthRecords.value.map(item => ({ 
      id: `g-${item.id_pertumbuhan}`, 
      type: 'pengamatan',
      title: `Pengamatan Lingkungan & Fase`,
      desc: `BDY-${String(item.id_budidaya).padStart(3, '0')} ${item.fase ? `Fase: ${item.fase}` : ''}`,
      time: formatDate(item.tanggal_pengamatan), 
      icon: '📝', 
      timestamp: item.tanggal_pengamatan 
    })),
    ...harvestRecords.value.map(item => ({ 
      id: `p-${item.id_panen}`, 
      type: 'panen',
      title: `Panen ${item.jumlah_panen} Kg`,
      desc: `BDY-${String(item.id_budidaya).padStart(3, '0')} - Hasil Panen Bersih`,
      time: formatDate(item.tanggal_panen), 
      icon: '📦', 
      timestamp: item.tanggal_panen 
    })),
  ]
  return merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
})

const jenisChartData = computed(() => {
  const counts = {}
  const actives = budidayaList.value.filter(b => b.status === 'aktif')
  actives.forEach(item => { counts[item.nama_jamur || 'Umum'] = (counts[item.nama_jamur || 'Umum'] || 0) + 1 })
  return {
    labels: Object.keys(counts),
    datasets: [{ data: Object.values(counts), backgroundColor: ['#16a34a', '#3b82f6', '#eab308', '#f97316', '#a855f7'], borderWidth: 0 }]
  }
})

const suhuChartData = computed(() => {
  const labels = [], suhuDataList = [], kelembapanDataList = []
  for(let i=6; i>=0; i--) {
     const d = new Date(); d.setDate(d.getDate() - i)
     labels.push(d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }))
     const recs = growthRecords.value.filter(item => item.tanggal_pengamatan?.startsWith(d.toISOString().slice(0, 10)))
     
     const suhuRecs = recs.filter(item => item.suhu !== null && item.suhu !== undefined && item.suhu !== '')
     const humidRecs = recs.filter(item => item.kelembaban !== null && item.kelembaban !== undefined && item.kelembaban !== '')

     if (suhuRecs.length > 0) {
       suhuDataList.push(Math.round(suhuRecs.reduce((s, item) => s + Number(item.suhu), 0) / suhuRecs.length))
     } else {
       suhuDataList.push(null)
     }

     if (humidRecs.length > 0) {
       kelembapanDataList.push(Math.round(humidRecs.reduce((s, item) => s + Number(item.kelembaban), 0) / humidRecs.length))
     } else {
       kelembapanDataList.push(null)
     }
  }
  return {
    labels,
    datasets: [
      { label: 'Avg Suhu Global (°C)', borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.1)', data: suhuDataList, fill: true, tension: 0.4, spanGaps: true },
      { label: 'Avg Kelembapan Global (%)', borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', data: kelembapanDataList, fill: true, tension: 0.4, spanGaps: true }
    ]
  }
})

// Chart Configs
const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { font: { family: 'Inter' } } } },
  scales: { y: { beginAtZero: true }, x: { ticks: { font: { family: 'Inter' } }, grid: { display: false } } }
}
const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { family: 'Inter' } } } }, cutout: '70%' }

// Helpers
function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
function getSuhuColor(val) {
  if (!val) return 'text-muted'
  if (val > 28 || val < 18) return 'text-red'
  return 'text-green'
}

async function loadDashboard() {
  isLoading.value = true
  try {
    const [lokasiRes, jenisRes, petugasRes, budidayaRes, growthRes, panenRes] = await Promise.all([
      lokasiService.getAll(),
      jenisJamurService.getAll(),
      usersService.getPetugasList(),
      budidayaService.getAll(),
      pertumbuhanService.getAll(),
      panenService.getAll()
    ])

    if (lokasiRes?.success) { locations.value = lokasiRes.data; stats.value.lokasi = locations.value.length }
    if (jenisRes?.success) stats.value.jenis = jenisRes.data.length
    if (petugasRes?.success) stats.value.petugas = petugasRes.data.length
    
    if (budidayaRes?.success) {
      budidayaList.value = budidayaRes.data
      stats.value.budidayaAktif = budidayaList.value.filter(b => b.status === 'aktif').length
    }
    if (growthRes?.success) growthRecords.value = growthRes.data
    if (panenRes?.success) {
      harvestRecords.value = panenRes.data
      stats.value.panenBulanIni = harvestRecords.value
        .filter(p => p.tanggal_panen?.startsWith(currentMonth))
        .reduce((acc, curr) => acc + (Number(curr.jumlah_panen) || 0), 0)
        .toFixed(1)
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
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.dashboard-content { display: flex; flex-direction: column; }

/* Stats Row */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.stat-card { background: white; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-2px); border-color: #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon svg { width: 28px; height: 28px; }

.bg-blue-light { background: #eff6ff; color: #2563eb; }
.bg-green-light { background: #f0fdf4; color: #16a34a; }
.bg-yellow-light { background: #fffbeb; color: #d97706; }
.bg-purple-light { background: #f3e8ff; color: #9333ea; }

.stat-info { display: flex; flex-direction: column; }
.stat-label { font-size: 13px; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-value { font-size: 28px; font-weight: 800; color: #111827; display: flex; align-items: baseline; gap: 6px; }
.stat-sub { font-size: 14px; font-weight: 600; color: #9ca3af; text-transform: none; letter-spacing: normal; }

/* Grids */
.mt-24 { margin-top: 24px; }
.main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

/* Panels */
.panel { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; }
.h-full { height: 100%; }
.flex-col { display: flex; flex-direction: column; }
.flex-grow { flex-grow: 1; }
.flex-between { display: flex; justify-content: space-between; align-items: flex-start; }

.panel-header { margin-bottom: 20px; }
.panel-title { margin: 0 0 4px 0; font-size: 18px; font-weight: 800; color: #111827; }
.panel-subtitle { margin: 0; font-size: 14px; color: #6b7280; font-weight: 500; }
.btn-link { font-size: 13px; font-weight: 700; color: #2563eb; text-decoration: none; padding: 6px 12px; background: #eff6ff; border-radius: 6px; transition: all 0.2s; }
.btn-link:hover { background: #dbeafe; }

.chart-container { height: 300px; position: relative; width: 100%; }
.chart-container-pie { height: 260px; position: relative; width: 100%; display: flex; justify-content: center; }

/* Locations List */
.location-list { display: flex; flex-direction: column; gap: 12px; }
.location-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6; background: #fafbfc; transition: all 0.2s; }
.location-item:hover { background: white; border-color: #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }

.loc-main { display: flex; gap: 16px; align-items: center; }
.loc-icon { font-size: 24px; background: white; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid #f3f4f6; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
.loc-details { display: flex; flex-direction: column; gap: 4px; }
.loc-name { font-weight: 800; font-size: 15px; color: #111827; }
.loc-sub { font-size: 13px; color: #16a34a; font-weight: 600; }

.loc-metrics { display: flex; gap: 24px; }
.metric-mini { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.m-val { font-size: 15px; font-weight: 800; }
.m-lbl { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }

.badge-inactive { font-size: 12px; font-weight: 700; color: #9ca3af; background: #f3f4f6; padding: 6px 12px; border-radius: 999px; }

/* Activities List */
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-item { display: flex; gap: 16px; align-items: center; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6; background: white; }
.act-icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 18px; flex-shrink: 0; }
.act-info { display: flex; flex-direction: column; gap: 2px; }
.act-title { font-weight: 700; font-size: 14px; color: #111827; }
.act-desc { font-size: 13px; color: #6b7280; font-weight: 500; }
.act-time { font-size: 11px; font-weight: 600; color: #9ca3af; margin-top: 4px; }

/* Utilities */
.py-4 { padding-top: 16px; padding-bottom: 16px; }
.empty-state { text-align: center; color: #9ca3af; font-weight: 500; font-style: italic; }
.loading-state { text-align: center; color: #6b7280; font-weight: 600; animation: pulse 2s infinite; }
.text-blue { color: #2563eb; }
.text-green { color: #16a34a; }
.text-red { color: #dc2626; }

@media(max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .main-grid { grid-template-columns: 1fr; }
  .bottom-grid { grid-template-columns: 1fr; }
}
@media(max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
  .loc-metrics { display: none; /* Hide metrics on very small screens to prevent overflow */ }
}
</style>
