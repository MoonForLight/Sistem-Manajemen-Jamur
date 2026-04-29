<template>
  <div class="public-page fade-in">
    <div class="public-container" v-if="loading">
      <div class="empty-state">Memuat detail lokasi...</div>
    </div>

    <div class="public-container" v-else-if="!lokasi">
      <div class="empty-state">
        <p>Lokasi tidak ditemukan atau tidak tersedia untuk publik.</p>
        <RouterLink class="btn-primary mt-4 inline-block" to="/data">← Kembali ke Data Publik</RouterLink>
      </div>
    </div>

    <div class="public-container" v-else>
      <!-- Header -->
      <header class="page-header-modern">
        <div class="header-text">
          <RouterLink to="/data" class="back-link">← Kembali</RouterLink>
          <h1>{{ lokasi.nama_lokasi }}</h1>
          <p class="page-description">{{ lokasi.alamat }} • {{ activeBudidaya.length }} Rak Aktif</p>
        </div>
        <div class="header-actions">
          <input v-model="selectedMonth" type="month" class="modern-input" @change="processData" />
        </div>
      </header>

      <!-- Insight Bulanan -->
      <div class="insight-box">
        <h3 class="insight-title">💡 Analisis Otomatis: {{ formattedMonth }}</h3>
        <p class="insight-text">{{ aiInsight }}</p>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">Rata-rata Suhu</span>
          <span class="stat-value" :class="getSuhuColorClass(avgSuhu)">{{ avgSuhu }}°C</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Rata-rata Kelembapan</span>
          <span class="stat-value text-blue">{{ avgKelembapan }}%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Panen</span>
          <span class="stat-value text-green">{{ totalPanen }} Kg</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Status Lokasi</span>
          <span class="stat-value" :class="activeBudidaya.length > 0 ? 'text-green' : 'text-muted'">
            {{ activeBudidaya.length > 0 ? 'Aktif' : 'Non-Aktif' }}
          </span>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-container">
        <div class="chart-box">
          <h4>Tren Suhu & Kelembapan Harian</h4>
          <div class="chart-wrapper">
            <Line :data="envChartData" :options="chartOptions" />
          </div>
        </div>
        <div class="chart-box">
          <h4>Akumulasi Panen Harian</h4>
          <div class="chart-wrapper">
            <Bar :data="harvestChartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Table content -->
      <div class="table-card-modern mt-24">
        <h4 class="table-title">Daftar Budidaya (Rak)</h4>
        <div class="table-header-modern laporan-grid">
          <span>Kode</span>
          <span>Jenis Jamur</span>
          <span>Status</span>
          <span>Tanggal Mulai</span>
          <span>Tanggal Selesai</span>
        </div>

        <div v-if="budidayaList.length === 0" class="table-row-modern laporan-grid empty-row">
          <span class="full-span">Belum ada budidaya yang tercatat di lokasi ini.</span>
        </div>

        <div v-for="b in budidayaList" :key="b.id_budidaya" class="table-row-modern laporan-grid has-divider">
          <span class="fw-700 hitam">BDY-{{ String(b.id_budidaya).padStart(3, '0') }}</span>
          <span class="hitam">{{ b.nama_jamur || '-' }}</span>
          <span>
            <span :class="b.status === 'aktif' ? 'badge-success' : 'badge-secondary'">
              {{ b.status === 'aktif' ? 'Aktif' : 'Selesai' }}
            </span>
          </span>
          <span class="text-muted">{{ formatDate(b.tanggal_mulai) }}</span>
          <span class="text-muted">{{ formatDate(b.tanggal_selesai) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement)

const props = defineProps({ lokasiId: { type: String, required: true } })

const loading = ref(true)
const lokasi = ref(null)
const budidayaList = ref([])
const activeBudidaya = ref([])

const allGrowthRecords = ref([])
const allHarvestRecords = ref([])
const monthlyRecords = ref([])
const monthlyHarvestRecords = ref([])

// Default to current month YYYY-MM
const today = new Date()
const currentYm = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
const selectedMonth = ref(currentYm)

const formattedMonth = computed(() => {
  if (!selectedMonth.value) return '-'
  const [year, month] = selectedMonth.value.split('-')
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
})

// Stats
const avgSuhu = ref(0)
const avgKelembapan = ref(0)
const totalPanen = ref(0)
const aiInsight = ref('')

// Chart Data
const envChartData = ref({ labels: [], datasets: [] })
const harvestChartData = ref({ labels: [], datasets: [] })
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { font: { family: 'Inter' } } } },
  scales: { y: { beginAtZero: true }, x: { ticks: { font: { family: 'Inter' } } } }
}

