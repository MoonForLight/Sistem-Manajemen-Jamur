<template>
  <div class="petugas-page fade-in">
    <!-- Print Only Header -->
    <div class="print-header">
      <h2>Laporan Bulanan Operasional Jamur</h2>
      <p>Bulan Laporan: {{ formattedMonth }}</p>
      <p>Petugas: {{ userName }}</p>
      <hr />
    </div>

    <header class="page-header-modern no-print">
      <div class="header-text">
        <h1>Laporan & Analisis Bulanan</h1>
        <p class="page-description">Pilih periode laporan untuk melihat ringkasan performa dan grafik.</p>
      </div>
      <div class="header-actions">
        <!-- Month Picker -->
        <div class="search-box">
          <input v-model="selectedMonth" type="month" class="modern-input" @change="processMonthlyData" />
        </div>
        <button class="btn-primary" @click="printReport">
          <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 8px; vertical-align: -3px;"><path fill="currentColor" d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
          Cetak PDF
        </button>
      </div>
    </header>

    <div v-if="loading" class="empty-state no-print">Memuat data...</div>

    <div v-else>
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
          <span class="stat-label">Total Pencatatan Lingkungan</span>
          <span class="stat-value">{{ monthlyEnvRecords.length }}</span>
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

      <!-- Table content (Optional: shown only on screen or both) -->
      <div class="table-card-modern mt-24">
        <h4 class="table-title">Rincian Pencatatan Lingkungan Bulan Ini</h4>
        <div class="table-header-modern laporan-grid">
          <span>Budidaya</span>
          <span>Tanggal</span>
          <span>Petugas</span>
          <span>Suhu</span>
          <span>Kelembapan</span>
          <span>Cahaya</span>
        </div>

        <div v-if="monthlyEnvRecords.length === 0" class="table-row-modern laporan-grid empty-row">
          <span class="full-span">Tidak ada pencatatan lingkungan pada bulan ini.</span>
        </div>

        <div v-for="item in monthlyEnvRecords" :key="item.id_lingkungan" class="table-row-modern laporan-grid has-divider">
          <span class="fw-700 hitam">BDY-{{ String(item.id_budidaya).padStart(3, '0') }}</span>
          <span class="text-muted">{{ formatDate(item.tanggal_pengukuran) }}</span>
          <span class="hitam fw-600">{{ item.nama_petugas || '-' }}</span>
          <span><span :class="['badge-tag', getSuhuClass(item.suhu)]">{{ item.suhu ?? '-' }}°C</span></span>
          <span><span :class="['badge-tag', getKelembabanClass(item.kelembaban)]">{{ item.kelembaban ?? '-' }}%</span></span>
          <span class="text-sm">{{ item.intensitas_cahaya ?? '-' }} lux</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usersService, budidayaService, pertumbuhanService, panenService, lingkunganService } from '../../services/dataService.js'

import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement)

const userName = ref('')
const assignedBudidaya = ref([])
const allGrowthRecords = ref([])
const allHarvestRecords = ref([])
const allEnvRecords = ref([])
const monthlyRecords = ref([])
const monthlyHarvestRecords = ref([])
const monthlyEnvRecords = ref([])

const loading = ref(true)

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

