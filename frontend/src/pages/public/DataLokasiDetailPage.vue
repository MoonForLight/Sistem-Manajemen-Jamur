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
          <button @click="exportBulananExcel" class="btn-export-csv">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Ekspor Excel
          </button>
        </div>
      </header>

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
          <span class="stat-value text-green">{{ totalPanen }} Kg</span>
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
            <Bar :data="harvestChartData" :options="chartOptions" ref="harvestChartRef" />
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
const totalPanen = ref(0)
const aiInsight = ref('')

const envChartData = ref({ labels: [], datasets: [] })
const harvestChartData = ref({ labels: [], datasets: [] })
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { font: { family: 'Inter' } } } },
  scales: { y: { beginAtZero: true }, x: { ticks: { font: { family: 'Inter' } } } }
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
    avgSuhu.value = (sumSuhu / monthlyEnvRecords.value.length).toFixed(1)
    avgKelembapan.value = (sumKelembapan / monthlyEnvRecords.value.length).toFixed(1)
  } else {
    avgSuhu.value = 0
    avgKelembapan.value = 0
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

    if (totalPanen.value > 0) insight += `Total hasil panen yang dilaporkan mencapai ${totalPanen.value} Kg.`
    else insight += "Belum ada aktivitas panen yang tercatat bulan ini."
    
    aiInsight.value = insight
  }

  const daysInMonth = new Date(ym.split('-')[0], ym.split('-')[1], 0).getDate()
  const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1))

  const dailySuhu = Array(daysInMonth).fill(null)
  const dailyKelembapan = Array(daysInMonth).fill(null)
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0')
    const dateStr = `${ym}-${dayStr}`
    
    const dayRecs = monthlyEnvRecords.value.filter(r => getLocalDateString(r.tanggal_pengukuran) === dateStr)
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
    datasets: [{ label: 'Hasil Panen (Kg)', backgroundColor: '#16a34a', data: dailyHarvest, borderRadius: 4 }]
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
        nama_jamur: b.nama_jamur || 'Jamur'
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