function processData() {
  if (!selectedMonth.value || !lokasi.value) return

  const ym = selectedMonth.value

  // Filter records
  monthlyRecords.value = allGrowthRecords.value.filter(item => item.tanggal_pengamatan?.startsWith(ym))
    .sort((a, b) => new Date(a.tanggal_pengamatan) - new Date(b.tanggal_pengamatan))
    
  monthlyHarvestRecords.value = allHarvestRecords.value.filter(item => item.tanggal_panen?.startsWith(ym))
    .sort((a, b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen))

  // Calculate Averages
  if (monthlyRecords.value.length > 0) {
    const sumSuhu = monthlyRecords.value.reduce((acc, curr) => acc + (Number(curr.suhu) || 0), 0)
    const sumKelembapan = monthlyRecords.value.reduce((acc, curr) => acc + (Number(curr.kelembaban) || 0), 0)
    avgSuhu.value = (sumSuhu / monthlyRecords.value.length).toFixed(1)
    avgKelembapan.value = (sumKelembapan / monthlyRecords.value.length).toFixed(1)
  } else {
    avgSuhu.value = 0
    avgKelembapan.value = 0
  }

  // Calculate Panen
  totalPanen.value = monthlyHarvestRecords.value.reduce((acc, curr) => acc + (Number(curr.jumlah_panen) || 0), 0).toFixed(1)

  // Generate Insight
  if (monthlyRecords.value.length === 0) {
    aiInsight.value = "Belum ada data monitoring yang direkam untuk lokasi ini pada bulan terpilih."
  } else {
    let insight = `Lokasi ini memiliki ${monthlyRecords.value.length} pencatatan lingkungan bulan ini. `
    if (avgSuhu.value > 28) insight += "Suhu rata-rata cukup tinggi (>28°C), sirkulasi udara perlu diperhatikan. "
    else if (avgSuhu.value < 20) insight += "Suhu rata-rata cenderung dingin (<20°C). "
    else insight += "Suhu lingkungan berada dalam batas optimal. "

    if (avgKelembapan.value < 70) insight += "Kelembapan relatif rendah. "
    else insight += "Kelembapan terjaga dengan baik. "

    if (totalPanen.value > 0) insight += `Total hasil panen yang dilaporkan mencapai ${totalPanen.value} Kg.`
    else insight += "Belum ada aktivitas panen yang tercatat bulan ini."
    
    aiInsight.value = insight
  }

  // Prepare Charts Data
  const daysInMonth = new Date(ym.split('-')[0], ym.split('-')[1], 0).getDate()
  const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1))

  // Daily Averages
  const dailySuhu = Array(daysInMonth).fill(null)
  const dailyKelembapan = Array(daysInMonth).fill(null)
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0')
    const dateStr = `${ym}-${dayStr}`
    
    const dayRecs = monthlyRecords.value.filter(r => r.tanggal_pengamatan?.startsWith(dateStr))
    if (dayRecs.length > 0) {
      dailySuhu[i-1] = dayRecs.reduce((s, r) => s + Number(r.suhu || 0), 0) / dayRecs.length
      dailyKelembapan[i-1] = dayRecs.reduce((s, r) => s + Number(r.kelembaban || 0), 0) / dayRecs.length
    }
  }

  envChartData.value = {
    labels,
    datasets: [
      { label: 'Suhu (°C)', borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.1)', data: dailySuhu, tension: 0.3, spanGaps: true },
      { label: 'Kelembapan (%)', borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', data: dailyKelembapan, tension: 0.3, spanGaps: true }
    ]
  }

  // Daily Harvest
  const dailyHarvest = Array(daysInMonth).fill(0)
  monthlyHarvestRecords.value.forEach(r => {
    const dStr = r.tanggal_panen
    if (dStr) {
      const dayIndex = parseInt(dStr.split('-')[2], 10) - 1
      dailyHarvest[dayIndex] += Number(r.jumlah_panen) || 0
    }
  })

  harvestChartData.value = {
    labels,
    datasets: [{ label: 'Hasil Panen (Kg)', backgroundColor: '#16a34a', data: dailyHarvest, borderRadius: 4 }]
  }
}

