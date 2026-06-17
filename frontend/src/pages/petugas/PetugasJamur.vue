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
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Operasional Rumah Jamur</h1>
        <p class="page-description">Pilih jenis jamur aktif untuk mencatat pertumbuhan atau panen harian.</p>
      </div>
      
      <div class="header-actions">
        <div v-if="budidayaList.length > 0" class="search-box">
          <select v-model="selectedBudidaya" @change="handleSelectChange" class="modern-select" style="min-width: 250px;">
            <option v-for="b in budidayaList" :key="b.id_budidaya" :value="b">
              BDY-{{ String(b.id_budidaya).padStart(3, '0') }} - {{ b.nama_jamur }}
            </option>
          </select>
        </div>
        <button @click.prevent="openNewBudidayaForm" class="btn-primary">+ Mulai Budidaya Baru</button>
      </div>
    </header>

    <main class="main-content">
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
            <span class="label">Rak Fokus</span>
            <span class="value fw-bold">{{ selectedRak ? `Rak ${selectedRak} dari ${selectedBudidaya.jumlah_rak || 1}` : `${selectedBudidaya.jumlah_rak || 1} rak (semua)` }}</span>
          </div>
          <div class="info-item">
            <span class="label">Fase Saat Ini</span>
            <span class="value fw-bold text-blue">{{ latestFase || 'Belum Ada' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Mulai Budidaya</span>
            <span class="value">{{ formatDate(selectedBudidaya.tanggal_mulai) }}</span>
          </div>
          <!-- <div class="info-item">
            <span class="label">Update Hari Ini</span>
            <span class="value text-green fw-bold">{{ todayFormatted }}</span>
          </div> -->
          <div class="info-actions" style="margin-left: auto; display: flex; align-items: center;">
            <button @click="openSelesaiModal" class="btn-warning" style="background-color: #f59e0b; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s;">
              Selesaikan Siklus
            </button>
          </div>
        </div>

      <div v-if="isSelesaiModalOpen" class="modal-overlay">
        <div class="logout-modal fade-in-up" style="background: white; border-radius: 16px; padding: 32px; width: 340px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
          <div class="modal-icon" style="font-size: 48px; margin-bottom: 16px;">📦</div>
          <h3 class="modal-title" style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #111827;">Selesaikan Siklus?</h3>
          <p class="modal-text" style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">Rak yang digunakan akan kembali tersedia. Siklus ini tidak dapat dikembalikan ke status aktif.</p>
          <div class="form-group" style="text-align: left; margin-bottom: 16px;">
            <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px;">Penyebab Selesai <span class="text-danger">*</span></label>
            <select v-model="alasanSelesai" class="modern-select" style="width: 100%;" required>
              <option value="" disabled>Pilih Alasan</option>
              <option value="Berhasil (Panen Selesai)">Berhasil (Panen Selesai)</option>
              <option value="Gagal (Kontaminasi/Hama)">Gagal (Kontaminasi/Hama)</option>
              <option value="Rusak">Rusak</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <input
              v-if="alasanSelesai === 'Lainnya'"
              v-model.trim="alasanLainnya"
              maxlength="100"
              class="modern-input"
              style="margin-top: 10px;"
              placeholder="Jelaskan alasan selesai"
            />
          </div>
          <div class="modal-actions" style="display: flex; gap: 12px; margin-top: 16px;">
            <button class="btn-cancel" @click="closeSelesaiModal" style="flex: 1; padding: 10px; border: 1px solid #d1d5db; background: white; border-radius: 8px; font-weight: 600; color: #374151; cursor: pointer;">Batal</button>
            <button class="btn-confirm" @click="confirmSelesai" :disabled="isSubmittingSelesai || !alasanSelesai || (alasanSelesai === 'Lainnya' && alasanLainnya.length < 3)" style="flex: 1; padding: 10px; border: none; background: #f59e0b; color: white; border-radius: 8px; font-weight: 600; cursor: pointer;">
              {{ isSubmittingSelesai ? 'Tunggu...' : 'Ya, Selesaikan' }}
            </button>
          </div>
        </div>
      </div>

        <div class="tabs-container">
          <button :class="['tab-btn', { active: activeForm === 'pertumbuhan' }]" @click="setActiveForm('pertumbuhan')">Fase Pertumbuhan</button>
          
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

        <div v-if="activeForm === 'pertumbuhan'" class="form-card fade-in">
          <h2 class="form-title">Laporan Fase Pertumbuhan</h2>
          <!-- <p class="daily-progress" :class="{ complete: todayGrowthCount >= (selectedBudidaya.target_pertumbuhan_harian || 2) }">
            Hari ini: {{ todayGrowthCount }}/{{ selectedBudidaya.target_pertumbuhan_harian || 2 }} pencatatan minimum. Input tambahan tetap diperbolehkan.
          </p> -->
          <form @submit.prevent="submitPertumbuhan">
            <div class="form-grid">
              <div class="form-group">
                <label>Tanggal Pengamatan</label>
                <input type="date" v-model="formPertumbuhan.tanggal_pengamatan" :min="todayISO" :max="todayISO" disabled required class="modern-input" />
                <small class="date-lock-note">Tanggal dikunci ke hari ini untuk pencatatan real-time.</small>
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
                <label>Upload Foto Pertumbuhan <span class="text-muted">- Opsional</span></label>
                <input :key="growthFileInputKey" type="file" @change="handlePertumbuhanFotoUpload" accept="image/jpeg,image/png,image/webp,image/gif" class="modern-input" />
                <div v-if="growthPhotoPreview" class="photo-preview-wrap">
                  <img :src="growthPhotoPreview" alt="Preview foto pertumbuhan" class="photo-preview" />
                  <span>{{ growthPhoto?.name }}</span>
                </div>
              </div>

              <div class="form-group full-width">
                <label>Detail Tambahan</label>
                <div v-for="(item, index) in dynamicDetails" :key="index" style="display: flex; gap: 8px; margin-bottom: 8px;">
                  <input v-model="item.key" placeholder="Nama Parameter (misal: Warna)" class="modern-input" style="flex: 1;" />
                  <input v-model="item.value" placeholder="Nilai (misal: Putih)" class="modern-input" style="flex: 1;" />
                  <button type="button" @click="removeDetail(index)" class="btn-remove">Hapus</button>
                </div>
                <button type="button" @click="addDetail" class="btn-add-detail">+ Tambah Parameter</button>
              </div>

              <div class="form-group full-width">
                <label>Catatan</label>
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

        <div v-if="activeForm === 'panen'" class="form-card fade-in">
          <h2 class="form-title">Input Data Panen</h2>
          <form @submit.prevent="submitPanen">
            <div class="form-grid">
              <div class="form-group">
                <label>Tanggal Panen</label>
                <input type="date" v-model="formPanen.tanggal_panen" :min="todayISO" :max="todayISO" disabled required class="modern-input" />
                <small class="date-lock-note">Tanggal dikunci ke hari ini untuk pencatatan real-time.</small>
              </div>
              <div class="form-group">
                <label>Jumlah Panen (kg)</label>
                <input type="number" step="0.1" min="0.1" max="100000" v-model.number="formPanen.jumlah_panen" placeholder="Misal: 500" required class="modern-input" />
              </div>
              <div class="form-group full-width">
                <label>Upload Foto Panen <span class="text-muted">- Opsional</span></label>
                <input :key="harvestFileInputKey" type="file" @change="handlePanenFotoUpload" accept="image/jpeg,image/png,image/webp,image/gif" class="modern-input" />
                <div v-if="harvestPhotoPreview" class="photo-preview-wrap">
                  <img :src="harvestPhotoPreview" alt="Preview foto panen" class="photo-preview" />
                  <span>{{ harvestPhoto?.name }}</span>
                </div>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { budidayaService, pertumbuhanService, panenService, usersService, jenisJamurService, mediaTanamService } from '../../services/dataService.js'

const route = useRoute()
const dInit = new Date()
const todayISO = `${dInit.getFullYear()}-${String(dInit.getMonth() + 1).padStart(2, '0')}-${String(dInit.getDate()).padStart(2, '0')}`
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const budidayaList = ref([])
const growthRecords = ref([])
const loading = ref(true)
const selectedBudidaya = ref(null)
const selectedRak = ref(null)
const activeForm = ref('pertumbuhan')
const isSubmitting = ref(false)
const isSelesaiModalOpen = ref(false)
const isSubmittingSelesai = ref(false)
const alasanSelesai = ref('')
const alasanLainnya = ref('')

const growthPhoto = ref(null)
const growthPhotoPreview = ref('')
const growthFileInputKey = ref(0)
const harvestPhoto = ref(null)
const harvestPhotoPreview = ref('')
const harvestFileInputKey = ref(0)

const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

const formPertumbuhan = ref({ tanggal_pengamatan: todayISO, fase: '', catatan: '' })
const dynamicDetails = ref([])
const formPanen = ref({ tanggal_panen: todayISO, jumlah_panen: '', catatan: '' })

const myLokasi = ref({ nama_lokasi: '', rak_tersedia: 0, kapasitas_rak: 0 })
const showNewBudidayaForm = ref(false)
const isSubmittingNew = ref(false)
const jenisOptions = ref([])
const mediaOptions = ref([])
const formNewBudidaya = ref({
  id_jenis: '',
  id_media: '',
  jumlah_rak: 1,
  tanggal_mulai: todayISO,
  status: 'aktif'
})

function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

const todayFormatted = computed(() => (
  new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
))

const latestFase = computed(() => {
  if (!selectedBudidaya.value || !Array.isArray(growthRecords.value)) return ''
  const selectedId = String(selectedBudidaya.value.id_budidaya)
  const records = growthRecords.value
    .filter((item) => String(item.id_budidaya) === selectedId)
    .slice()
    .sort((a, b) => new Date(b.tanggal_pengamatan) - new Date(a.tanggal_pengamatan))
  return records[0]?.fase || ''
})

const todayGrowthCount = computed(() => {
  if (!selectedBudidaya.value) return 0
  return growthRecords.value.filter((item) => {
    if (String(item.id_budidaya) !== String(selectedBudidaya.value.id_budidaya)) return false
    if (!item.tanggal_pengamatan) return false
    const d = new Date(item.tanggal_pengamatan)
    const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return localDateStr === todayISO
  }).length
})

const isPanenAllowed = computed(() => latestFase.value === 'Panen')

function revokePreview(previewRef) {
  if (previewRef.value?.startsWith('blob:')) URL.revokeObjectURL(previewRef.value)
  previewRef.value = ''
}

function clearGrowthPhoto() {
  revokePreview(growthPhotoPreview)
  growthPhoto.value = null
  growthFileInputKey.value += 1
}

function clearHarvestPhoto() {
  revokePreview(harvestPhotoPreview)
  harvestPhoto.value = null
  harvestFileInputKey.value += 1
}

function validatePhoto(file) {
  if (!allowedImageTypes.has(file.type)) return 'Format foto harus JPG, PNG, WEBP, atau GIF'
  if (file.size > 5 * 1024 * 1024) return 'Ukuran foto maksimal 5 MB'
  return null
}

function handlePertumbuhanFotoUpload(event) {
  const file = event.target.files?.[0]
  clearGrowthPhoto()
  if (!file) return
  const error = validatePhoto(file)
  if (error) {
    showToast(error, 'error')
    return
  }
  growthPhoto.value = file
  growthPhotoPreview.value = URL.createObjectURL(file)
}

function handlePanenFotoUpload(event) {
  const file = event.target.files?.[0]
  clearHarvestPhoto()
  if (!file) return
  const error = validatePhoto(file)
  if (error) {
    showToast(error, 'error')
    return
  }
  harvestPhoto.value = file
  harvestPhotoPreview.value = URL.createObjectURL(file)
}

function resetForms() {
  formPertumbuhan.value = { tanggal_pengamatan: todayISO, fase: '', catatan: '' }
  dynamicDetails.value = []
  formPanen.value = { tanggal_panen: todayISO, jumlah_panen: '', catatan: '' }
  clearGrowthPhoto()
  clearHarvestPhoto()
}

function openSelesaiModal() {
  alasanSelesai.value = ''
  alasanLainnya.value = ''
  isSelesaiModalOpen.value = true
}

function closeSelesaiModal() {
  isSelesaiModalOpen.value = false
  alasanSelesai.value = ''
  alasanLainnya.value = ''
}

async function confirmSelesai() {
  if (!selectedBudidaya.value) {
    showToast('Budidaya tidak ditemukan', 'error')
    return
  }
  const alasan = alasanSelesai.value === 'Lainnya'
    ? alasanLainnya.value.trim()
    : alasanSelesai.value
  if (alasan.length < 3) {
    showToast('Jelaskan penyebab selesai dengan jelas', 'error')
    return
  }

  isSubmittingSelesai.value = true
  try {
    const res = await budidayaService.selesaikan(selectedBudidaya.value.id_budidaya, alasan)
    if (res?.success) {
      showToast('Siklus budidaya berhasil diselesaikan!', 'success')
      closeSelesaiModal()
      selectedBudidaya.value = null
      selectedRak.value = null
      await fetchBudidaya()
    }
  } catch (error) {
    console.error(error)
    showToast(error.message || 'Gagal menyelesaikan siklus', 'error')
  } finally {
    isSubmittingSelesai.value = false
  }
}

async function openNewBudidayaForm() {
  try {
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
  } catch (error) {
    showToast(error.message || 'Gagal memuat form budidaya', 'error')
  }
}

function closeNewBudidayaForm() {
  showNewBudidayaForm.value = false
}

async function submitNewBudidaya() {
  if (formNewBudidaya.value.jumlah_rak > myLokasi.value.rak_tersedia) {
    showToast(`Jumlah rak melebihi sisa kapasitas (${myLokasi.value.rak_tersedia}).`, 'error')
    return
  }
  isSubmittingNew.value = true
  try {
    const res = await budidayaService.create({ ...formNewBudidaya.value })
    if (res?.success) {
      showToast('Budidaya berhasil ditambahkan!', 'success')
      closeNewBudidayaForm()
      await fetchBudidaya()
    }
  } catch (error) {
    showToast(error.message || 'Gagal membuat budidaya', 'error')
  } finally {
    isSubmittingNew.value = false
  }
}

async function fetchBudidaya() {
  loading.value = true
  try {
    const [res, growthRes] = await Promise.all([
      budidayaService.getByPetugas({ status: 'aktif' }),
      pertumbuhanService.getAll()
    ])

    budidayaList.value = res?.success ? res.data : []
    growthRecords.value = growthRes?.success ? growthRes.data : []

    if (budidayaList.value.length > 0) {
      const queryId = route.query.budidaya
      const savedId = localStorage.getItem('selectedBudidayaId')
      const desiredId = queryId || savedId
      selectedBudidaya.value = budidayaList.value.find(
        (item) => String(item.id_budidaya) === String(desiredId)
      ) || budidayaList.value[0]

      const requestedRack = Number(route.query.rak)
      const maxRack = Number(selectedBudidaya.value.jumlah_rak || 1)
      selectedRak.value = Number.isInteger(requestedRack) && requestedRack >= 1 && requestedRack <= maxRack
        ? requestedRack
        : null
      localStorage.setItem('selectedBudidayaId', String(selectedBudidaya.value.id_budidaya))
      resetForms()
    }
  } catch (error) {
    console.error(error)
    showToast(error.message || 'Gagal memuat data budidaya', 'error')
  } finally {
    loading.value = false
  }
}

function handleSelectChange() {
  selectedRak.value = null
  if (selectedBudidaya.value) {
    localStorage.setItem('selectedBudidayaId', String(selectedBudidaya.value.id_budidaya))
  }
  resetForms()
}

function addDetail() {
  dynamicDetails.value.push({ key: '', value: '' })
}

function removeDetail(index) {
  dynamicDetails.value.splice(index, 1)
}

function setActiveForm(form) {
  activeForm.value = form
  localStorage.setItem('petugasActiveForm', form)
}

async function submitPertumbuhan() {
  if (!selectedBudidaya.value) return
  isSubmitting.value = true
  try {
    const detailObj = {}
    dynamicDetails.value.forEach((item) => {
      if (item.key && item.value) detailObj[item.key] = item.value
    })

    const formData = new FormData()
    formData.append('id_budidaya', selectedBudidaya.value.id_budidaya)
    formData.append('tanggal_pengamatan', todayISO)
    formData.append('fase', formPertumbuhan.value.fase)
    if (formPertumbuhan.value.catatan) formData.append('catatan', formPertumbuhan.value.catatan)
    if (Object.keys(detailObj).length) formData.append('detail_fase', JSON.stringify(detailObj))
    if (growthPhoto.value) formData.append('foto', growthPhoto.value)

    const res = await pertumbuhanService.create(formData)
    if (res?.success) {
      showToast('Fase pertumbuhan berhasil dicatat!', 'success')
      const growthRes = await pertumbuhanService.getAll()
      if (growthRes?.success) growthRecords.value = growthRes.data.slice()
      resetForms()
    }
  } catch (error) {
    console.error(error)
    showToast(error.message || 'Gagal menyimpan pertumbuhan', 'error')
  } finally {
    isSubmitting.value = false
  }
}

async function submitPanen() {
  if (!selectedBudidaya.value) return
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('id_budidaya', selectedBudidaya.value.id_budidaya)
    formData.append('tanggal_panen', todayISO)
    formData.append('jumlah_panen', formPanen.value.jumlah_panen)
    if (formPanen.value.catatan) formData.append('catatan', formPanen.value.catatan)
    if (harvestPhoto.value) formData.append('foto', harvestPhoto.value)

    const res = await panenService.create(formData)
    if (res?.success) {
      showToast('Hasil panen berhasil disimpan!', 'success')
      resetForms()
    }
  } catch (error) {
    console.error(error)
    showToast(error.message || 'Gagal menyimpan panen', 'error')
  } finally {
    isSubmitting.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

onMounted(async () => {
  const savedForm = localStorage.getItem('petugasActiveForm')
  if (savedForm && savedForm !== 'lingkungan') activeForm.value = savedForm
  await fetchBudidaya()
  if (activeForm.value === 'panen' && !isPanenAllowed.value) setActiveForm('pertumbuhan')
})

onBeforeUnmount(() => {
  revokePreview(growthPhotoPreview)
  revokePreview(harvestPhotoPreview)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
.page-header-modern { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; }
.header-text h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
.page-description { margin: 4px 0 0; color: #6b7280; font-size: 14px; }
.header-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-box { position: relative; display: flex; align-items: center; }

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

.daily-progress { margin: -6px 0 18px; font-size: 13px; color: #b45309; font-weight: 700; }
.daily-progress.complete { color: #15803d; }
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

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px 40px;
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

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.5);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
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

.date-lock-note { color: #6b7280; font-size: 12px; line-height: 1.4; }
.modern-input:disabled { background: #f3f4f6; color: #4b5563; cursor: not-allowed; }
.photo-preview-wrap { display: flex; align-items: center; gap: 12px; padding: 10px; border: 1px solid #d1fae5; background: #f0fdf4; border-radius: 10px; font-size: 13px; color: #166534; }
.photo-preview { width: 88px; height: 66px; border-radius: 8px; object-fit: cover; border: 1px solid #bbf7d0; }
</style>