async function exportBulananExcel() {
  if (!lokasi.value || !selectedMonth.value) return;
  const ym = selectedMonth.value;
  const daysInMonth = new Date(ym.split('-')[0], ym.split('-')[1], 0).getDate();
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Laporan Bulanan', { views: [{ showGridLines: false }] });
  
  // Header
  worksheet.mergeCells('A1:K1');
  worksheet.getCell('A1').value = 'LAPORAN KOMPREHENSIF BUDIDAYA JAMUR - SISTEM MANAJEMEN JAMUR';
  worksheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 30;
  
  worksheet.addRow([]);
  
  // Informasi Umum
  worksheet.mergeCells('A3:K3');
  worksheet.getCell('A3').value = 'INFORMASI UMUM';
  worksheet.getCell('A3').font = { bold: true, size: 12, color: { argb: 'FF1F2937' } };
  worksheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
  worksheet.getCell('A3').alignment = { horizontal: 'left', vertical: 'middle' };
  worksheet.getCell('A3').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  worksheet.getRow(3).height = 25;

  const infoData = [
    ['Lokasi', lokasi.value.nama_lokasi],
    ['Bulan Laporan', formattedMonth.value],
    ['Tanggal Diekspor', new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })],
    ['Total Panen Bulan Ini', `${totalPanen.value} Kg`],
    ['Total Pencatatan Sistem', `${monthlyEnvRecords.value.length} Kali`],
    ['Catatan Analisis (AI)', aiInsight.value]
  ];

  infoData.forEach(info => {
    const row = worksheet.addRow([info[0], info[1]]);
    worksheet.mergeCells(`B${row.number}:K${row.number}`);
    row.getCell(1).font = { bold: true };
    row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row.getCell(2).alignment = { wrapText: true, vertical: 'middle' };
    if(info[0] === 'Catatan Analisis (AI)') {
      row.height = 45;
    }
  });

  worksheet.addRow([]);
  
  // Section 1
  const s1Title = worksheet.addRow(['1. RINGKASAN PERFORMA LINGKUNGAN & PANEN HARIAN']);
  worksheet.mergeCells(`A${s1Title.number}:K${s1Title.number}`);
  s1Title.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF1F2937' } };
  s1Title.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
  s1Title.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  s1Title.height = 25;
  s1Title.getCell(1).alignment = { vertical: 'middle' };

  const header1 = [
    'Tanggal', 'Suhu Rata-rata (°C)', 'Suhu Terendah (°C)', 'Suhu Tertinggi (°C)',
    'Kelembapan Rata-rata (%)', 'Kelembapan Terendah (%)', 'Kelembapan Tertinggi (%)',
    'Intensitas Cahaya (lux)', 'Frekuensi Catat', 'Total Hasil Panen (Kg)', 'Status Lingkungan'
  ];
  const rowH1 = worksheet.addRow(header1);
  rowH1.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  rowH1.height = 30;
  rowH1.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0');
    const dateStr = `${ym}-${dayStr}`;
    
    const dayRecs = monthlyEnvRecords.value.filter(r => getLocalDateString(r.tanggal_pengukuran) === dateStr);
    
    let avgS = '', minS = '', maxS = '';
    let avgK = '', minK = '', maxK = '';
    let avgC = '';
    let countEnv = dayRecs.length;
    let insight = '-';
    
    if (countEnv > 0) {
      const suhus = dayRecs.map(r => Number(r.suhu || 0));
      const kelembabans = dayRecs.map(r => Number(r.kelembaban || 0));
      const cahayas = dayRecs.map(r => Number(r.intensitas_cahaya || 0));
      
      avgS = Number((suhus.reduce((a,b) => a+b, 0) / countEnv).toFixed(1));
      minS = Number(Math.min(...suhus).toFixed(1));
      maxS = Number(Math.max(...suhus).toFixed(1));
      
      avgK = Number((kelembabans.reduce((a,b) => a+b, 0) / countEnv).toFixed(1));
      minK = Number(Math.min(...kelembabans).toFixed(1));
      maxK = Number(Math.max(...kelembabans).toFixed(1));
      
      avgC = Number((cahayas.reduce((a,b) => a+b, 0) / countEnv).toFixed(1));

      if (avgS > 28) insight = 'Suhu Panas';
      else if (avgS < 20) insight = 'Suhu Dingin';
      else insight = 'Optimal';
    }
    
    const harvRecs = monthlyHarvestRecords.value.filter(r => getLocalDateString(r.tanggal_panen) === dateStr);
    let totHarv = harvRecs.reduce((acc, r) => acc + Number(r.jumlah_panen || 0), 0);
    
    const row = worksheet.addRow([
      dateStr,
      avgS, minS, maxS,
      avgK, minK, maxK,
      avgC,
      countEnv,
      totHarv > 0 ? Number(totHarv.toFixed(1)) : 0,
      insight
    ]);
    
    row.eachCell((cell, colNumber) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.alignment = { horizontal: colNumber === 1 || colNumber === 11 ? 'left' : 'right', vertical: 'middle' };
    });
  }
  
  worksheet.addRow([]);
  
  // Charts Section
  const chartStartRow = worksheet.lastRow.number + 2;
  worksheet.getCell(`A${chartStartRow}`).value = 'GRAFIK ANALISIS BULANAN';
  worksheet.getCell(`A${chartStartRow}`).font = { bold: true, size: 12, color: { argb: 'FF1F2937' } };
  worksheet.getCell(`A${chartStartRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
  worksheet.mergeCells(`A${chartStartRow}:K${chartStartRow}`);
  worksheet.getCell(`A${chartStartRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  worksheet.getRow(chartStartRow).height = 25;
  worksheet.getCell(`A${chartStartRow}`).alignment = { vertical: 'middle' };
  
  let imagesAdded = false;
  if (envChartRef.value?.chart?.canvas) {
    try {
      const imgData = envChartRef.value.chart.canvas.toDataURL('image/png');
      const imageId = workbook.addImage({ base64: imgData, extension: 'png' });
      worksheet.addImage(imageId, {
        tl: { col: 0, row: chartStartRow + 1 },
        ext: { width: 500, height: 250 }
      });
      imagesAdded = true;
    } catch(e) { console.error('Error adding env chart', e); }
  }
  if (harvestChartRef.value?.chart?.canvas) {
    try {
      const imgData2 = harvestChartRef.value.chart.canvas.toDataURL('image/png');
      const imageId2 = workbook.addImage({ base64: imgData2, extension: 'png' });
      worksheet.addImage(imageId2, {
        tl: { col: 6, row: chartStartRow + 1 },
        ext: { width: 500, height: 250 }
      });
      imagesAdded = true;
    } catch(e) { console.error('Error adding harvest chart', e); }
  }
  
  if (imagesAdded) {
    for(let i=0; i<15; i++) worksheet.addRow([]);
  }

  worksheet.addRow([]);
  
  // Section 2
  const s2Title = worksheet.addRow(['2. LOG DATA MENTAH LINGKUNGAN (SENSOR & MANUAL)']);
  worksheet.mergeCells(`A${s2Title.number}:K${s2Title.number}`);
  s2Title.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF1F2937' } };
  s2Title.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
  s2Title.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  s2Title.height = 25;
  s2Title.getCell(1).alignment = { vertical: 'middle' };

  const header2 = ['Kode Rak (Budidaya)', 'Waktu Pencatatan', 'Suhu (°C)', 'Kelembapan (%)', 'Intensitas Cahaya (lux)', 'Petugas Pencatat', '', '', '', '', ''];
  const rowH2 = worksheet.addRow(header2.slice(0, 6)); // We will merge across but let's just make columns look fine
  rowH2.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  rowH2.height = 30;
  rowH2.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  
  if (monthlyEnvRecords.value.length === 0) {
    const emptyRow = worksheet.addRow(['(Tidak ada data lingkungan tercatat pada bulan ini)']);
    worksheet.mergeCells(`A${emptyRow.number}:F${emptyRow.number}`);
    emptyRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  } else {
    monthlyEnvRecords.value.forEach(r => {
      const row = worksheet.addRow([
        `BDY-${String(r.id_budidaya).padStart(3, '0')}`,
        `${formatDate(r.tanggal_pengukuran)} ${new Date(r.tanggal_pengukuran).toLocaleTimeString('id-ID')}`,
        r.suhu ? Number(r.suhu) : '-',
        r.kelembaban ? Number(r.kelembaban) : '-',
        r.intensitas_cahaya ? Number(r.intensitas_cahaya) : '-',
        r.nama_petugas || '-'
      ]);
      row.eachCell((cell, colNumber) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { horizontal: colNumber <= 2 || colNumber === 6 ? 'left' : 'right', vertical: 'middle' };
      });
    });
  }

  worksheet.addRow([]);
  
  // Section 3
  const s3Title = worksheet.addRow(['3. LOG DATA MENTAH PANEN (HASIL PRODUKSI)']);
  worksheet.mergeCells(`A${s3Title.number}:K${s3Title.number}`);
  s3Title.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF1F2937' } };
  s3Title.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
  s3Title.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  s3Title.height = 25;
  s3Title.getCell(1).alignment = { vertical: 'middle' };

  const header3 = ['Kode Rak (Budidaya)', 'Tanggal Panen', 'Jumlah Bersih (Kg)', 'Petugas Pencatat'];
  const rowH3 = worksheet.addRow(header3);
  rowH3.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  rowH3.height = 30;
  rowH3.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  
  if (monthlyHarvestRecords.value.length === 0) {
    const emptyRow = worksheet.addRow(['(Tidak ada data panen tercatat pada bulan ini)']);
    worksheet.mergeCells(`A${emptyRow.number}:D${emptyRow.number}`);
    emptyRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  } else {
    monthlyHarvestRecords.value.forEach(r => {
      const row = worksheet.addRow([
        `BDY-${String(r.id_budidaya).padStart(3, '0')}`,
        formatDate(r.tanggal_panen),
        r.jumlah_panen ? Number(r.jumlah_panen) : '-',
        r.nama_petugas || '-'
      ]);
      row.eachCell((cell, colNumber) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { horizontal: colNumber >= 7 ? 'right' : 'left', vertical: 'middle' };
      });
    });
  }

  // Adjust columns widths
  worksheet.columns = [
    { width: 15 }, // Tanggal / Kode Rak
    { width: 18 }, // Suhu Rata-rata / Waktu / Tanggal
    { width: 18 }, // Suhu Terendah / Suhu
    { width: 18 }, // Suhu Tertinggi / Kelembapan
    { width: 18 }, // Kelembapan Rata / Intensitas
    { width: 18 }, // Kelembapan Min / Petugas
    { width: 18 }, // Kelembapan Max
    { width: 15 }, // Cahaya
    { width: 15 }, // Frekuensi
    { width: 18 }, // Total Panen
    { width: 18 }  // Status
  ];

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