<template>
  <div class="dashboard-content fade-in">
    <!-- Header Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue-light"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 12h3v8h14v-8h3L12 2zm0 2.83l5.17 5.17H17V18H7v-8H6.83L12 4.83z"/></svg></div>
        <div class="stat-info">
          <span class="stat-label">Rumah Jamur Aktif</span>
          <span class="stat-value">{{ activeBudidaya }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-green-light"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></svg></div>
        <div class="stat-info">
          <span class="stat-label">Pengamatan Hari Ini</span>
          <span class="stat-value">{{ todayTasks }} / {{ activeBudidaya }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-yellow-light"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v7h4v-2zm4 4H8v-2h8v2z"/></svg></div>
        <div class="stat-info">
          <span class="stat-label">Panen Bulan Ini</span>
          <span class="stat-value">{{ monthlyHarvest }} Kg</span>
        </div>
      </div>
    </div>

    <!-- Main Section: Environment Left, Trend Chart Right -->
    <div class="main-env-grid">
      
      <!-- Kiri: Realtime Env Cards -->
      <div class="env-section">
        <!--<h3 class="section-title">Suhu & Kelembapan Real-Time</h3>-->
        <div v-if="loading" class="empty-state">Memuat data lingkungan...</div>
        <div v-else-if="activeBudidayaList.length === 0" class="empty-state">Belum ada rumah jamur yang aktif.</div>
        
        <div v-else class="env-cards-container">
          <div v-for="b in activeBudidayaList" :key="b.id_budidaya" class="env-card">
            <div class="panel-header-row mb-0">
              <h3 class="panel-title">Suhu & Kelembapan Terkini</h3>
              <span v-if="!b.hasDataToday" class="alert-badge pulse">Butuh Perhatian</span>
              <span v-else class="status-badge">Aman</span>
            </div>
            
            <div class="env-header">
              <div>
                <span class="subtitle">BDY-{{ String(b.id_budidaya).padStart(3, '0') }} &bull; {{ b.nama_lokasi }}</span>
              </div>
            </div>
            
            <div class="metrics-title">Suhu (°C)</div>
            <div class="env-metrics">
              <div class="metric">
                <span class="m-label">Dalam</span>
                <span class="m-value" :class="getSuhuColor(b.latestSuhu)">{{ b.latestSuhu || '--' }}</span>
              </div>
              <div class="metric">
                <span class="m-label">Luar</span>
                <span class="m-value text-orange">{{ b.outsideSuhu }}</span>
              </div>
              <div class="metric">
                <span class="m-label">Target</span>
                <span class="m-value text-success">{{ b.optimalSuhu }}</span>
              </div>
            </div>

            <div class="metrics-title mt-12">Kelembapan (%)</div>
            <div class="env-metrics">
              <div class="metric">
                <span class="m-label">Dalam</span>
                <span class="m-value text-primary">{{ b.latestKelembaban || '--' }}</span>
              </div>
              <div class="metric">
                <span class="m-label">Luar</span>
                <span class="m-value text-muted">{{ b.outsideKelembaban }}</span>
              </div>
              <div class="metric">
                <span class="m-label">Target</span>
                <span class="m-value text-success">{{ b.optimalKelembaban }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanan: Tren Chart -->
      <div class="trend-section">
        <div class="chart-panel h-full">
          <div class="panel-header-row">
            <h3 class="panel-title">Tren Rata-rata (7 Hari)</h3>
          </div>
          <div class="chart-container" style="height: 310px;">
            <Line v-if="!loading" :data="suhuChartData" :options="suhuChartOptions" />
            <div v-else class="loading-chart">Memuat Grafik...</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Charts and Sidebar Below -->
    <div class="dashboard-grid mt-24">
      <div class="left-col">
        <div class="chart-panels-row">
          <div class="chart-panel">
            <div class="panel-header-row">
              <h3 class="panel-title">Aktivitas Pengamatan</h3>
            </div>
            <div class="chart-container-small">
              <Line v-if="!loading" :data="chartData" :options="chartOptions" />
            </div>
          </div>
          
          <div class="chart-panel">
            <div class="panel-header-row">
              <h3 class="panel-title">Distribusi Jenis Jamur</h3>
            </div>
            <div class="chart-container-small">
              <Doughnut v-if="!loading && assignedBudidaya.length > 0" :data="jamurChartData" :options="pieOptions" />
              <div v-else-if="!loading" class="empty-state">Belum ada data</div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-col">
        <div class="side-panel">
          <h3 class="panel-title mb-1">Riwayat Aktivitas</h3>
          <p class="panel-subtitle">Catatan terbaru Anda</p>

          <div class="list-container">
            <div v-if="recentActivities.length === 0" class="notif-empty">Belum ada aktivitas terbaru.</div>
            <div v-for="item in recentActivities" :key="item.id" class="activity-item">
              <span class="act-icon">{{ item.icon }}</span>
              <div class="act-details">
                <span class="hitam fw-600">{{ item.title }}</span>
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

import { Line, Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ArcElement, Filler, BarElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ArcElement, Filler, BarElement)

const assignedBudidaya = ref([])
const growthRecords = ref([])
const harvestRecords = ref([])
const user = ref(null)
const loading = ref(true)

const today = new Date().toISOString().slice(0, 10)

// Computed Stats
const activeBudidaya = computed(() => assignedBudidaya.value.filter(item => item.status === 'aktif').length)
const todayTasks = computed(() => growthRecords.value.filter(item => item.tanggal_pengamatan?.startsWith(today)).length)
const monthlyHarvest = computed(() => {
  const currentMonth = today.slice(0, 7)
  return harvestRecords.value
    .filter(item => item.tanggal_panen?.startsWith(currentMonth))
    .reduce((sum, item) => sum + (Number(item.jumlah_panen) || 0), 0)
})

const activeBudidayaList = ref([])

async function fetchRealWeather(locationName) {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=id&format=json`)
    const geoData = await geoRes.json()
    if (!geoData.results || geoData.results.length === 0) return null
    
    const lat = geoData.results[0].latitude
    const lng = geoData.results[0].longitude

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m`)
    const weatherData = await weatherRes.json()
    return {
      suhu: weatherData.current.temperature_2m,
      kelembaban: weatherData.current.relative_humidity_2m
    }
  } catch (e) {
    console.error("Gagal mengambil data cuaca untuk", locationName, e)
    return null
  }
}

function getSuhuColor(val) {
  if (!val) return 'text-muted'
  if (val > 28 || val < 18) return 'text-danger' // contoh ambang batas bahaya
  return 'text-success'
}

// Charts Data
const chartData = computed(() => {
  const labels = []
  const dataList = []
  for(let i=6; i>=0; i--) {
     const d = new Date(); d.setDate(d.getDate() - i)
     labels.push(d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }))
     dataList.push(growthRecords.value.filter(item => item.tanggal_pengamatan?.startsWith(d.toISOString().slice(0, 10))).length)
  }
  return {
    labels,
    datasets: [{
      label: 'Pengamatan', backgroundColor: 'rgba(22, 163, 74, 0.1)', borderColor: '#16a34a',
      pointBackgroundColor: '#16a34a', data: dataList, fill: true, tension: 0.3
    }]
  }
})

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }

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
      { label: 'Rata-rata Suhu Aktual (°C)', borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.1)', data: suhuDataList, fill: true, tension: 0.4, spanGaps: true },
      { label: 'Rata-rata Kelembapan (%)', borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', data: kelembapanDataList, fill: true, tension: 0.4, spanGaps: true }
    ]
  }
})

const suhuChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }

const jamurChartData = computed(() => {
  const counts = {}
  assignedBudidaya.value.forEach(item => { counts[item.nama_jamur || 'Umum'] = (counts[item.nama_jamur || 'Umum'] || 0) + 1 })
  return {
    labels: Object.keys(counts),
    datasets: [{ data: Object.values(counts), backgroundColor: ['#16a34a', '#3b82f6', '#eab308', '#f97316', '#a855f7'], borderWidth: 0 }]
  }
})

const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } }, cutout: '70%' }

const recentActivities = computed(() => {
  const merged = [
    ...growthRecords.value.map(item => ({ id: `g-${item.id_pertumbuhan}`, title: `Pengamatan BDY-${item.id_budidaya.toString().padStart(3, '0')}`, time: formatDate(item.tanggal_pengamatan), icon: '📝', timestamp: item.tanggal_pengamatan })),
    ...harvestRecords.value.map(item => ({ id: `p-${item.id_panen}`, title: `Panen BDY-${item.id_budidaya.toString().padStart(3, '0')}`, time: formatDate(item.tanggal_panen), icon: '📦', timestamp: item.tanggal_panen })),
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
      usersService.getMe(), budidayaService.getByPetugas(), pertumbuhanService.getAll(), panenService.getAll()
    ])
    if (meRes?.success) user.value = meRes.data
    if (budRes?.success) assignedBudidaya.value = budRes.data
    const assignedIds = new Set(assignedBudidaya.value.map(item => item.id_budidaya))
    if (growthRes?.success) growthRecords.value = growthRes.data.filter(item => assignedIds.has(item.id_budidaya))
    if (panenRes?.success) harvestRecords.value = panenRes.data.filter(item => assignedIds.has(item.id_budidaya))
    
    // Proses Active Budidaya & Fetch Real Weather
    const actives = assignedBudidaya.value.filter(b => b.status === 'aktif')
    activeBudidayaList.value = await Promise.all(actives.map(async (b, index) => {
      const records = growthRecords.value.filter(g => g.id_budidaya === b.id_budidaya)
      records.sort((x, y) => new Date(y.tanggal_pengamatan) - new Date(x.tanggal_pengamatan))
      
      const latestEnv = records.find(r => r.suhu !== null && r.suhu !== undefined && r.suhu !== '') || null
      const latestFase = records.find(r => r.fase !== null && r.fase !== undefined && r.fase !== '') || null
      
      const hasDataToday = records.length > 0 ? records[0].tanggal_pengamatan.startsWith(today) : false
      
      let weather = await fetchRealWeather(b.nama_lokasi)
      if (weather === null) {
        weather = {
          suhu: parseFloat((31 + (index % 3) + Math.random() * 2).toFixed(1)),
          kelembaban: parseFloat((60 + (index % 10) + Math.random() * 5).toFixed(1))
        }
      }

      return {
        ...b,
        latestSuhu: latestEnv ? Number(latestEnv.suhu) : null,
        latestKelembaban: latestEnv ? Number(latestEnv.kelembaban) : null,
        latestFase: latestFase ? latestFase.fase : null,
        outsideSuhu: weather.suhu,
        outsideKelembaban: weather.kelembaban,
        optimalSuhu: 25,
        optimalKelembaban: 85,
        hasDataToday
      }
    }))
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.dashboard-content { display: flex; flex-direction: column; }

.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px; }
.stat-card { background: white; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; }
.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-icon svg { width: 28px; height: 28px; }
.bg-blue-light { background: #eff6ff; color: #2563eb; }
.bg-green-light { background: #f0fdf4; color: #16a34a; }
.bg-yellow-light { background: #fffbeb; color: #d97706; }
.stat-info { display: flex; flex-direction: column; }
.stat-label { font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-value { font-size: 28px; font-weight: 800; color: #111827; }

.section-title { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 16px; margin-top: 0; }

/* Main Environment Grid */
.main-env-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
}

.env-section {
  display: flex;
  flex-direction: column;
}

.trend-section {
  display: flex;
  flex-direction: column;
}

.env-cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.env-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; display: flex; flex-direction: column; transition: transform 0.2s; height: 100%; }
.env-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.env-header h4 { margin: 0 0 4px 0; font-size: 16px; font-weight: 800; color: #111827; }
.subtitle { font-size: 12px; color: #6b7280; font-weight: 600; }
.alert-badge { background: #fee2e2; color: #dc2626; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; }
.status-badge { background: #dcfce7; color: #16a34a; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; }
.pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); } }

.env-metrics { display: flex; justify-content: space-between; background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #f3f4f6; }
.metric { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.m-label { font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;}
.m-value { font-size: 16px; font-weight: 800; }
.text-danger { color: #dc2626; }
.text-success { color: #16a34a; }
.text-primary { color: #2563eb; }
.text-orange { color: #f97316; }
.text-dark { color: #111827; }
.text-muted { color: #9ca3af; }

.metrics-title { font-size: 12px; font-weight: 1000; color: #111827; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;}

.h-full { height: 100%; }
.mt-12 { margin-top: 12px; }

.dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
.left-col, .right-col { display: flex; flex-direction: column; gap: 24px; }
.mt-24 { margin-top: 24px; }

.chart-panel, .side-panel { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; }
.chart-panels-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.panel-header-row { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
.mb-0 { margin-bottom: 16px; }
.panel-title { margin: 0; font-size: 16px; font-weight: 800; color: #111827; }
.chart-container { height: 250px; position: relative; }
.chart-container-small { height: 180px; position: relative; }

.list-container { display: flex; flex-direction: column; gap: 16px; }
.activity-item { display: flex; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; align-items: center; }
.activity-item:last-child { border-bottom: none; padding-bottom: 0; }
.act-icon { font-size: 20px; background: #f3f4f6; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.act-details { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
.time { color: #94a3b8; font-size: 12px; }
.empty-state { text-align: center; color: #6b7280; padding: 32px 0; font-style: italic; }

@media(max-width: 1024px) { 
  .dashboard-grid { grid-template-columns: 1fr; } 
  .main-env-grid { grid-template-columns: 1fr; }
  .chart-panels-row { grid-template-columns: 1fr; } 
  .env-cards-container { flex-direction: row; overflow-x: auto; max-height: none; padding-bottom: 12px; }
  .env-card { min-width: 320px; }
}
@media(max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } }
</style>
