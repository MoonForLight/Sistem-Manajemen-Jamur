<template>
  <div class="petugas-page fade-in">
    <div class="print-header">
      <h2>Laporan Bulanan Operasional Jamur</h2>
      <p>Bulan Laporan: {{ formattedMonth }}</p>
      <p>Petugas: {{ userName }}</p>
      <hr />
    </div>

    <div class="report-cover">
      <div class="report-cover-title">
        <h1>Laporan Bulanan Operasional Jamur</h1>
        <p class="report-cover-subtitle">Ringkasan laporan untuk petugas, grafik, dan detail lingkungan.</p>
      </div>
      <div class="report-cover-meta">
        <div>
          <span class="meta-label">Bulan</span>
          <span class="meta-value">{{ formattedMonth }}</span>
        </div>
        <div>
          <span class="meta-label">Petugas</span>
          <span class="meta-value">{{ userName }}</span>
        </div>
        <div>
          <span class="meta-label">Total Panen</span>
          <span class="meta-value">{{ totalPanen }} gram</span>
        </div>
        <div>
          <span class="meta-label">Total Pencatatan</span>
          <span class="meta-value">{{ monthlyEnvRecords.length }}</span>
        </div>
      </div>
    </div>

    <header class="page-header-modern no-print">
      <div class="header-text">
        <h1>Laporan & Analisis Bulanan</h1>
        <p class="page-description">Pilih periode laporan untuk melihat ringkasan performa dan grafik.</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <input v-model="selectedMonth" type="month" class="modern-input" @change="processMonthlyData" />
        </div>
        <button class="btn-export-csv" @click="openDownloadModal">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Ekspor Excel
        </button>
      </div>
    </header>

    <div v-if="showDownloadModal" class="modal-overlay" @click.self="closeDownloadModal">
      <div class="form-modal slide-up">
        <div class="modal-header">
          <h3 class="modal-title">Pilih Tipe Laporan Excel</h3>
          <button class="close-btn" @click="closeDownloadModal">&times;</button>
        </div>
        <form @submit.prevent="submitDownloadForm" class="modern-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Tipe Ekspor Data <span class="text-danger">*</span></label>
              <select v-model="downloadForm.tipe_ekspor" required class="modern-select">
                <option value="bulanan">Laporan Bulanan (1 Bulan)</option>
                <option value="3_bulan">Laporan Kuartal (3 Bulan Terakhir)</option>
                <option value="rumah_jamur">Laporan Rumah Jamur (Per Lokasi)</option>
                <option value="per_jamur">Laporan Siklus Budidaya (Hanya yang Selesai)</option>
              </select>
            </div>
            
            <div v-if="downloadForm.tipe_ekspor === 'rumah_jamur'" class="form-group full-width">
              <label>Pilih Rumah Jamur <span class="text-danger">*</span></label>
              <select v-model="downloadForm.id_lokasi" required class="modern-select">
                <option value="" disabled>Pilih Lokasi...</option>
                <option v-for="lok in lokasiOptions" :key="lok.id_lokasi" :value="lok.id_lokasi">
                  {{ lok.nama_lokasi }}
                </option>
              </select>
            </div>
            <div v-if="downloadForm.tipe_ekspor === 'per_jamur'" class="form-group full-width">
              <label>Pilih Siklus Jamur (Selesai) <span class="text-danger">*</span></label>
              <select v-model="downloadForm.id_budidaya" required class="modern-select">
                <option value="" disabled>Pilih Jamur...</option>
                <option v-for="b in budidayaSelesaiList" :key="b.id_budidaya" :value="b.id_budidaya">
                  BDY-{{ String(b.id_budidaya).padStart(3, '0') }} - {{ b.nama_jamur }} (Selesai: {{ formatDate(b.tanggal_selesai) }})
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeDownloadModal">Batal</button>
            <button type="submit" class="btn-primary" :disabled="isDownloading">
              {{ isDownloading ? 'Mengekspor...' : 'Mulai Unduh' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="loading" class="empty-state no-print">Memuat data...</div>

    <div v-else>
      <div class="insight-box">
        <h3 class="insight-title">💡 Analisis Otomatis: {{ formattedMonth }}</h3>
        <p class="insight-text">{{ aiInsight }}</p>
      </div>

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
          <span class="stat-label">Intensitas Cahaya</span>
          <span class="stat-value text-orange">{{ avgCahaya }} Lux</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Panen</span>
          <span class="stat-value text-green">{{ totalPanen }} gram</span>
        </div>
      </div>

      <div class="charts-container">
        <div class="chart-box">
          <h4>Tren Suhu & Kelembapan Harian</h4>
          <div class="chart-wrapper">
            <Line :data="envChartData" :options="chartOptions" ref="envChartRef" />
          </div>
        </div>
        <div class="chart-box">
          <h4>Akumulasi Panen Harian</h4>
          <div class="chart-wrapper">
            <Bar :data="harvestChartData" :options="harvestChartOptions" ref="harvestChartRef" />
          </div>
        </div>
      </div>

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
import ExcelJS from 'exceljs'

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

const envChartRef = ref(null)
const harvestChartRef = ref(null)

const loading = ref(true)
const isDownloading = ref(false)
const showDownloadModal = ref(false)
const downloadForm = ref({
  tipe_ekspor: 'bulanan',
  id_budidaya: '',
  id_lokasi: ''
})

const lokasiOptions = computed(() => {
  const map = new Map()
  assignedBudidaya.value.forEach(b => {
    if (b.id_lokasi && b.nama_lokasi) {
      map.set(String(b.id_lokasi), { id_lokasi: b.id_lokasi, nama_lokasi: b.nama_lokasi })
    }
  })
  return Array.from(map.values()).sort((a,b) => a.nama_lokasi.localeCompare(b.nama_lokasi))
})

const budidayaSelesaiList = computed(() => {
  return assignedBudidaya.value.filter(b => b.status === 'selesai')
})

const today = new Date()
const currentYm = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
const selectedMonth = ref(currentYm)

const formattedMonth = computed(() => {
  if (!selectedMonth.value) return '-'
  const [year, month] = selectedMonth.value.split('-')
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
})

const avgSuhu = ref(0)
const avgKelembapan = ref(0)
const avgCahaya = ref(0)
const totalPanen = ref(0)
const aiInsight = ref('')

const envChartData = ref({ labels: [], datasets: [] })
const harvestChartData = ref({ labels: [], datasets: [] })
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { font: { family: 'Inter' } } } },
  scales: { 
    y: { type: 'linear', display: true, position: 'left', beginAtZero: true },
    y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false } },
    x: { ticks: { font: { family: 'Inter' } } } 
  }
}

const harvestChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { font: { family: 'Inter' } } } },
  scales: { 
    y: { type: 'linear', display: true, position: 'left', beginAtZero: true },
    x: { ticks: { font: { family: 'Inter' } } } 
  }
}



function processMonthlyData() {
  if (!selectedMonth.value) return

  const ym = selectedMonth.value

  function getLocalDateString(d) {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  monthlyRecords.value = allGrowthRecords.value.filter(item => {
    const dStr = getLocalDateString(item.tanggal_pengamatan)
    return dStr.startsWith(ym)
  }).sort((a, b) => new Date(a.tanggal_pengamatan) - new Date(b.tanggal_pengamatan))
    
  monthlyHarvestRecords.value = allHarvestRecords.value.filter(item => {
    const dStr = getLocalDateString(item.tanggal_panen)
    return dStr.startsWith(ym)
  }).sort((a, b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen))

  monthlyEnvRecords.value = allEnvRecords.value.filter(item => {
    const dStr = getLocalDateString(item.tanggal_pengukuran)
    return dStr.startsWith(ym)
  }).sort((a, b) => new Date(a.tanggal_pengukuran) - new Date(b.tanggal_pengukuran))

  if (monthlyEnvRecords.value.length > 0) {
    const sumSuhu = monthlyEnvRecords.value.reduce((acc, curr) => acc + (Number(curr.suhu) || 0), 0)
    const sumKelembapan = monthlyEnvRecords.value.reduce((acc, curr) => acc + (Number(curr.kelembaban) || 0), 0)
    const sumCahaya = monthlyEnvRecords.value.reduce((acc, curr) => acc + (Number(curr.intensitas_cahaya) || 0), 0)
    avgSuhu.value = (sumSuhu / monthlyEnvRecords.value.length).toFixed(1)
    avgKelembapan.value = (sumKelembapan / monthlyEnvRecords.value.length).toFixed(1)
    avgCahaya.value = (sumCahaya / monthlyEnvRecords.value.length).toFixed(0)
  } else {
    avgSuhu.value = 0
    avgKelembapan.value = 0
    avgCahaya.value = 0
  }

  totalPanen.value = monthlyHarvestRecords.value.reduce((acc, curr) => acc + (Number(curr.jumlah_panen) || 0), 0).toFixed(1)

  if (monthlyEnvRecords.value.length === 0) {
    aiInsight.value = "Belum ada data pengamatan pada bulan ini. Silakan pastikan pengisian data harian dilakukan tepat waktu."
  } else {
    let insight = `Bulan ini terdapat ${monthlyEnvRecords.value.length} pencatatan lingkungan. `
    if (avgSuhu.value > 28) insight += "Suhu rata-rata cukup tinggi (>28°C), pertimbangkan untuk meningkatkan sirkulasi udara. "
    else if (avgSuhu.value < 20) insight += "Suhu rata-rata sangat dingin (<20°C). "
    else insight += "Suhu rata-rata berada pada ambang batas optimal (Idealnya ~25°C). "

    if (avgKelembapan.value < 70) insight += "Kelembapan tergolong rendah, jamur mungkin akan cepat kering. "
    else insight += "Kelembapan terjaga dengan baik. "

    if (totalPanen.value > 0) insight += `Total hasil panen bulan ini mencapai ${totalPanen.value} gram.`
    else insight += "Belum ada panen yang tercatat bulan ini."
    
    aiInsight.value = insight
  }

  const daysInMonth = new Date(ym.split('-')[0], ym.split('-')[1], 0).getDate()
  const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1))

  const dailySuhu = Array(daysInMonth).fill(null)
  const dailyKelembapan = Array(daysInMonth).fill(null)
  const dailyCahaya = Array(daysInMonth).fill(null)
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0')
    const dateStr = `${ym}-${dayStr}`
    
    const dayRecs = monthlyEnvRecords.value.filter(r => getLocalDateString(r.tanggal_pengukuran) === dateStr)
    if (dayRecs.length > 0) {
      dailySuhu[i-1] = dayRecs.reduce((s, r) => s + Number(r.suhu || 0), 0) / dayRecs.length
      dailyKelembapan[i-1] = dayRecs.reduce((s, r) => s + Number(r.kelembaban || 0), 0) / dayRecs.length
      
      const lightRecs = dayRecs.filter(r => r.intensitas_cahaya !== null && r.intensitas_cahaya !== undefined && r.intensitas_cahaya !== '')
      if (lightRecs.length > 0) {
        dailyCahaya[i-1] = lightRecs.reduce((s, r) => s + Number(r.intensitas_cahaya || 0), 0) / lightRecs.length
      }
    }
  }

  envChartData.value = {
    labels,
    datasets: [
      { label: 'Suhu (°C)', yAxisID: 'y', borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.1)', data: dailySuhu, tension: 0.3, spanGaps: true },
      { label: 'Kelembapan (%)', yAxisID: 'y', borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', data: dailyKelembapan, tension: 0.3, spanGaps: true },
      { label: 'Cahaya (Lux)', yAxisID: 'y1', borderColor: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.1)', data: dailyCahaya, tension: 0.3, spanGaps: true }
    ]
  }

  const dailyHarvest = Array(daysInMonth).fill(0)
  monthlyHarvestRecords.value.forEach(r => {
    const dStr = getLocalDateString(r.tanggal_panen)
    if (dStr) {
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
    datasets: [{ label: 'Hasil Panen (gram)', backgroundColor: '#16a34a', data: dailyHarvest, borderRadius: 4 }]
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

function openDownloadModal() {
  showDownloadModal.value = true
}

function closeDownloadModal() {
  showDownloadModal.value = false
}

async function submitDownloadForm() {
  if (downloadForm.value.tipe_ekspor === 'per_jamur' && !downloadForm.value.id_budidaya) {
    alert('Pilih jamur terlebih dahulu.')
    return
  }
  if (downloadForm.value.tipe_ekspor === 'rumah_jamur' && !downloadForm.value.id_lokasi) {
    alert('Pilih rumah jamur terlebih dahulu.')
    return
  }
  isDownloading.value = true
  try {
    await generateExcel()
    closeDownloadModal()
  } catch (err) {
    console.error('Gagal mengekspor data:', err)
    alert('Terjadi kesalahan saat mengekspor data.')
  } finally {
    isDownloading.value = false
  }
}

async function buildExcelGlobal(workbook, type, ym) {
  let envRecordsToExport = []
  let harvestRecordsToExport = []
  
  if (type === 'bulanan') {
    const ymPrefix = ym
    envRecordsToExport = allEnvRecords.value.filter(r => r.tanggal_pengukuran && r.tanggal_pengukuran.startsWith(ymPrefix))
    harvestRecordsToExport = allHarvestRecords.value.filter(r => r.tanggal_panen && r.tanggal_panen.startsWith(ymPrefix))
  } else {
    const d = new Date(ym.split('-')[0], ym.split('-')[1] - 1)
    const months = []
    for(let i = 0; i < 3; i++) {
      const iterD = new Date(d.getFullYear(), d.getMonth() - i, 1)
      months.push(`${iterD.getFullYear()}-${String(iterD.getMonth() + 1).padStart(2, '0')}`)
    }
    envRecordsToExport = allEnvRecords.value.filter(r => r.tanggal_pengukuran && months.some(m => r.tanggal_pengukuran.startsWith(m)))
    harvestRecordsToExport = allHarvestRecords.value.filter(r => r.tanggal_panen && months.some(m => r.tanggal_panen.startsWith(m)))
  }

  const ws1 = workbook.addWorksheet('1. Executive Summary', { views: [{ showGridLines: false }] })
  ws1.addRow(['LAPORAN PRODUKSI GLOBAL']).font = { bold: true, size: 16 }
  ws1.addRow([])
  ws1.addRow(['Bulan Acuan', formattedMonth.value]).font = { bold: true }
  ws1.addRow(['Tipe Laporan', type === 'bulanan' ? '1 Bulan' : 'Kuartal (3 Bulan)']).font = { bold: true }
  ws1.addRow(['Total Panen Agregat', harvestRecordsToExport.reduce((a, b) => a + (Number(b.jumlah_panen) || 0), 0) + ' gram']).font = { bold: true }
  ws1.columns = [{width: 30}, {width: 40}]

  const ws2 = workbook.addWorksheet('2. Produksi Harian')
  ws2.addRow(['Tanggal', 'Total Panen (gram)']).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }
  
  const dailyHarvest = {}
  harvestRecordsToExport.forEach(r => {
    const date = r.tanggal_panen.split('T')[0]
    dailyHarvest[date] = (dailyHarvest[date] || 0) + (Number(r.jumlah_panen) || 0)
  })
  const sortedDates = Object.keys(dailyHarvest).sort()
  sortedDates.forEach(date => {
    ws2.addRow([date, dailyHarvest[date]])
  })
  
  if (sortedDates.length > 0) {
    ws2.addConditionalFormatting({
      ref: `B2:B${sortedDates.length + 1}`,
      rules: [{ type: 'dataBar', color: { argb: 'FF16A34A' } }]
    })
  }
  ws2.columns = [{width: 20}, {width: 30}]

  const ws3 = workbook.addWorksheet('3. Kondisi Lingkungan')
  ws3.addRow(['Tanggal', 'Avg Suhu (°C)', 'Avg Kelembapan (%)']).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  ws3.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }
  const dailyEnv = {}
  envRecordsToExport.forEach(r => {
    const date = r.tanggal_pengukuran.split('T')[0]
    if (!dailyEnv[date]) dailyEnv[date] = { s: [], k: [] }
    if (r.suhu) dailyEnv[date].s.push(Number(r.suhu))
    if (r.kelembaban) dailyEnv[date].k.push(Number(r.kelembaban))
  })
  
  const envDates = Object.keys(dailyEnv).sort()
  envDates.forEach(date => {
    const sAvg = dailyEnv[date].s.length ? (dailyEnv[date].s.reduce((a,b)=>a+b,0)/dailyEnv[date].s.length).toFixed(1) : '-'
    const kAvg = dailyEnv[date].k.length ? (dailyEnv[date].k.reduce((a,b)=>a+b,0)/dailyEnv[date].k.length).toFixed(1) : '-'
    ws3.addRow([date, Number(sAvg)||sAvg, Number(kAvg)||kAvg])
  })

  if (envDates.length > 0) {
    ws3.addConditionalFormatting({
      ref: `B2:B${envDates.length + 1}`,
      rules: [{ type: 'colorScale', cfvo: [{type: 'min'}, {type: 'percentile', value: 50}, {type: 'max'}], color: [{argb: 'FF3B82F6'}, {argb: 'FFFDE047'}, {argb: 'FFEF4444'}] }]
    })
  }
  ws3.columns = [{width: 20}, {width: 25}, {width: 25}]
}

async function buildExcelLokasi(workbook, idLokasi) {
  const lokasi = lokasiOptions.value.find(l => String(l.id_lokasi) === String(idLokasi))
  const namaLokasi = lokasi ? lokasi.nama_lokasi : 'Lokasi Tidak Diketahui'
  
  const budidayaInLokasi = assignedBudidaya.value.filter(b => String(b.id_lokasi) === String(idLokasi))
  const ids = new Set(budidayaInLokasi.map(b => Number(b.id_budidaya)))
  
  const envRecords = allEnvRecords.value.filter(r => r.tanggal_pengukuran && ids.has(Number(r.id_budidaya))).sort((a,b) => new Date(a.tanggal_pengukuran) - new Date(b.tanggal_pengukuran))
  const harvestRecords = allHarvestRecords.value.filter(r => r.tanggal_panen && ids.has(Number(r.id_budidaya))).sort((a,b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen))

  const ws1 = workbook.addWorksheet('1. Profil Lokasi', { views: [{ showGridLines: false }] })
  ws1.addRow(['AUDIT STABILITAS RUMAH JAMUR']).font = { bold: true, size: 16 }
  ws1.addRow([])
  ws1.addRow(['Lokasi', namaLokasi]).font = { bold: true }
  ws1.addRow(['Total Siklus Budidaya', budidayaInLokasi.length]).font = { bold: true }
  ws1.addRow(['Total Panen Dihasilkan', harvestRecords.reduce((a, b) => a + (Number(b.jumlah_panen) || 0), 0) + ' gram']).font = { bold: true }
  ws1.columns = [{width: 30}, {width: 40}]

  const ws2 = workbook.addWorksheet('2. Audit Iklim Pagi-Sore')
  ws2.addRow(['Tanggal', 'Suhu Pagi (°C)', 'Kelembapan Pagi (%)', 'Suhu Sore (°C)', 'Kelembapan Sore (%)']).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }
  
  const dailyAudit = {}
  envRecords.forEach(r => {
    if (!r.tanggal_pengukuran) return
    const dObj = new Date(r.tanggal_pengukuran)
    if (isNaN(dObj.getTime())) return
    const date = dObj.toISOString().split('T')[0]
    const hour = dObj.getHours()
    
    if (!dailyAudit[date]) dailyAudit[date] = { sPagi:[], kPagi:[], sSore:[], kSore:[] }
    
    if (hour < 12) {
      if (r.suhu) dailyAudit[date].sPagi.push(Number(r.suhu))
      if (r.kelembaban) dailyAudit[date].kPagi.push(Number(r.kelembaban))
    } else {
      if (r.suhu) dailyAudit[date].sSore.push(Number(r.suhu))
      if (r.kelembaban) dailyAudit[date].kSore.push(Number(r.kelembaban))
    }
  })

  const dates = Object.keys(dailyAudit).sort()
  dates.forEach(date => {
    const d = dailyAudit[date]
    const getAvg = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : '-'
    ws2.addRow([
      date, 
      Number(getAvg(d.sPagi)) || getAvg(d.sPagi), 
      Number(getAvg(d.kPagi)) || getAvg(d.kPagi), 
      Number(getAvg(d.sSore)) || getAvg(d.sSore), 
      Number(getAvg(d.kSore)) || getAvg(d.kSore)
    ])
  })

  if (dates.length > 0) {
    ws2.addConditionalFormatting({
      ref: `B2:B${dates.length + 1}`,
      rules: [{ type: 'colorScale', cfvo: [{type: 'min'}, {type: 'max'}], color: [{argb: 'FF3B82F6'}, {argb: 'FFEF4444'}] }]
    })
    ws2.addConditionalFormatting({
      ref: `D2:D${dates.length + 1}`,
      rules: [{ type: 'colorScale', cfvo: [{type: 'min'}, {type: 'max'}], color: [{argb: 'FF3B82F6'}, {argb: 'FFEF4444'}] }]
    })
  }
  ws2.columns = [{width: 15}, {width: 20}, {width: 20}, {width: 20}, {width: 20}]
}

async function buildExcelSiklus(workbook, idBudidaya) {
  const b = assignedBudidaya.value.find(bd => String(bd.id_budidaya) === String(idBudidaya))
  const envs = allEnvRecords.value.filter(r => r.tanggal_pengukuran && String(r.id_budidaya) === String(idBudidaya)).sort((a,b) => new Date(a.tanggal_pengukuran) - new Date(b.tanggal_pengukuran))
  const harvests = allHarvestRecords.value.filter(r => r.tanggal_panen && String(r.id_budidaya) === String(idBudidaya)).sort((a,b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen))

  const ws1 = workbook.addWorksheet('1. Rapor Siklus', { views: [{ showGridLines: false }] })
  ws1.addRow(['EVALUASI SIKLUS BUDIDAYA']).font = { bold: true, size: 16 }
  ws1.addRow([])
  ws1.addRow(['Kode Budidaya', `BDY-${String(idBudidaya).padStart(3, '0')}`]).font = { bold: true }
  ws1.addRow(['Jenis Jamur', b ? b.nama_jamur : '-']).font = { bold: true }
  ws1.addRow(['Tanggal Mulai', b ? formatDate(b.tanggal_mulai) : '-']).font = { bold: true }
  ws1.addRow(['Tanggal Selesai', b ? formatDate(b.tanggal_selesai) : '-']).font = { bold: true }
  ws1.addRow(['Total Panen Bersih', harvests.reduce((a, v) => a + (Number(v.jumlah_panen) || 0), 0) + ' gram']).font = { bold: true }
  ws1.addRow(['Alasan Selesai', b ? b.alasan_selesai : '-']).font = { bold: true }
  ws1.columns = [{width: 30}, {width: 40}]

  const ws2 = workbook.addWorksheet('2. Histori Panen')
  ws2.addRow(['Panen Ke-', 'Tanggal Panen', 'Jumlah (gram)', 'Petugas']).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB45309' } }
  
  harvests.forEach((h, idx) => {
    ws2.addRow([idx + 1, formatDate(h.tanggal_panen), Number(h.jumlah_panen) || 0, h.nama_petugas || '-'])
  })

  if (harvests.length > 0) {
    ws2.addConditionalFormatting({
      ref: `C2:C${harvests.length + 1}`,
      rules: [{ type: 'dataBar', color: { argb: 'FF16A34A' } }]
    })
  }
  ws2.columns = [{width: 15}, {width: 20}, {width: 25}, {width: 30}]
  
  const ws3 = workbook.addWorksheet('3. Histori Lingkungan')
  ws3.addRow(['Waktu', 'Suhu (°C)', 'Kelembapan (%)']).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  ws3.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }
  envs.forEach(e => {
    ws3.addRow([
      `${formatDate(e.tanggal_pengukuran)} ${new Date(e.tanggal_pengukuran).toLocaleTimeString('id-ID')}`, 
      Number(e.suhu) || '-', 
      Number(e.kelembaban) || '-'
    ])
  })
  if (envs.length > 0) {
    ws3.addConditionalFormatting({
      ref: `B2:B${envs.length + 1}`,
      rules: [{ type: 'colorScale', cfvo: [{type: 'min'}, {type: 'max'}], color: [{argb: 'FF3B82F6'}, {argb: 'FFEF4444'}] }]
    })
  }
  ws3.columns = [{width: 30}, {width: 20}, {width: 20}]
}

