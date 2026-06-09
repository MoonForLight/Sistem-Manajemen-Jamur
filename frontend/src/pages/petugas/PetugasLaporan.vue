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
          <span class="meta-value">{{ totalPanen }} Kg</span>
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
        <button class="btn-export-csv" @click="exportExcel">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Ekspor Excel
        </button>
      </div>
    </header>

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
          <span class="stat-label">Total Panen</span>
          <span class="stat-value text-green">{{ totalPanen }} Kg</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Pencatatan Lingkungan</span>
          <span class="stat-value">{{ monthlyEnvRecords.length }}</span>
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
    avgSuhu.value = (sumSuhu / monthlyEnvRecords.value.length).toFixed(1)
    avgKelembapan.value = (sumKelembapan / monthlyEnvRecords.value.length).toFixed(1)
  } else {
    avgSuhu.value = 0
    avgKelembapan.value = 0
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

    if (totalPanen.value > 0) insight += `Total hasil panen bulan ini mencapai ${totalPanen.value} Kg.`
    else insight += "Belum ada panen yang tercatat bulan ini."
    
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

async function exportExcel() {
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
    ['Bulan Laporan', formattedMonth.value],
    ['Petugas Pelapor', userName.value || '-'],
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
  
  function getLocalDateString(d) {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  
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
        cell.alignment = { horizontal: colNumber === 3 ? 'right' : 'left', vertical: 'middle' };
      });
    });
  }

  worksheet.addRow([]);
  
  // Section 4
  const s4Title = worksheet.addRow(['4. DATA DAFTAR RAK (BUDIDAYA) AKTIF & HISTORIS']);
  worksheet.mergeCells(`A${s4Title.number}:K${s4Title.number}`);
  s4Title.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF1F2937' } };
  s4Title.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
  s4Title.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  s4Title.height = 25;
  s4Title.getCell(1).alignment = { vertical: 'middle' };

  const header4 = [
    'Kode Rak', 'Jenis Jamur', 'Media Tanam', 'Status Operasional', 
    'Tanggal Mulai (Inkubasi)', 'Tanggal Selesai (Afkir)',
    'Frekuensi Catat Lingkungan', 'Suhu Rata-rata Sepanjang Hidup (°C)',
    'Kelembapan Rata-rata Sepanjang Hidup (%)', 'Total Akumulasi Panen (Kg)'
  ];
  const rowH4 = worksheet.addRow(header4);
  rowH4.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  rowH4.height = 40;
  rowH4.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });

  if (assignedBudidaya.value.length === 0) {
    const emptyRow = worksheet.addRow(['(Tidak ada data rak yang ditugaskan)']);
    worksheet.mergeCells(`A${emptyRow.number}:J${emptyRow.number}`);
    emptyRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  } else {
    assignedBudidaya.value.forEach(b => {
      const envs = allEnvRecords.value.filter(e => Number(e.id_budidaya) === Number(b.id_budidaya));
      const harvs = allHarvestRecords.value.filter(h => Number(h.id_budidaya) === Number(b.id_budidaya));
      
      let avgS = '-', avgK = '-';
      if (envs.length > 0) {
        avgS = Number((envs.reduce((sum, e) => sum + (Number(e.suhu) || 0), 0) / envs.length).toFixed(1));
        avgK = Number((envs.reduce((sum, e) => sum + (Number(e.kelembaban) || 0), 0) / envs.length).toFixed(1));
      }
      
      const totHarv = harvs.reduce((sum, h) => sum + (Number(h.jumlah_panen) || 0), 0);
  
      const row = worksheet.addRow([
        `BDY-${String(b.id_budidaya).padStart(3, '0')}`,
        b.nama_jamur || '-',
        b.nama_media || '-',
        b.status === 'aktif' ? 'Aktif' : 'Selesai',
        formatDate(b.tanggal_mulai),
        formatDate(b.tanggal_selesai),
        envs.length,
        avgS,
        avgK,
        totHarv > 0 ? Number(totHarv.toFixed(1)) : 0
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
  link.setAttribute('download', `Laporan_Petugas_Lengkap_${ym}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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