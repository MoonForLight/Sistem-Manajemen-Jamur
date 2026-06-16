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
      <header class="page-header-modern">
        <div class="header-text">
          <RouterLink to="/data" class="back-link">← Kembali</RouterLink>
          <h1>{{ lokasi.nama_lokasi }}</h1>
          <p class="page-description">{{ lokasi.alamat }} • {{ activeBudidaya.length }} Rak Aktif</p>
        </div>
        <div class="header-actions">
          <input v-model="selectedMonth" type="month" class="modern-input" @change="processData" />
          <button @click="openDownloadModal" class="btn-export-csv">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Ekspor Excel
          </button>
        </div>
      </header>

      <div v-if="showDownloadModal" class="modal-overlay" @click.self="closeDownloadModal">
        <div class="form-modal slide-up">
          <div class="modal-header">
            <h3 class="modal-title">Lengkapi Identitas & Pilih Tipe Ekspor</h3>
            <button class="close-btn" @click="closeDownloadModal">&times;</button>
          </div>
          <form @submit.prevent="submitDownloadForm" class="modern-form" style="max-height: 80vh; overflow-y: auto;">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Nama Lengkap <span class="text-danger">*</span></label>
                <input type="text" v-model="downloadForm.nama" required class="modern-input" placeholder="Masukkan nama Anda">
              </div>
              <div class="form-group full-width">
                <label>Email <span class="text-danger">*</span></label>
                <input type="email" v-model="downloadForm.email" required class="modern-input" placeholder="Masukkan email aktif">
              </div>
              <div class="form-group full-width">
                <label>Instansi/Pekerjaan <span class="text-danger">*</span></label>
                <input type="text" v-model="downloadForm.instansi" required class="modern-input" placeholder="Misal: Mahasiswa / Petani">
              </div>
              <div class="form-group full-width">
                <label>Tujuan Unduh <span class="text-danger">*</span></label>
                <textarea v-model="downloadForm.tujuan" required class="modern-input" rows="2" placeholder="Jelaskan tujuan penggunaan data..."></textarea>
              </div>
              <div class="form-group full-width">
                <label>Tipe Ekspor Data <span class="text-danger">*</span></label>
                <select v-model="downloadForm.tipe_ekspor" required class="modern-select">
                  <option value="3_bulan">Laporan Umum (3 Bulan Terakhir)</option>
                  <option value="per_jamur">Laporan Siklus Jamur (Hanya yang Selesai)</option>
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
                {{ isDownloading ? 'Memproses...' : 'Mulai Unduh' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="detail-image">
        <img v-if="lokasi.foto_lokasi" :src="`http://localhost:3000/uploads/${lokasi.foto_lokasi}`" :alt="`Foto ${lokasi.nama_lokasi}`" />
        <div v-else class="detail-image-placeholder">
          <div style="text-align: center;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" style="margin: 0 auto 8px;">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 14px;">Foto tidak tersedia</p>
          </div>
        </div>
      </div>

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
          <span class="stat-label">Total Panen</span>
          <span class="stat-value text-green">{{ totalPanen }} gram</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Intensitas Cahaya</span>
          <span class="stat-value text-orange">{{ avgCahaya }} Lux</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Status Lokasi</span>
          <span class="stat-value" :class="activeBudidaya.length > 0 ? 'text-green' : 'text-muted'">
            {{ activeBudidaya.length > 0 ? 'Aktif' : 'Non-Aktif' }}
          </span>
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
        <div class="table-header-flex">
          <h4 class="table-title" style="border-bottom: none;">Daftar Budidaya (Rak)</h4>

        </div>
        <div class="table-header-modern laporan-grid" style="border-top: 1px solid #e5e7eb;">
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
import { api } from '../../services/api'
import ExcelJS from 'exceljs'

import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement)

const props = defineProps({ lokasiId: { type: String, required: true } })

const loading = ref(true)
const lokasi = ref(null)
const budidayaList = ref([])
const activeBudidaya = ref([])
const budidayaSelesaiList = computed(() => {
  return budidayaList.value.filter(b => b.status === 'selesai')
})

const isDownloading = ref(false)
const showDownloadModal = ref(false)
const downloadForm = ref({
  nama: '',
  email: '',
  instansi: '',
  tujuan: '',
  tipe_ekspor: '3_bulan',
  id_budidaya: ''
})

const envChartRef = ref(null)
const harvestChartRef = ref(null)

const allGrowthRecords = ref([])
const allHarvestRecords = ref([])
const allEnvRecords = ref([])
const monthlyRecords = ref([])
const monthlyHarvestRecords = ref([])
const monthlyEnvRecords = ref([])

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

function getLocalDateString(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function processData() {
  if (!selectedMonth.value || !lokasi.value) return

  const ym = selectedMonth.value

  monthlyRecords.value = allGrowthRecords.value.filter(item => getLocalDateString(item.tanggal_pengamatan).startsWith(ym))
    .sort((a, b) => new Date(a.tanggal_pengamatan) - new Date(b.tanggal_pengamatan))
    
  monthlyHarvestRecords.value = allHarvestRecords.value.filter(item => getLocalDateString(item.tanggal_panen).startsWith(ym))
    .sort((a, b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen))

  monthlyEnvRecords.value = allEnvRecords.value.filter(item => getLocalDateString(item.tanggal_pengukuran).startsWith(ym))
    .sort((a, b) => new Date(a.tanggal_pengukuran) - new Date(b.tanggal_pengukuran))

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
    aiInsight.value = "Belum ada data monitoring yang direkam untuk lokasi ini pada bulan terpilih."
  } else {
    let insight = `Lokasi ini memiliki ${monthlyEnvRecords.value.length} pencatatan lingkungan bulan ini. `
    if (avgSuhu.value > 28) insight += "Suhu rata-rata cukup tinggi (>28°C), sirkulasi udara perlu diperhatikan. "
    else if (avgSuhu.value < 20) insight += "Suhu rata-rata cenderung dingin (<20°C). "
    else insight += "Suhu lingkungan berada dalam batas optimal. "

    if (avgKelembapan.value < 70) insight += "Kelembapan relatif rendah. "
    else insight += "Kelembapan terjaga dengan baik. "

    if (totalPanen.value > 0) insight += `Total hasil panen yang dilaporkan mencapai ${totalPanen.value} gram.`
    else insight += "Belum ada aktivitas panen yang tercatat bulan ini."
    
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
      const dayIndex = parseInt(dStr.split('-')[2], 10) - 1
      dailyHarvest[dayIndex] += Number(r.jumlah_panen) || 0
    }
  })

  harvestChartData.value = {
    labels,
    datasets: [{ label: 'Hasil Panen (gram)', backgroundColor: '#16a34a', data: dailyHarvest, borderRadius: 4 }]
  }
}