function loadHtml2Pdf() {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) return resolve(window.html2pdf);
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => resolve(window.html2pdf);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function printReport() {
  try {
    const html2pdf = await loadHtml2Pdf();
    const element = document.querySelector('.petugas-page');
    
    // Tampilkan header print & Sembunyikan elemen navigasi
    const printHeader = document.querySelector('.print-header');
    if(printHeader) printHeader.style.display = 'block';
    
    const noPrintElements = document.querySelectorAll('.no-print, .petugas-navbar, .app-sidebar');
    noPrintElements.forEach(el => {
      if (el) el.style.display = 'none';
    });

    const opt = {
      margin:       0.4,
      filename:     `Laporan_Petugas_${selectedMonth.value}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 1200 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdf().set(opt).from(element).save();

    // Kembalikan tampilan
    if(printHeader) printHeader.style.display = 'none';
    noPrintElements.forEach(el => {
      if (el) el.style.display = '';
    });

  } catch (error) {
    console.error("Gagal mengekspor PDF:", error);
    alert("Gagal memuat pustaka PDF. Periksa koneksi internet.");
  }
}

function processMonthlyData() {
  if (!selectedMonth.value) return

  const ym = selectedMonth.value // format "YYYY-MM"

  // Filter records
  const getLocalISO = (d) => {
    if (!d) return ''
    if (typeof d === 'string' && d.includes('T')) return d // Already ISO string
    if (typeof d === 'string') return d // "YYYY-MM-DD"
    const date = new Date(d)
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - (offset * 60 * 1000))
    return local.toISOString()
  }

  monthlyRecords.value = allGrowthRecords.value.filter(item => {
    const dStr = getLocalISO(item.tanggal_pengamatan)
    return dStr.startsWith(ym)
  }).sort((a, b) => new Date(a.tanggal_pengamatan) - new Date(b.tanggal_pengamatan))
    
  monthlyHarvestRecords.value = allHarvestRecords.value.filter(item => {
    const dStr = getLocalISO(item.tanggal_panen)
    return dStr.startsWith(ym)
  }).sort((a, b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen))

  monthlyEnvRecords.value = allEnvRecords.value.filter(item => {
    const dStr = getLocalISO(item.tanggal_pengukuran)
    return dStr.startsWith(ym)
  }).sort((a, b) => new Date(a.tanggal_pengukuran) - new Date(b.tanggal_pengukuran))

  // Calculate Averages from lingkungan_harian
  if (monthlyEnvRecords.value.length > 0) {
    const sumSuhu = monthlyEnvRecords.value.reduce((acc, curr) => acc + (Number(curr.suhu) || 0), 0)
    const sumKelembapan = monthlyEnvRecords.value.reduce((acc, curr) => acc + (Number(curr.kelembaban) || 0), 0)
    avgSuhu.value = (sumSuhu / monthlyEnvRecords.value.length).toFixed(1)
    avgKelembapan.value = (sumKelembapan / monthlyEnvRecords.value.length).toFixed(1)
  } else {
    avgSuhu.value = 0
    avgKelembapan.value = 0
  }

  // Calculate Panen
  totalPanen.value = monthlyHarvestRecords.value.reduce((acc, curr) => acc + (Number(curr.jumlah_panen) || 0), 0).toFixed(1)

  // Generate Insight
  if (monthlyEnvRecords.value.length === 0) {
    aiInsight.value = "Belum ada data pengamatan pada bulan ini. Silakan pastikan pengisian data harian dilakukan tepat waktu."
  } else {
    let insight = `Bulan ini terdapat ${monthlyEnvRecords.value.length} pencatatan lingkungan. `
    if (avgSuhu.value > 28) insight += "Suhu rata-rata cukup tinggi (>28°C), pertimbangkan untuk meningkatkan sirkulasi udara. "
    else if (avgSuhu.value < 20) insight += "Suhu rata-rata sangat dingin (<20°C). "
    else insight += "Suhu rata-rata berada pada ambang batas optimal (Idealnya ~25°C). "

    if (avgKelembapan.value < 70) insight += "Kelembapan tergolong rendah, jamur mungkin akan cepat kering. "
    else insight += "Kelembapan terjaga dengan baik. "

    if (totalPanen.value > 0) insight += `Total hasil panen bulan ini mencapai ${totalPanen.value} Kg.`
    else insight += "Belum ada panen yang tercatat bulan ini."
    
    aiInsight.value = insight
  }

  // Prepare Charts Data from lingkungan_harian
  const daysInMonth = new Date(ym.split('-')[0], ym.split('-')[1], 0).getDate()
  const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1))

  // Daily Averages from lingkungan_harian
  const dailySuhu = Array(daysInMonth).fill(null)
  const dailyKelembapan = Array(daysInMonth).fill(null)
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0')
    const dateStr = `${ym}-${dayStr}`
    
    const dayRecs = monthlyEnvRecords.value.filter(r => {
      const dStr = getLocalISO(r.tanggal_pengukuran)
      return dStr.startsWith(dateStr)
    })
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
    const d = r.tanggal_panen
    if (d) {
      const dStr = getLocalISO(d).slice(0, 10)
      const parts = dStr.split('-')
      if (parts.length >= 3) {
        const dayIndex = parseInt(parts[2], 10) - 1
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          dailyHarvest[dayIndex] += Number(r.jumlah_panen) || 0
        }
      }
    }
  })

  harvestChartData.value = {
    labels,
    datasets: [{ label: 'Hasil Panen (Kg)', backgroundColor: '#16a34a', data: dailyHarvest, borderRadius: 4 }]
  }
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getSuhuClass(val) {
  if (!val) return 'gray-tag'
  if (val > 28 || val < 18) return 'red-tag'
  return 'green-tag'
}

function getKelembabanClass(val) {
  if (!val) return 'gray-tag'
  if (val < 70) return 'red-tag'
  return 'blue-tag'
}

function getSuhuColorClass(val) {
  if (val > 28 || val < 18) return 'text-red'
  return 'text-green'
}

async function loadReports() {
  loading.value = true
  try {
    const meRes = await usersService.getMe()
    let isAdmin = false
    if (meRes?.success) {
      userName.value = meRes.data.nama_lengkap
      isAdmin = meRes.data.role === 'admin'
    }

    const [budRes, growthRes, panenRes, envRes] = await Promise.all([
      isAdmin ? budidayaService.getAll() : budidayaService.getByPetugas(),
      pertumbuhanService.getAll(),
      panenService.getAll(),
      lingkunganService.getAll()
    ])

    if (budRes?.success) assignedBudidaya.value = budRes.data

    const assignedIds = new Set(assignedBudidaya.value.map(item => Number(item.id_budidaya)))

    if (growthRes?.success) {
      allGrowthRecords.value = growthRes.data.filter(item => assignedIds.has(Number(item.id_budidaya)))
    }
    if (panenRes?.success) {
      allHarvestRecords.value = panenRes.data.filter(item => assignedIds.has(Number(item.id_budidaya)))
    }
    if (envRes?.success) {
      allEnvRecords.value = envRes.data.filter(item => assignedIds.has(Number(item.id_budidaya)))
    }

    processMonthlyData()

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadReports)
</script>

<style scoped>
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.petugas-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Print Only Styles */
.print-header { display: none; }

.page-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-text h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
.page-description { margin: 4px 0 0; color: #6b7280; font-size: 14px; }

.header-actions { display: flex; gap: 12px; align-items: center; }
.modern-input { width: 180px; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s; }
.modern-input:focus { outline: none; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }

.btn-primary { background: #111827; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; }
.btn-primary:hover { background: #374151; }

.insight-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
}
.insight-title { margin: 0 0 8px 0; color: #16a34a; font-size: 16px; font-weight: 800; }
.insight-text { margin: 0; color: #15803d; font-size: 15px; line-height: 1.5; font-weight: 500; }

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.stat-card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #f3f4f6; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.stat-label { display: block; font-size: 12px; color: #6b7280; margin-bottom: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 28px; font-weight: 800; color: #111827; }
.text-green { color: #16a34a; }
.text-blue { color: #2563eb; }
.text-red { color: #dc2626; }

/* Charts */
.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}
.chart-box {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.chart-box h4 { margin: 0 0 16px 0; font-size: 15px; color: #111827; }
.chart-wrapper { height: 250px; position: relative; }

/* Table Style */
.table-card-modern {
  background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f3f4f6;
}
.table-title { margin: 0; padding: 20px 24px; border-bottom: 1px solid #f3f4f6; font-size: 16px; color: #111827; font-weight: 800; }
.mt-24 { margin-top: 24px; }

.laporan-grid { display: grid; grid-template-columns: 100px 120px 1fr 90px 110px 2fr; gap: 16px; align-items: center; padding: 16px 24px; font-size: 14px; }
.table-header-modern { background: #f9fafb; font-weight: 700; color: #4b5563; border-bottom: 1px solid #e5e7eb; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
.has-divider { border-top: 1px solid #f3f4f6; }
.table-row-modern { color: #111827; }
.empty-row { display: block; padding: 48px; text-align: center; color: #6b7280; }
.full-span { display: block; grid-column: 1 / -1; }

.hitam { color: #111827; }
.fw-600 { font-weight: 600; }
.fw-700 { font-weight: 700; }
.text-muted { color: #6b7280; }
.text-sm { font-size: 13px; color: #4b5563; }

.badge-tag { display: inline-flex; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; }
.blue-tag { background: #eff6ff; color: #1d4ed8; }
.green-tag { background: #f0fdf4; color: #15803d; }
.red-tag { background: #fef2f2; color: #dc2626; }
.gray-tag { background: #f3f4f6; color: #4b5563; }

/* ======== PRINT CSS ======== */
@media print {
  /* Hide UI elements */
  .no-print, .btn-primary, .app-sidebar, .petugas-navbar, .search-box {
    display: none !important;
  }
  
  /* Reset body and wrapper for printing */
  body, .app-wrapper, .main-layout {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
    height: auto !important;
    width: 100% !important;
  }

  /* Show Print Header */
  .print-header {
    display: block;
    margin-bottom: 20px;
  }
  .print-header h2 { margin: 0 0 4px 0; font-size: 24px; color: #111827; }
  .print-header p { margin: 0; font-size: 14px; color: #4b5563; }
  .print-header hr { border: none; border-bottom: 2px solid #e5e7eb; margin: 16px 0; }

  /* Adjust Layout */
  .petugas-page {
    gap: 16px;
    padding: 0 !important;
    width: 100%;
    margin: 0;
  }
  
  .insight-box { border: 1px solid #16a34a; background: transparent; padding: 16px; page-break-inside: avoid; }
  .stats-row { grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
  .stat-card { padding: 12px; border: 1px solid #d1d5db; box-shadow: none; page-break-inside: avoid; }
  
  .charts-container { gap: 20px; margin-bottom: 16px; }
  .chart-box { border: 1px solid #d1d5db; padding: 12px; box-shadow: none; page-break-inside: avoid; }
  .chart-wrapper { height: 250px; }

  .table-card-modern { border: 1px solid #d1d5db; box-shadow: none; page-break-inside: auto; }
  .table-row-modern { page-break-inside: avoid; }
}

@media(max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .charts-container { grid-template-columns: 1fr; }
}
</style>