async function generateExcel() {
  const ym = selectedMonth.value
  if (!ym) {
    alert('Pilih bulan terlebih dahulu.')
    return
  }

  const type = downloadForm.value.tipe_ekspor
  if (type === 'rumah_jamur' && !downloadForm.value.id_lokasi) {
    alert('Pilih rumah jamur terlebih dahulu.')
    return
  }
  if (type === 'per_jamur' && !downloadForm.value.id_budidaya) {
    alert('Pilih jamur terlebih dahulu.')
    return
  }

  if (!Array.isArray(assignedBudidaya.value)) assignedBudidaya.value = []
  if (!Array.isArray(allEnvRecords.value)) allEnvRecords.value = []
  if (!Array.isArray(allHarvestRecords.value)) allHarvestRecords.value = []

  const workbook = new ExcelJS.Workbook()
  
  if (type === 'bulanan' || type === '3_bulan') {
    await buildExcelGlobal(workbook, type, ym)
  } else if (type === 'rumah_jamur') {
    await buildExcelLokasi(workbook, downloadForm.value.id_lokasi)
  } else if (type === 'per_jamur') {
    await buildExcelSiklus(workbook, downloadForm.value.id_budidaya)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `Laporan_Petugas_${type}_${Date.now()}.xlsx`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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

.print-header { display: none; }

.report-cover {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
}

.report-cover-title h1 {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 800;
  color: #111827;
}

.report-cover-subtitle {
  margin: 0;
  color: #4b5563;
  font-size: 14px;
}

.report-cover-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.report-cover-meta div {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.meta-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.meta-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
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

.header-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.modern-input { width: 180px; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s; }
.modern-input:focus { outline: none; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }

.btn-primary { background: #111827; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; }
.btn-primary:hover { background: #374151; }

.btn-export-csv { background: #16a34a; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2); }
.btn-export-csv:hover { background: #15803d; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(22, 163, 74, 0.3); }
.btn-export-pdf { background: #dc2626; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2); }
.btn-export-pdf:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(220, 38, 38, 0.3); }

.insight-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
}
.insight-title { margin: 0 0 8px 0; color: #16a34a; font-size: 16px; font-weight: 800; }
.insight-text { margin: 0; color: #15803d; font-size: 15px; line-height: 1.5; font-weight: 500; }

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

/* Modal CSS */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
.form-modal { background: white; padding: 32px; border-radius: 16px; width: 100%; max-width: 540px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-title { font-size: 20px; font-weight: 800; color: #111827; margin: 0; }
.close-btn { background: none; border: none; font-size: 28px; line-height: 1; color: #9ca3af; cursor: pointer; transition: color 0.2s; }
.close-btn:hover { color: #111827; }
.modern-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 14px; font-weight: 600; color: #374151; }
.text-danger { color: #dc2626; }
.modern-input, .modern-select { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; transition: all 0.2s; box-sizing: border-box; }
.modern-input:focus, .modern-select:focus { outline: none; border-color: #16a34a; background: white; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
.btn-cancel { background: white; border: 1px solid #d1d5db; color: #374151; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: #f3f4f6; }
.btn-primary { background: #16a34a; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover:not(:disabled) { background: #15803d; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

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

@media print {
  .no-print, .btn-primary, .btn-export-csv, .btn-export-pdf, .app-sidebar, .petugas-navbar, .search-box {
    display: none !important;
  }
  
  body, .app-wrapper, .main-layout, .petugas-page {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
    height: auto !important;
    width: 100% !important;
    color: #111827 !important;
  }

  .petugas-page, .petugas-page * {
    color: #111827 !important;
    box-shadow: none !important;
  }

  .pdf-export, .pdf-export * {
    background: white !important;
    background-color: white !important;
    color: #111827 !important;
  }

  .pdf-export {
    width: 100% !important;
    max-width: 1200px !important;
    margin: 0 auto !important;
    padding: 0 !important;
  }

  .pdf-export .btn-primary,
  .pdf-export .btn-export-csv,
  .pdf-export .btn-export-pdf,
  .pdf-export .no-print,
  .pdf-export .app-sidebar,
  .pdf-export .petugas-navbar,
  .pdf-export .search-box {
    display: none !important;
  }

  .print-header {
    display: block;
    margin-bottom: 20px;
    background: white !important;
  }
  .print-header h2 { margin: 0 0 4px 0; font-size: 24px; color: #111827; }
  .print-header p { margin: 0; font-size: 14px; color: #4b5563; }
  .print-header hr { border: none; border-bottom: 2px solid #e5e7eb; margin: 16px 0; }

  .chart-wrapper canvas {
    width: 100% !important;
    height: auto !important;
  }
  .print-header h2 { margin: 0 0 4px 0; font-size: 24px; color: #111827; }
  .print-header p { margin: 0; font-size: 14px; color: #4b5563; }
  .print-header hr { border: none; border-bottom: 2px solid #e5e7eb; margin: 16px 0; }

  .petugas-page {
    gap: 16px;
    padding: 0 !important;
    width: 100%;
    margin: 0;
    background: white !important;
    color: #111827 !important;
  }

  .insight-box { border: 1px solid #16a34a; background: white !important; padding: 16px; page-break-inside: avoid; }
  .stat-card { background: white !important; border: 1px solid #e5e7eb !important; box-shadow: none !important; }
  .chart-box { background: white !important; border: 1px solid #e5e7eb !important; box-shadow: none !important; }
  .table-card-modern { background: white !important; border: 1px solid #e5e7eb !important; box-shadow: none !important; }
  .table-header-modern { background: #f9fafb !important; }
  .table-row-modern { color: #111827 !important; }
  .badge-tag { background: #f3f4f6 !important; color: #111827 !important; }
  .page-header-modern { background: white !important; border: none !important; box-shadow: none !important; }
  .print-header, .page-header-modern, .insight-box, .stat-card, .chart-box, .table-card-modern, .table-header-modern {
    color: #111827 !important;
  }
  
  img { max-width: 100%; }
  
  @page {
    margin: 0.4in;
    size: landscape;
  }
}

@media(max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .charts-container { grid-template-columns: 1fr; }
}

@media(max-width: 640px) {
  .stats-row { grid-template-columns: 1fr; }
  .header-actions { flex-direction: column; align-items: stretch; width: 100%; }
  .search-box, .modern-input, .btn-export-csv, .btn-export-pdf { width: 100%; justify-content: center; box-sizing: border-box; }
  .table-card-modern { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 8px; }
  .laporan-grid { min-width: 800px; }
  .report-cover-meta { grid-template-columns: 1fr 1fr; }
}

@media(max-width: 400px) {
  .report-cover-meta { grid-template-columns: 1fr; }
}
</style>