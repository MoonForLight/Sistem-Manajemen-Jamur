<template>
  <div class="petugas-operasional">
    <!-- Page Header -->
    <header class="operasional-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Operasional Rumah Jamur</h1>
          <p class="page-subtitle">Pilih rumah jamur aktif untuk mencatat pertumbuhan atau panen harian.</p>
        </div>
        
        <!-- Dropdown Selector moved to header -->
        <div v-if="budidayaList.length > 0" class="budidaya-selector">
          <label>Rumah Jamur Aktif:</label>
          <select v-model="selectedBudidaya" @change="handleSelectChange" class="modern-select">
            <option v-for="b in budidayaList" :key="b.id_budidaya" :value="b">
              BDY-{{ String(b.id_budidaya).padStart(3, '0') }} - {{ b.nama_jamur }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading" class="empty-state">Memuat data rumah jamur...</div>
      <div v-else-if="budidayaList.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" class="icon-large"><path fill="currentColor" d="M22 2H2v20l4-4h16V2zM12 11H9V8h3v3zm5 0h-3V8h3v3z"/></svg>
        <h3>Tidak Ada Budidaya Aktif</h3>
        <p>Belum ada rumah jamur yang ditugaskan kepada Anda saat ini.</p>
      </div>

      <div v-else-if="selectedBudidaya" class="detail-container">
        <!-- Info Banner -->
        <div class="info-banner">
          <div class="info-item">
            <span class="label">ID Budidaya</span>
            <span class="value">BDY-{{ String(selectedBudidaya.id_budidaya).padStart(3, '0') }}</span>
          </div>
          <div class="info-item">
            <span class="label">Jenis Jamur</span>
            <span class="value fw-bold">{{ selectedBudidaya.nama_jamur }}</span>
          </div>
          <div class="info-item">
            <span class="label">Lokasi</span>
            <span class="value">{{ selectedBudidaya.nama_lokasi }}</span>
          </div>
          <div class="info-item">
            <span class="label">Fase Saat Ini</span>
            <span class="value fw-bold text-blue">{{ latestFase || 'Belum Ada' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Mulai Budidaya</span>
            <span class="value">{{ formatDate(selectedBudidaya.tanggal_mulai) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Update Hari Ini</span>
            <span class="value text-green fw-bold">{{ todayFormatted }}</span>
          </div>
        </div>

        <!-- Forms Tabs -->
        <div class="tabs-container">
          <button :class="['tab-btn', { active: activeForm === 'pertumbuhan' }]" @click="activeForm = 'pertumbuhan'">Catat Pertumbuhan</button>
          
          <div class="tab-wrapper" :title="!isPanenAllowed ? 'Terkunci: Ubah fase pertumbuhan ke \'Siap Panen\' terlebih dahulu.' : ''">
            <button 
              :class="['tab-btn', { active: activeForm === 'panen' }]" 
              @click="isPanenAllowed && (activeForm = 'panen')"
              :disabled="!isPanenAllowed"
            >
              <span v-if="!isPanenAllowed" style="margin-right: 6px;">🔒</span> Input Panen
            </button>
          </div>
        </div>

        <!-- PERTUMBUHAN FORM -->
        <div v-if="activeForm === 'pertumbuhan'" class="form-card fade-in">
          <h2 class="form-title">Laporan Pertumbuhan Harian</h2>
          <form @submit.prevent="submitPertumbuhan">
            <div class="form-grid">
              <div class="form-group">
                <label>Tanggal Pengamatan</label>
                <input type="date" v-model="formPertumbuhan.tanggal_pengamatan" required class="modern-input" />
              </div>
              <div class="form-group">
                <label>Fase Pertumbuhan</label>
                <select v-model="formPertumbuhan.fase" class="modern-input" required>
                  <option value="" disabled>Pilih fase saat ini</option>
                  <option value="Inkubasi">Inkubasi (Miselium)</option>
                  <option value="Pinhead">Pinhead (Bakal Jamur)</option>
                  <option value="Pembesaran">Pembesaran Tubuh Buah</option>
                  <option value="Panen">Siap Panen</option>
                </select>
              </div>
              <div class="form-group">
                <label>Suhu Lingkungan (°C)</label>
                <input type="number" step="0.1" v-model="formPertumbuhan.suhu" placeholder="Misal: 25.5" class="modern-input" required />
              </div>
              <div class="form-group">
                <label>Kelembapan Lingkungan (%)</label>
                <input type="number" step="0.1" v-model="formPertumbuhan.kelembaban" placeholder="Misal: 85.0" class="modern-input" required />
              </div>
              <div class="form-group full-width">
                <label>Intensitas Cahaya (Lux/Lumens) <span class="text-muted">- Opsional</span></label>
                <input type="number" step="0.1" v-model="formPertumbuhan.intensitas_cahaya" placeholder="Misal: 300" class="modern-input" />
              </div>
              <div class="form-group full-width">
                <label>Catatan / Kondisi Ekstra</label>
                <textarea v-model="formPertumbuhan.catatan" class="modern-input" rows="3" placeholder="Contoh: Terlihat sedikit hama, atau pertumbuhan sangat baik..."></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                 {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data Pertumbuhan' }}
              </button>
            </div>
          </form>
        </div>

        <!-- PANEN FORM -->
        <div v-if="activeForm === 'panen'" class="form-card fade-in">
          <h2 class="form-title">Input Data Panen</h2>
          <form @submit.prevent="submitPanen">
            <div class="form-grid">
              <div class="form-group">
                <label>Tanggal Panen</label>
                <input type="date" v-model="formPanen.tanggal_panen" required class="modern-input" />
              </div>
              <div class="form-group">
                <label>Jumlah Panen (Kg)</label>
                <input type="number" step="0.01" v-model="formPanen.jumlah_panen" placeholder="Misal: 12.5" required class="modern-input" />
              </div>
              <div class="form-group full-width">
                <label>Catatan Panen</label>
                <textarea v-model="formPanen.catatan" class="modern-input" rows="3" placeholder="Contoh: Kualitas bagus, ukuran rata-rata besar."></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                 {{ isSubmitting ? 'Menyimpan...' : 'Simpan Laporan Panen' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { budidayaService, pertumbuhanService, panenService } from '../../services/dataService.js'

const budidayaList = ref([])
const growthRecords = ref([])
const loading = ref(true)
const selectedBudidaya = ref(null)
const activeForm = ref('pertumbuhan')
const isSubmitting = ref(false)

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

const latestFase = computed(() => {
  if (!selectedBudidaya.value || !growthRecords.value.length) return ''
  const myRecords = growthRecords.value.filter(g => g.id_budidaya === selectedBudidaya.value.id_budidaya)
  if (myRecords.length === 0) return ''
  myRecords.sort((a, b) => new Date(b.tanggal_pengamatan) - new Date(a.tanggal_pengamatan) || b.id_pertumbuhan - a.id_pertumbuhan)
  return myRecords[0].fase || ''
})

const isPanenAllowed = computed(() => {
  return latestFase.value === 'Panen'
})

const formPertumbuhan = ref({
  tanggal_pengamatan: new Date().toISOString().split('T')[0],
  fase: '',
  suhu: '',
  kelembaban: '',
  intensitas_cahaya: '',
  catatan: ''
})

const formPanen = ref({
  tanggal_panen: new Date().toISOString().split('T')[0],
  jumlah_panen: '',
  catatan: ''
})

async function fetchBudidaya() {
  loading.value = true
  try {
    const [res, growthRes] = await Promise.all([
      budidayaService.getByPetugas(),
      pertumbuhanService.getAll()
    ])
    
    if (res?.success) {
      budidayaList.value = res.data.filter(b => b.status !== 'selesai')
      
      if (growthRes?.success) {
        growthRecords.value = growthRes.data
      }

      if (budidayaList.value.length > 0) {
        selectedBudidaya.value = budidayaList.value[0]
        handleSelectChange()
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function handleSelectChange() {
  // Reset forms when selection changes
  formPertumbuhan.value = {
    tanggal_pengamatan: new Date().toISOString().split('T')[0],
    fase: '',
    suhu: '',
    kelembaban: '',
    intensitas_cahaya: '',
    catatan: ''
  }
  formPanen.value = {
    tanggal_panen: new Date().toISOString().split('T')[0],
    jumlah_panen: '',
    catatan: ''
  }
}

async function submitPertumbuhan() {
  isSubmitting.value = true
  try {
    const payload = {
      ...formPertumbuhan.value,
      id_budidaya: selectedBudidaya.value.id_budidaya,
      intensitas_cahaya: formPertumbuhan.value.intensitas_cahaya || 0
    }
    const res = await pertumbuhanService.create(payload)
    if (res?.success) {
      alert('Pertumbuhan berhasil dicatat!')
      
      // Update growth records so latestFase updates instantly
      const growthRes = await pertumbuhanService.getAll()
      if (growthRes?.success) {
        growthRecords.value = growthRes.data
      }

      handleSelectChange() // reset form
    } else {
      alert('Gagal: ' + (res?.message || 'Terjadi kesalahan'))
    }
  } catch (e) {
    console.error(e)
    alert('Koneksi ke server gagal')
  } finally {
    isSubmitting.value = false
  }
}

async function submitPanen() {
  isSubmitting.value = true
  try {
    const payload = {
      ...formPanen.value,
      id_budidaya: selectedBudidaya.value.id_budidaya
    }
    const res = await panenService.create(payload)
    if (res?.success) {
      alert('Hasil panen berhasil disimpan!')
      handleSelectChange() // reset form
    } else {
      alert('Gagal: ' + (res?.message || 'Terjadi kesalahan'))
    }
  } catch (e) {
    console.error(e)
    alert('Koneksi ke server gagal')
  } finally {
    isSubmitting.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(() => {
  fetchBudidaya()
})
</script>

<style scoped>
.petugas-operasional {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.operasional-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
}

.budidaya-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.budidaya-selector label {
  font-size: 13px;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.budidaya-selector .modern-select {
  border: none;
  background: #f9fafb;
  font-weight: 600;
  color: #111827;
  min-width: 200px;
}

.modern-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

/* Main Content Area */
.main-content {
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  background: white;
  border-radius: 16px;
  border: 1px dashed #d1d5db;
}

.icon-large {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 18px;
}

/* Detail Container */
.detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-banner {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item .label {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item .value {
  font-size: 16px;
  color: #111827;
}

.fw-bold { font-weight: 800; }
.text-green { color: #16a34a; }

.tabs-container {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.tab-btn {
  padding: 10px 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover:not(:disabled) { background: #f9fafb; color: #374151; }
.tab-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #f9fafb; }
.tab-btn.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.2);
}
.text-blue { color: #2563eb; }

.form-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
}

.form-title {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width { grid-column: 1 / -1; }

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
}

.text-muted { color: #9ca3af; font-weight: 400; }

.modern-input, .modern-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.modern-input:focus, .modern-select:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.btn-primary {
  background: #16a34a;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #15803d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media(max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .info-banner { gap: 16px; }
  .header-content { flex-direction: column; align-items: flex-start; }
}
</style>