<template>
  <div class="petugas-operasional">
    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" :class="['toast-notification', toast.type]">
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </Transition>
    <!-- Page Header -->
    <header class="operasional-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Operasional Rumah Jamur</h1>
          <p class="page-subtitle">Pilih rumah jamur aktif untuk mencatat pertumbuhan atau panen harian.</p>
        </div>
        
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <div v-if="budidayaList.length > 0" class="budidaya-selector">
            <label>Rumah Jamur Aktif:</label>
            <select v-model="selectedBudidaya" @change="handleSelectChange" class="modern-select">
              <option v-for="b in budidayaList" :key="b.id_budidaya" :value="b">
                BDY-{{ String(b.id_budidaya).padStart(3, '0') }} - {{ b.nama_jamur }}
              </option>
            </select>
          </div>
          <button @click.prevent="openNewBudidayaForm" class="btn-primary" style="padding: 10px 16px; font-weight: 600;">+ Mulai Budidaya Baru</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- Modal Form Tambah Budidaya -->
      <div v-if="showNewBudidayaForm" class="modal-overlay" @click.self="closeNewBudidayaForm">
        <div class="form-modal slide-up">
          <div class="modal-header">
            <h3 class="modal-title">Mulai Budidaya Baru</h3>
            <button class="close-btn" @click="closeNewBudidayaForm">&times;</button>
          </div>
          <form @submit.prevent="submitNewBudidaya" class="modern-form">
            
            <div class="info-banner" style="margin-bottom: 20px; border: 1px solid #bbf7d0; background: #f0fdf4;">
               <p style="margin:0; color: #15803d; font-weight: 600;">Lokasi: {{ myLokasi.nama_lokasi || '-' }}</p>
               <p style="margin:4px 0 0 0; color: #166534; font-size: 14px;">Kapasitas Rak Tersedia: <strong>{{ myLokasi.rak_tersedia || 0 }} dari {{ myLokasi.kapasitas_rak || 0 }}</strong> Rak</p>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Jenis Jamur <span class="text-danger">*</span></label>
                <select v-model.number="formNewBudidaya.id_jenis" class="modern-select" required>
                  <option value="" disabled>Pilih komoditas</option>
                  <option v-for="jenis in jenisOptions" :key="jenis.id_jenis" :value="jenis.id_jenis">{{ jenis.nama_jamur }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Media Tanam <span class="text-danger">*</span></label>
                <select v-model.number="formNewBudidaya.id_media" class="modern-select" required>
                  <option value="" disabled>Pilih media baglog</option>
                  <option v-for="media in mediaOptions" :key="media.id_media" :value="media.id_media">{{ media.nama_media }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Jumlah Rak yang Digunakan <span class="text-danger">*</span></label>
                <input type="number" v-model.number="formNewBudidaya.jumlah_rak" class="modern-input" required min="1" :max="myLokasi.rak_tersedia || 1" placeholder="Max: sisa rak" />
              </div>

              <div class="form-group">
                <label>Tanggal Mulai <span class="text-danger">*</span></label>
                <input v-model="formNewBudidaya.tanggal_mulai" type="date" class="modern-input" required />
              </div>

              <div class="form-group">
                <label>Status Awal</label>
                <select v-model="formNewBudidaya.status" class="modern-select">
                  <option value="aktif">Aktif</option>
                  <option value="inisiasi">Inisiasi</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="closeNewBudidayaForm">Batal</button>
              <button type="submit" class="btn-primary" :disabled="isSubmittingNew || myLokasi.rak_tersedia <= 0">
                {{ isSubmittingNew ? 'Menyimpan...' : 'Mulai Budidaya' }}
              </button>
            </div>
          </form>
        </div>
      </div>

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
          <button :class="['tab-btn', { active: activeForm === 'lingkungan' }]" @click="activeForm = 'lingkungan'">Data Lingkungan</button>
          <button :class="['tab-btn', { active: activeForm === 'pertumbuhan' }]" @click="activeForm = 'pertumbuhan'">Fase Pertumbuhan</button>
          
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

        <!-- LINGKUNGAN FORM -->
        <div v-if="activeForm === 'lingkungan'" class="form-card fade-in">
          <h2 class="form-title">Pencatatan Lingkungan Harian</h2>
          <form @submit.prevent="submitLingkungan">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Tanggal Pengukuran</label>
                <input type="date" v-model="formLingkungan.tanggal_pengukuran" required class="modern-input" />
              </div>
              <div class="form-group">
                <label>Suhu Lingkungan (°C)</label>
                <input type="number" step="0.1" v-model="formLingkungan.suhu" placeholder="Misal: 25.5" class="modern-input" required />
              </div>
              <div class="form-group">
                <label>Kelembapan Lingkungan (%)</label>
                <input type="number" step="0.1" v-model="formLingkungan.kelembaban" placeholder="Misal: 85.0" class="modern-input" required />
              </div>
              <div class="form-group full-width">
                <label>Intensitas Cahaya (Lux/Lumens) <span class="text-muted">- Opsional</span></label>
                <input type="number" step="0.1" v-model="formLingkungan.intensitas_cahaya" placeholder="Misal: 300" class="modern-input" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                 {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data Lingkungan' }}
              </button>
            </div>
          </form>
        </div>

        <!-- PERTUMBUHAN FORM -->
        <div v-if="activeForm === 'pertumbuhan'" class="form-card fade-in">
          <h2 class="form-title">Laporan Fase Pertumbuhan</h2>
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
              
              <div class="form-group full-width">
                <label>Detail Tambahan (Opsional)</label>
                <div v-for="(item, index) in dynamicDetails" :key="index" style="display: flex; gap: 8px; margin-bottom: 8px;">
                  <input v-model="item.key" placeholder="Nama Parameter (misal: Warna)" class="modern-input" style="flex: 1;" />
                  <input v-model="item.value" placeholder="Nilai (misal: Putih)" class="modern-input" style="flex: 1;" />
                  <button type="button" @click="removeDetail(index)" class="btn-remove">Hapus</button>
                </div>
                <button type="button" @click="addDetail" class="btn-add-detail">+ Tambah Parameter</button>
              </div>

              <div class="form-group full-width">
                <label>Catatan Ekstra</label>
                <textarea v-model="formPertumbuhan.catatan" class="modern-input" rows="3" placeholder="Contoh: Terlihat sedikit hama..."></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                 {{ isSubmitting ? 'Menyimpan...' : 'Simpan Fase Pertumbuhan' }}
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
import { budidayaService, pertumbuhanService, panenService, lingkunganService, usersService, jenisJamurService, mediaTanamService } from '../../services/dataService.js'

const budidayaList = ref([])
const growthRecords = ref([])
const loading = ref(true)
const selectedBudidaya = ref(null)
const activeForm = ref('lingkungan')
const isSubmitting = ref(false)

// Toast notification state
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

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

const d_init = new Date()
const localDateInit = `${d_init.getFullYear()}-${String(d_init.getMonth() + 1).padStart(2, '0')}-${String(d_init.getDate()).padStart(2, '0')}`

const formLingkungan = ref({
  tanggal_pengukuran: localDateInit,
  suhu: '',
  kelembaban: '',
  intensitas_cahaya: ''
})

const formPertumbuhan = ref({
  tanggal_pengamatan: localDateInit,
  fase: '',
  catatan: ''
})

const dynamicDetails = ref([])

const formPanen = ref({
  tanggal_panen: localDateInit,
  jumlah_panen: '',
  catatan: ''
})

// === State untuk Form Tambah Budidaya ===
const myLokasi = ref({ nama_lokasi: '', rak_tersedia: 0, kapasitas_rak: 0 })
const showNewBudidayaForm = ref(false)
const isSubmittingNew = ref(false)
const jenisOptions = ref([])
const mediaOptions = ref([])

const formNewBudidaya = ref({
  id_jenis: '',
  id_media: '',
  jumlah_rak: 1,
  tanggal_mulai: localDateInit,
  status: 'aktif'
})

// === Method Tambah Budidaya ===
async function openNewBudidayaForm() {
  // Fetch latest capacity & options
  const [meRes, jRes, mRes] = await Promise.all([
    usersService.getMe(),
    jenisJamurService.getAll(),
    mediaTanamService.getAll()
  ])
  
  if (meRes?.success && meRes.data) {
    myLokasi.value = {
      nama_lokasi: meRes.data.nama_lokasi,
      rak_tersedia: meRes.data.rak_tersedia || 0,
      kapasitas_rak: meRes.data.kapasitas_rak || 0
    }
  }

  if (jRes?.success) jenisOptions.value = jRes.data
  if (mRes?.success) mediaOptions.value = mRes.data

  showNewBudidayaForm.value = true
}

function closeNewBudidayaForm() {
  showNewBudidayaForm.value = false
}

async function submitNewBudidaya() {
  if (formNewBudidaya.value.jumlah_rak > myLokasi.value.rak_tersedia) {
    showToast(`Gagal: Jumlah rak melebihi sisa kapasitas (${myLokasi.value.rak_tersedia}).`, 'error')
    return
  }

  isSubmittingNew.value = true
  try {
    const payload = {
      ...formNewBudidaya.value
    }
    const res = await budidayaService.create(payload)
    if (res?.success) {
      showToast('Budidaya berhasil ditambahkan!', 'success')
      closeNewBudidayaForm()
      await fetchBudidaya()
    } else {
      showToast('Gagal: ' + (res?.message || 'Terjadi kesalahan'), 'error')
    }
  } catch(e) {
    console.error(e)
    showToast(e.response?.data?.message || 'Koneksi ke server gagal', 'error')
  } finally {
    isSubmittingNew.value = false
  }
}

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
  const d = new Date()
  const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  
  formLingkungan.value = {
    tanggal_pengukuran: localDate,
    suhu: '',
    kelembaban: '',
    intensitas_cahaya: ''
  }
  formPertumbuhan.value = {
    tanggal_pengamatan: localDate,
    fase: '',
    catatan: ''
  }
  dynamicDetails.value = []
  formPanen.value = {
    tanggal_panen: localDate,
    jumlah_panen: '',
    catatan: ''
  }
}

function addDetail() {
  dynamicDetails.value.push({ key: '', value: '' })
}

function removeDetail(index) {
  dynamicDetails.value.splice(index, 1)
}

async function submitLingkungan() {
  isSubmitting.value = true
  try {
    const payload = {
      ...formLingkungan.value,
      id_budidaya: selectedBudidaya.value.id_budidaya,
      intensitas_cahaya: formLingkungan.value.intensitas_cahaya || 0
    }
    const res = await lingkunganService.create(payload)
    if (res?.success) {
      showToast('Kondisi lingkungan harian berhasil dicatat!', 'success')
      handleSelectChange()
    } else {
      showToast('Gagal: ' + (res?.message || 'Terjadi kesalahan'), 'error')
    }
  } catch (e) {
    console.error(e)
    showToast(e.response?.data?.message || 'Koneksi ke server gagal', 'error')
  } finally {
    isSubmitting.value = false
  }
}

async function submitPertumbuhan() {
  isSubmitting.value = true
  try {
    // build detail_fase JSON
    const detailObj = {}
    dynamicDetails.value.forEach(d => {
      if (d.key && d.value) {
        detailObj[d.key] = d.value
      }
    })

    const payload = {
      ...formPertumbuhan.value,
      id_budidaya: selectedBudidaya.value.id_budidaya,
      detail_fase: Object.keys(detailObj).length > 0 ? JSON.stringify(detailObj) : null
    }
    const res = await pertumbuhanService.create(payload)
    if (res?.success) {
      showToast('Fase pertumbuhan berhasil dicatat!', 'success')
      
      // Update growth records so latestFase updates instantly
      const growthRes = await pertumbuhanService.getAll()
      if (growthRes?.success) {
        growthRecords.value = growthRes.data
      }

      handleSelectChange() // reset form
    } else {
      showToast('Gagal: ' + (res?.message || 'Terjadi kesalahan'), 'error')
    }
  } catch (e) {
    console.error(e)
    showToast(e.response?.data?.message || 'Koneksi ke server gagal', 'error')
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
      showToast('Hasil panen berhasil disimpan!', 'success')
      handleSelectChange()
    } else {
      showToast('Gagal: ' + (res?.message || 'Terjadi kesalahan'), 'error')
    }
  } catch (e) {
    console.error(e)
    showToast(e.response?.data?.message || 'Koneksi ke server gagal', 'error')
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
/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 28px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  min-width: 320px;
  max-width: 500px;
}

.toast-notification.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.toast-notification.success .toast-icon { color: #16a34a; }

.toast-notification.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.toast-notification.error .toast-icon { color: #dc2626; }

.toast-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.toast-message { flex: 1; line-height: 1.4; }

/* Toast transition */
.toast-enter-active { animation: toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-leave-active { animation: toastOut 0.25s ease-in forwards; }

@keyframes toastIn {
  from { transform: translate(-50%, -50%) scale(0.85); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

@keyframes toastOut {
  from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  to { transform: translate(-50%, -50%) scale(0.85); opacity: 0; }
}

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

.btn-add-detail {
  background: white;
  border: 1px dashed #d1d5db;
  color: #4b5563;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 8px;
  transition: all 0.2s;
}

.btn-add-detail:hover {
  border-color: #16a34a;
  color: #16a34a;
  background: #f0fdf4;
}

.btn-remove {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #fecaca;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modal CSS untuk Form Budidaya Baru */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.form-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
}

.modal-title { margin: 0; font-size: 18px; font-weight: 700; color: #111827; }
.close-btn { background: none; border: none; font-size: 24px; color: #9ca3af; cursor: pointer; transition: color 0.2s; line-height: 1; }
.close-btn:hover { color: #dc2626; }

.modern-form { padding: 24px; }
.text-danger { color: #dc2626; }

.modal-footer {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  background: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-cancel:hover { background: #f3f4f6; }

@media(max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .info-banner { gap: 16px; }
  .header-content { flex-direction: column; align-items: flex-start; }
}
</style>