async function loadData() {
  loading.value = true
  try {
    const locIdStr = String(props.lokasiId)
    const payload = await api.get(`/public/monitoring?id=${locIdStr}`)

    if (payload?.success && payload.data) {
      lokasi.value = payload.data.lokasi
      
      const allBudidaya = payload.data.budidaya || []
      budidayaList.value = allBudidaya.map(b => ({
        ...b,
        nama_jamur: b.nama_jamur || b.jenis || 'Jamur'
      }))

      activeBudidaya.value = budidayaList.value.filter(b => b.status === 'aktif')

      allGrowthRecords.value = payload.data.pertumbuhan || []
      allHarvestRecords.value = payload.data.panen || []
      allEnvRecords.value = payload.data.lingkungan || []

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

function openDownloadModal() {
  showDownloadModal.value = true
}

function closeDownloadModal() {
  if (isDownloading.value) return
  showDownloadModal.value = false
}

async function submitDownloadForm() {
  const form = downloadForm.value
  if (!form.nama.trim() || !form.email.trim() || !form.instansi.trim() || !form.tujuan.trim()) {
    alert('Nama, email, instansi, dan tujuan unduh wajib diisi.')
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    alert('Format email tidak valid.')
    return
  }
  if (form.tipe_ekspor === 'per_jamur' && !form.id_budidaya) {
    alert('Pilih siklus jamur yang akan diekspor.')
    return
  }

  isDownloading.value = true
  try {
    await api.post('/public/download-log', {
      nama: form.nama.trim(),
      email: form.email.trim(),
      instansi: form.instansi.trim(),
      tujuan: form.tujuan.trim(),
      tipe_laporan: form.tipe_ekspor === '3_bulan' ? 'Laporan Umum (3 Bulan Terakhir)' : 'Laporan Siklus Jamur (Selesai)',
      bulan: selectedMonth.value,
      id_budidaya: form.tipe_ekspor === 'per_jamur' ? Number(form.id_budidaya) : null
    })
    await exportBulananExcel()
    showDownloadModal.value = false
  } catch (error) {
    console.error('Gagal memulai unduhan:', error)
    alert(error.message || 'Gagal mencatat identitas atau membuat file ekspor.')
  } finally {
    isDownloading.value = false
  }
}

async function exportBulananExcel() {
  if (!lokasi.value || !selectedMonth.value) return;
  const ym = selectedMonth.value;
  const workbook = new ExcelJS.Workbook();

  const type = downloadForm.value.tipe_ekspor;

  if (type === '3_bulan') {
    const d = new Date(ym.split('-')[0], ym.split('-')[1] - 1);
    const months = [];
    for(let i = 0; i < 3; i++) {
      const iterD = new Date(d.getFullYear(), d.getMonth() - i, 1);
      months.push(`${iterD.getFullYear()}-${String(iterD.getMonth() + 1).padStart(2, '0')}`);
    }
    
    const envRecords = allEnvRecords.value.filter(r => r.tanggal_pengukuran && months.some(m => r.tanggal_pengukuran.startsWith(m)))
      .sort((a,b) => new Date(a.tanggal_pengukuran) - new Date(b.tanggal_pengukuran));
    const harvestRecords = allHarvestRecords.value.filter(r => r.tanggal_panen && months.some(m => r.tanggal_panen.startsWith(m)))
      .sort((a,b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen));

    const ws1 = workbook.addWorksheet('1. Executive Summary', { views: [{ showGridLines: false }] });
    ws1.addRow(['LAPORAN PRODUKSI GLOBAL']).font = { bold: true, size: 16 };
    ws1.addRow([]);
    ws1.addRow(['Lokasi', lokasi.value.nama_lokasi]).font = { bold: true };
    ws1.addRow(['Bulan Acuan', formattedMonth.value]).font = { bold: true };
    ws1.addRow(['Tipe Laporan', 'Laporan Umum (3 Bulan Terakhir)']).font = { bold: true };
    ws1.addRow(['Pihak Pengunduh', `${downloadForm.value.nama} (${downloadForm.value.instansi})`]).font = { bold: true };
    ws1.addRow(['Total Panen Agregat', harvestRecords.reduce((a, b) => a + (Number(b.jumlah_panen) || 0), 0) + ' gram']).font = { bold: true };
    ws1.columns = [{width: 30}, {width: 40}];

    const ws2 = workbook.addWorksheet('2. Produksi Harian');
    ws2.addRow(['Tanggal', 'Total Panen (gram)']).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } };
    
    const dailyHarvest = {};
    harvestRecords.forEach(r => {
      const date = r.tanggal_panen.split('T')[0];
      dailyHarvest[date] = (dailyHarvest[date] || 0) + (Number(r.jumlah_panen) || 0);
    });
    const sortedDates = Object.keys(dailyHarvest).sort();
    sortedDates.forEach(date => {
      ws2.addRow([date, dailyHarvest[date]]);
    });
    
    if (sortedDates.length > 0) {
      ws2.addConditionalFormatting({
        ref: `B2:B${sortedDates.length + 1}`,
        rules: [{ type: 'dataBar', color: { argb: 'FF16A34A' } }]
      });
    }
    ws2.columns = [{width: 20}, {width: 30}];

    const ws3 = workbook.addWorksheet('3. Kondisi Lingkungan');
    ws3.addRow(['Tanggal', 'Avg Suhu (°C)', 'Avg Kelembapan (%)']).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws3.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
    const dailyEnv = {};
    envRecords.forEach(r => {
      const date = r.tanggal_pengukuran.split('T')[0];
      if (!dailyEnv[date]) dailyEnv[date] = { s: [], k: [] };
      if (r.suhu) dailyEnv[date].s.push(Number(r.suhu));
      if (r.kelembaban) dailyEnv[date].k.push(Number(r.kelembaban));
    });
    
    const envDates = Object.keys(dailyEnv).sort();
    envDates.forEach(date => {
      const sAvg = dailyEnv[date].s.length ? (dailyEnv[date].s.reduce((a,b)=>a+b,0)/dailyEnv[date].s.length).toFixed(1) : '-';
      const kAvg = dailyEnv[date].k.length ? (dailyEnv[date].k.reduce((a,b)=>a+b,0)/dailyEnv[date].k.length).toFixed(1) : '-';
      ws3.addRow([date, Number(sAvg)||sAvg, Number(kAvg)||kAvg]);
    });

    if (envDates.length > 0) {
      ws3.addConditionalFormatting({
        ref: `B2:B${envDates.length + 1}`,
        rules: [{ type: 'colorScale', cfvo: [{type: 'min'}, {type: 'percentile', value: 50}, {type: 'max'}], color: [{argb: 'FF3B82F6'}, {argb: 'FFFDE047'}, {argb: 'FFEF4444'}] }]
      });
    }
    ws3.columns = [{width: 20}, {width: 25}, {width: 25}];

  } else {
    // per_jamur
    const idBudidaya = downloadForm.value.id_budidaya;
    const b = budidayaList.value.find(bd => String(bd.id_budidaya) === String(idBudidaya));
    const envs = allEnvRecords.value.filter(r => r.tanggal_pengukuran && String(r.id_budidaya) === String(idBudidaya)).sort((a,b) => new Date(a.tanggal_pengukuran) - new Date(b.tanggal_pengukuran));
    const harvests = allHarvestRecords.value.filter(r => r.tanggal_panen && String(r.id_budidaya) === String(idBudidaya)).sort((a,b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen));

    const ws1 = workbook.addWorksheet('1. Rapor Siklus', { views: [{ showGridLines: false }] });
    ws1.addRow(['EVALUASI SIKLUS BUDIDAYA']).font = { bold: true, size: 16 };
    ws1.addRow([]);
    ws1.addRow(['Lokasi', lokasi.value.nama_lokasi]).font = { bold: true };
    ws1.addRow(['Pihak Pengunduh', `${downloadForm.value.nama} (${downloadForm.value.instansi})`]).font = { bold: true };
    ws1.addRow(['Kode Budidaya', `BDY-${String(idBudidaya).padStart(3, '0')}`]).font = { bold: true };
    ws1.addRow(['Jenis Jamur', b ? b.nama_jamur : '-']).font = { bold: true };
    ws1.addRow(['Tanggal Mulai', b ? formatDate(b.tanggal_mulai) : '-']).font = { bold: true };
    ws1.addRow(['Tanggal Selesai', b ? formatDate(b.tanggal_selesai) : '-']).font = { bold: true };
    ws1.addRow(['Total Panen Bersih', harvests.reduce((a, v) => a + (Number(v.jumlah_panen) || 0), 0) + ' gram']).font = { bold: true };
    ws1.addRow(['Alasan Selesai', b ? b.alasan_selesai : '-']).font = { bold: true };
    ws1.columns = [{width: 30}, {width: 40}];

    const ws2 = workbook.addWorksheet('2. Histori Panen');
    ws2.addRow(['Panen Ke-', 'Tanggal Panen', 'Jumlah (gram)', 'Petugas']).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB45309' } };
    
    harvests.forEach((h, idx) => {
      ws2.addRow([idx + 1, formatDate(h.tanggal_panen), Number(h.jumlah_panen) || 0, h.nama_petugas || '-']);
    });

    if (harvests.length > 0) {
      ws2.addConditionalFormatting({
        ref: `C2:C${harvests.length + 1}`,
        rules: [{ type: 'dataBar', color: { argb: 'FF16A34A' } }]
      });
    }
    ws2.columns = [{width: 15}, {width: 20}, {width: 25}, {width: 30}];
    
    const ws3 = workbook.addWorksheet('3. Histori Lingkungan');
    ws3.addRow(['Waktu', 'Suhu (°C)', 'Kelembapan (%)']).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws3.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
    envs.forEach(e => {
      ws3.addRow([
        `${formatDate(e.tanggal_pengukuran)} ${new Date(e.tanggal_pengukuran).toLocaleTimeString('id-ID')}`, 
        Number(e.suhu) || '-', 
        Number(e.kelembaban) || '-'
      ]);
    });
    if (envs.length > 0) {
      ws3.addConditionalFormatting({
        ref: `B2:B${envs.length + 1}`,
        rules: [{ type: 'colorScale', cfvo: [{type: 'min'}, {type: 'max'}], color: [{argb: 'FF3B82F6'}, {argb: 'FFEF4444'}] }]
      });
    }
    ws3.columns = [{width: 30}, {width: 20}, {width: 20}];
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_Lengkap_${lokasi.value.nama_lokasi.replace(/\s+/g, '_')}_${ym}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

.table-card-modern { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; }
.table-header-flex { display: flex; justify-content: space-between; align-items: center; padding-right: 24px; }
.table-title { margin: 0; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; font-size: 16px; color: #111827; font-weight: 800; }
.header-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.btn-export-csv { background: #16a34a; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2); }
.btn-export-csv:hover { background: #15803d; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(22, 163, 74, 0.3); }
.btn-export-pdf { background: #dc2626; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2); }
.btn-export-pdf:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(220, 38, 38, 0.3); }
.btn-export { background: white; color: #16a34a; border: 1px solid #16a34a; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
.btn-export:hover { background: #f0fdf4; border-color: #15803d; color: #15803d; box-shadow: 0 2px 4px rgba(22, 163, 74, 0.1); }
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

.detail-image {
  width: 100%;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.detail-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

@media print {
  * {
    background-color: transparent !important;
    background-image: none !important;
  }
  
  body, .public-container {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
    height: auto !important;
    width: 100% !important;
  }

  .header-actions, .btn-export, .back-link {
    display: none !important;
  }

  .page-header-modern {
    background: white !important;
    border: none !important;
    box-shadow: none !important;
  }

  .insight-box { border: 1px solid #16a34a; background: transparent; padding: 16px; page-break-inside: avoid; }
  .stat-card { background: white !important; }
  .chart-box { background: white !important; }
  .table-card-modern { background: white !important; }
  .table-header-modern { background: #f9fafb !important; }
  .detail-image { background: white !important; }
  
  img { max-width: 100%; }
  
  @page {
    margin: 0.4in;
    size: landscape;
  }
}

@media(max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .charts-container { grid-template-columns: 1fr; }
  .detail-image { height: 240px; }
}

@media(max-width: 640px) {
  .stats-row { grid-template-columns: 1fr; }
  .header-actions { flex-direction: column; align-items: stretch; width: 100%; }
  .modern-input, .btn-export-csv, .btn-export-pdf { width: 100%; justify-content: center; box-sizing: border-box; }
  .table-card-modern { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 8px; }
  .laporan-grid { min-width: 800px; }
  .table-header-flex { flex-direction: column; align-items: flex-start; gap: 12px; padding-bottom: 16px; }
  .btn-export { width: 100%; justify-content: center; margin-left: 24px; width: calc(100% - 48px); }
}
</style>