async function loadData() {
  loading.value = true
  try {
    const locIdStr = String(props.lokasiId)
    const response = await fetch(`/api/public/monitoring?id=${locIdStr}`)
    const payload = await response.json()

    if (payload?.success && payload.data) {
      lokasi.value = payload.data.lokasi
      
      const allBudidaya = payload.data.budidaya || []
      budidayaList.value = allBudidaya.map(b => ({
        ...b,
        nama_jamur: b.nama_jamur || 'Jamur'
      }))

      activeBudidaya.value = budidayaList.value.filter(b => b.status === 'aktif')

      allGrowthRecords.value = payload.data.pertumbuhan || []
      allHarvestRecords.value = payload.data.panen || []

      processData()
    } else {
      lokasi.value = null
    }
  } catch (err) {
    console.error(err)
    lokasi.value = null
  } finally {
    loading.value = false
  }
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getSuhuColorClass(val) {
  if (val > 28 || val < 18) return 'text-red'
  return 'text-green'
}

onMounted(loadData)
</script>

<style scoped>
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.public-page { background: #f9fafb; min-height: 100vh; padding: 40px 20px; font-family: 'Inter', sans-serif; }
.public-container { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }

.empty-state { background: white; padding: 60px 20px; text-align: center; border-radius: 16px; border: 1px solid #e5e7eb; color: #6b7280; font-weight: 500; }

.page-header-modern { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; background: white; padding: 24px; border-radius: 16px; border: 1px solid #e5e7eb; }
.header-text h1 { margin: 12px 0 4px 0; font-size: 24px; font-weight: 800; color: #111827; }
.page-description { margin: 0; color: #6b7280; font-size: 14px; font-weight: 500; }
.back-link { font-size: 13px; font-weight: 700; color: #3b82f6; text-decoration: none; }
.back-link:hover { text-decoration: underline; }

.modern-input { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; }
.btn-primary { background: #111827; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block; }

.insight-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 20px 24px; }
.insight-title { margin: 0 0 8px 0; color: #16a34a; font-size: 16px; font-weight: 800; }
.insight-text { margin: 0; color: #15803d; font-size: 15px; line-height: 1.5; font-weight: 500; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.stat-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; }
.stat-label { display: block; font-size: 12px; color: #6b7280; margin-bottom: 8px; font-weight: 700; text-transform: uppercase; }
.stat-value { font-size: 28px; font-weight: 800; color: #111827; }
.text-green { color: #16a34a; }
.text-blue { color: #2563eb; }
.text-red { color: #dc2626; }
.text-muted { color: #9ca3af; }

.charts-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.chart-box { background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; }
.chart-box h4 { margin: 0 0 16px 0; font-size: 15px; color: #111827; font-weight: 700; }
.chart-wrapper { height: 250px; position: relative; }

.table-card-modern { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; }
.table-title { margin: 0; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; font-size: 16px; color: #111827; font-weight: 800; }
.mt-24 { margin-top: 24px; }
.laporan-grid { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr; gap: 16px; align-items: center; padding: 16px 24px; font-size: 14px; }
.table-header-modern { background: #f9fafb; font-weight: 700; color: #4b5563; border-bottom: 1px solid #e5e7eb; text-transform: uppercase; font-size: 12px; }
.has-divider { border-top: 1px solid #f3f4f6; }
.empty-row { display: block; padding: 48px; text-align: center; color: #6b7280; }
.full-span { display: block; grid-column: 1 / -1; }
.hitam { color: #111827; font-weight: 600; }
.fw-700 { font-weight: 700; }

.badge-success { background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; display: inline-block; }
.badge-secondary { background: #f3f4f6; color: #6b7280; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; display: inline-block; }

@media(max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .charts-container { grid-template-columns: 1fr; }
}
@media(max-width: 640px) {
  .stats-row { grid-template-columns: 1fr; }
  .laporan-grid { grid-template-columns: 1fr 1fr; }
  .laporan-grid span:nth-child(n+3) { display: none; }
}
</style>