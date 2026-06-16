<template>
  <div class="petugas-operasional">
    <Transition name="toast">
      <div v-if="toast.show" :class="['toast-notification', toast.type]">
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </Transition>

    <header class="operasional-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Kondisi Lingkungan Harian</h1>
          <p class="page-subtitle">Catat suhu, kelembapan, dan cahaya sesuai target harian.</p>
        </div>
        
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <div v-if="lokasiOptions.length > 0" class="budidaya-selector">
            <label>Rumah Jamur Aktif:</label>
            <select v-model="selectedLokasi" @change="handleSelectChange" class="modern-select">
              <option v-for="l in lokasiOptions" :key="l.id_lokasi" :value="l">
                {{ l.nama_lokasi }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading" class="empty-state">Memuat data rumah jamur...</div>
      <div v-else-if="budidayaList.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" class="icon-large"><path fill="currentColor" d="M22 2H2v20l4-4h16V2zM12 11H9V8h3v3zm5 0h-3V8h3v3z"/></svg>
        <h3>Tidak Ada Rumah Jamur Aktif</h3>
        <p>Belum ada rumah jamur yang ditugaskan kepada Anda atau tidak ada budidaya yang berjalan saat ini.</p>
      </div>

      <div v-else-if="selectedLokasi" class="detail-container">
        <div class="info-banner" style="margin-bottom: 24px;">
          <div class="info-item">
            <span class="label">Lokasi Rumah Jamur</span>
            <span class="value fw-bold">{{ selectedLokasi.nama_lokasi }}</span>
          </div>

          <div class="info-item">
            <span class="label">Kapasitas Total Rak</span>
            <span class="value">{{ selectedLokasi.kapasitas_rak || 0 }} Rak</span>
          </div>

          <div class="info-item">
            <span class="label">Siklus Budidaya Aktif</span>
            <span class="value">{{ selectedLokasi.budidaya_ids.length }} Siklus</span>
          </div>

          <div class="info-item">
            <span class="label">Total Rak Terpakai</span>
            <span class="value">{{ selectedLokasi.total_rak }} Rak</span>
          </div>
        </div>

        <div class="form-card fade-in">
          <h2 class="form-title">Pencatatan Lingkungan Harian</h2>
          <p class="daily-progress" :class="{ complete: todayEnvironmentCount >= 2 }">
            Hari ini: {{ todayEnvironmentCount }}/2 pencatatan minimum
          </p>
          <form @submit.prevent="submitLingkungan">
            <div class="form-grid">
              <div class="form-group">
                <label>Tanggal Pengukuran <span class="text-danger">*</span></label>
                <input type="date" v-model="formLingkungan.tanggal_pengukuran" :min="todayISO" :max="todayISO" disabled required class="modern-input" />
                <small class="date-lock-note">Tanggal dikunci ke hari ini untuk pencatatan real-time.</small>
              </div>
              <div class="form-group">
                <label>Waktu Pengukuran <span class="text-danger">*</span></label>
                <select v-model="formLingkungan.waktu_pengukuran" class="modern-select" required>
                  <option value="Pagi">Pagi (06:00 - 08:00)</option>
                  <option value="Sore">Sore (16:00 - 18:00)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Suhu Lingkungan (°C) <span class="text-danger">*</span></label>
                <input type="number" step="0.1" min="0" max="100" v-model.number="formLingkungan.suhu" placeholder="Misal: 25.5" class="modern-input" required />
              </div>
              <div class="form-group">
                <label>Kelembapan Lingkungan (%) <span class="text-danger">*</span></label>
                <input type="number" step="0.1" min="0" max="100" v-model.number="formLingkungan.kelembaban" placeholder="Misal: 85.0" class="modern-input" required />
              </div>
<div class="form-group full-width">
                <label>Intensitas Cahaya (Lux/Lumens) </label>
                <input type="number" step="0.1" min="0" max="50000" v-model.number="formLingkungan.intensitas_cahaya" placeholder="Misal: 300" class="modern-input" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                 {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data Lingkungan' }}
              </button>
            </div>
          </form>
        </div>

        <div class="history-card mt-6">
          <h3 style="margin-bottom: 16px; font-weight: 600; color: #1f2937;">Riwayat Pengukuran ({{ selectedLokasi.nama_lokasi }})</h3>
          <div v-if="riwayatLoading" class="text-center py-4 text-muted">Memuat riwayat...</div>
          <div v-else-if="riwayatLingkungan.length === 0" class="text-center py-4 text-muted" style="background: #f9fafb; border-radius: 8px;">
            Belum ada data pengukuran lingkungan untuk rumah jamur ini.
          </div>
          <div v-else class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Waktu</th>
                  <th>Suhu</th>
                  <th>Kelembapan</th>
                  <th>Cahaya</th>
                  <th>Status Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in riwayatLingkungan" :key="item.id_lingkungan">
                  <td>{{ formatDate(item.tanggal_pengukuran) }}</td>
                  <td><span class="waktu-badge" :class="getWaktuClass(item.waktu_pengukuran)">{{ getWaktuDisplay(item.waktu_pengukuran) }}</span></td>
                  <td>{{ item.suhu }} °C</td>
                  <td>{{ item.kelembaban }} %</td>
                  <td>{{ item.intensitas_cahaya !== null && item.intensitas_cahaya !== undefined ? item.intensitas_cahaya + ' Lux' : '-' }}</td>
                  <td><span :class="['lock-badge', { today: isToday(item.tanggal_pengukuran) }]">{{ isToday(item.tanggal_pengukuran) ? 'Hari ini' : 'Terkunci' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { budidayaService, lingkunganService, lokasiService } from '../../services/dataService.js'

const now = new Date()
const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const apiOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api').replace(/\/api\/?$/, '')

const budidayaList = ref([])
const kapasitasLokasiMap = ref(new Map())

const lokasiOptions = computed(() => {
  const map = new Map()
  budidayaList.value.forEach(b => {
    if (!map.has(b.id_lokasi)) {
      map.set(b.id_lokasi, {
        id_lokasi: b.id_lokasi,
        nama_lokasi: b.nama_lokasi,
        kapasitas_rak: kapasitasLokasiMap.value.get(b.id_lokasi) || 0,
        budidaya_ids: [],
        total_rak: 0
      })
    }
    const loc = map.get(b.id_lokasi)
    loc.budidaya_ids.push(b.id_budidaya)
    loc.total_rak += (Number(b.jumlah_rak) || 0)
  })
  return Array.from(map.values())
})

const selectedLokasi = ref(null)
const loading = ref(true)
const riwayatLingkungan = ref([])
const riwayatLoading = ref(false)
const isSubmitting = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })
const todayEnvironmentCount = computed(() => riwayatLingkungan.value.filter((item) => isToday(item.tanggal_pengukuran)).length)
let toastTimer = null

const formLingkungan = ref({
  tanggal_pengukuran: todayISO,
  waktu_pengukuran: 'Pagi',
  suhu: '',
  kelembaban: '',
  intensitas_cahaya: ''
})

function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

function uploadUrl(filename) {
  return `${apiOrigin}/uploads/${encodeURIComponent(filename)}`
}

function normalizeDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isToday(value) {
  return normalizeDate(value) === todayISO
}

function getWaktuClass(waktu) {
  const w = (waktu || 'pagi').toLowerCase()
  if (w.includes('sore')) return 'sore'
  if (w.includes('siang')) return 'siang'
  return 'pagi'
}

function getWaktuDisplay(waktu) {
  const w = waktu || 'Pagi'
  if (w === 'Sore/Malam') return 'Sore'
  return w
}

async function fetchBudidaya() {
  loading.value = true
  try {
    const role = localStorage.getItem('user_role')
    const [res, lokasiRes] = await Promise.all([
      role === 'admin'
        ? budidayaService.getAll()
        : budidayaService.getByPetugas({ status: 'aktif,inisiasi' }),
      lokasiService.getAll()
    ])

    const map = new Map()
    if (lokasiRes?.data) {
      lokasiRes.data.forEach(l => map.set(l.id_lokasi, Number(l.jumlah_rak) || 0))
    }
    kapasitasLokasiMap.value = map

    budidayaList.value = (res?.data || []).filter((item) => ['aktif', 'inisiasi'].includes(item.status))
    if (lokasiOptions.value.length > 0) {
      selectedLokasi.value = lokasiOptions.value[0]
      await loadRiwayat()
    }
  } catch (error) {
    showToast(error.message || 'Gagal memuat rumah jamur', 'error')
  } finally {
    loading.value = false
  }
}

async function handleSelectChange() {
  await loadRiwayat()
}

async function loadRiwayat() {
  if (!selectedLokasi.value || selectedLokasi.value.budidaya_ids.length === 0) return
  riwayatLoading.value = true
  try {
    const res = await lingkunganService.getByBudidaya(selectedLokasi.value.budidaya_ids[0])
    riwayatLingkungan.value = res?.data || []
  } catch (error) {
    showToast(error.message || 'Gagal memuat riwayat lingkungan', 'error')
  } finally {
    riwayatLoading.value = false
  }
}

async function submitLingkungan() {
  if (!selectedLokasi.value || selectedLokasi.value.budidaya_ids.length === 0) {
    showToast('Pilih rumah jamur terlebih dahulu', 'error')
    return
  }

  const { suhu, kelembaban, intensitas_cahaya } = formLingkungan.value
  if (suhu < 0 || suhu > 100) {
    showToast('Input Suhu tidak wajar! (Batas wajar: 0°C - 100°C)', 'error')
    return
  }
  if (kelembaban < 0 || kelembaban > 100) {
    showToast('Input Kelembapan tidak wajar! (Batas wajar: 0% - 100%)', 'error')
    return
  }
  if (intensitas_cahaya !== '' && intensitas_cahaya !== null && (intensitas_cahaya < 0 || intensitas_cahaya > 50000)) {
    showToast('Input Intensitas Cahaya tidak wajar! (Batas wajar: 0 - 50.000 Lux)', 'error')
    return
  }

  isSubmitting.value = true
  try {
    const promises = selectedLokasi.value.budidaya_ids.map(id_budidaya => {
      const formData = new FormData()
      formData.append('id_budidaya', id_budidaya)
      formData.append('tanggal_pengukuran', todayISO)
      formData.append('waktu_pengukuran', formLingkungan.value.waktu_pengukuran.split(' ')[0])
      formData.append('suhu', formLingkungan.value.suhu)
      formData.append('kelembaban', formLingkungan.value.kelembaban)
      if (formLingkungan.value.intensitas_cahaya !== '') {
        formData.append('intensitas_cahaya', formLingkungan.value.intensitas_cahaya)
      }

      return lingkunganService.create(formData)
    })

    await Promise.all(promises)

    showToast('Data lingkungan berhasil disimpan untuk seluruh rak aktif di lokasi ini!')
    formLingkungan.value.suhu = ''
    formLingkungan.value.kelembaban = ''
    formLingkungan.value.intensitas_cahaya = ''
    formLingkungan.value.waktu_pengukuran = formLingkungan.value.waktu_pengukuran.startsWith('Pagi') ? 'Sore' : 'Pagi'
    await loadRiwayat()
  } catch (error) {
    showToast(error.message || 'Gagal menyimpan data lingkungan', 'error')
  } finally {
    isSubmitting.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

onMounted(fetchBudidaya)
onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
.daily-progress { margin: -6px 0 18px; font-size: 13px; color: #b45309; font-weight: 700; }
.daily-progress.complete { color: #15803d; }
.petugas-operasional {
  background: #f3f4f6;
  min-height: 100vh;
}

.operasional-header {
  background: white;
  padding: 32px 40px;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: #6b7280;
  font-size: 15px;
  margin: 0;
}

.budidaya-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.budidaya-selector label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
}

.main-content {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.empty-state h3 {
  margin: 16px 0 8px 0;
  color: #111827;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

.icon-large {
  width: 64px;
  height: 64px;
  color: #d1d5db;
}

.info-banner {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  font-size: 16px;
  color: #111827;
}

.fw-bold { font-weight: 700; }
.text-danger { color: #dc2626; }
.text-muted { color: #9ca3af; font-size: 12px; }

.form-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.history-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-top: 24px;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.modern-input, .modern-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  background: #f9fafb;
}

.modern-input:focus, .modern-select:focus {
  outline: none;
  border-color: #16a34a;
  background: white;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.btn-primary {
  background: #16a34a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #15803d;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon-danger {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-icon-danger:hover {
  background: #fecaca;
}

.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table th {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
}

.modern-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
  font-size: 14px;
}

.waktu-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.waktu-badge.pagi { background: #dbeafe; color: #1e3a8a; }
.waktu-badge.siang { background: #fef3c7; color: #92400e; }
.waktu-badge.sore { background: #f3e8ff; color: #581c87; }

/* Toast */
.toast-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  z-index: 1000;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-notification.success .toast-icon { color: #16a34a; }
.toast-notification.error .toast-icon { color: #dc2626; }
.toast-message { font-weight: 500; color: #111827; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, calc(-50% - 20px)) scale(0.9); }
.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.date-lock-note { color: #6b7280; font-size: 12px; line-height: 1.4; }
.modern-input:disabled { background: #f3f4f6; color: #4b5563; cursor: not-allowed; }
.photo-preview-wrap { display:flex; align-items:center; gap:12px; padding:10px; border:1px solid #d1fae5; background:#f0fdf4; border-radius:10px; font-size:13px; color:#166534; }
.photo-preview { width:96px; height:72px; object-fit:cover; border-radius:8px; }
.table-photo { width:56px; height:42px; object-fit:cover; border-radius:6px; border:1px solid #e5e7eb; }
.photo-link { display:inline-flex; }
.lock-badge { display:inline-flex; padding:4px 8px; border-radius:999px; background:#f3f4f6; color:#6b7280; font-size:11px; font-weight:700; white-space:nowrap; }
.lock-badge.today { background:#dcfce7; color:#166534; }
</style>
