<template>
  <div class="admin-page fade-in">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Kelola Budidaya (Rumah Jamur)</h1>
        <p class="subtitle">Buat dan delegasikan tugas budidaya ke petugas di setiap lokasi.</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Cari ID, Lokasi, atau Petugas..." class="modern-input" />
        </div>
        <button type="button" class="btn-outline" @click.prevent="refreshData">
          <svg viewBox="0 0 24 24" width="16" height="16" class="mr-2"><path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Muat Ulang
        </button>
      </div>
    </header>


    <div class="table-card-modern">
      <div class="table-header-modern budidaya-grid green-header">
        <span>ID</span>
        <span>Lokasi</span>
        <span>Jenis Jamur</span>
        <span>Rak</span>
        <span>Target Harian</span>
        <span>Petugas</span>
        <span>Status</span>
        <span class="text-center">Aksi</span>
      </div>

      <div class="table-body">
        <div v-if="loading" class="table-row-modern budidaya-grid empty-row">
          <span style="grid-column: 1 / -1; text-align: center;">Memuat data budidaya...</span>
        </div>
        <div v-else-if="!loading && !filteredBudidayaList.length" class="table-row-modern budidaya-grid empty-row">
          <div style="grid-column: 1 / -1; text-align: center;">
            <svg viewBox="0 0 24 24" width="48" height="48" class="text-muted mb-4 mx-auto block"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
            <p>Belum ada data budidaya yang cocok.</p>
          </div>
        </div>

        <div v-for="item in filteredBudidayaList" :key="item.id_budidaya" class="table-row-modern budidaya-grid has-divider">
          <span class="id-col">BDY-{{ item.id_budidaya?.toString().padStart(3, '0') || '000' }}</span>
          <span class="fw-bold">{{ item.nama_lokasi }}</span>
          <span>{{ item.nama_jamur }}</span>
          <span class="fw-bold">{{ item.jumlah_rak || 1 }} Rak</span>
          <span class="daily-target-cell">
            <small>Lingkungan {{ item.target_lingkungan_harian || 2 }}×</small>
            <small>Pertumbuhan {{ item.target_pertumbuhan_harian || 2 }}×</small>
          </span>
          <span class="petugas-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" class="mr-1"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            {{ item.nama_petugas }}
          </span>
          <span>
            <span :class="['status-pill', item.status]">
              {{ item.status || 'Aktif' }}
            </span>
          </span>
          <span class="text-center action-buttons">
            <button
              v-if="item.status !== 'selesai'"
              @click="openTargetModal(item)"
              class="btn-target-small"
              title="Atur target input harian"
            >⚙</button>
            <button 
              v-if="item.status !== 'selesai'" 
              @click="openSelesaiModal(item)" 
              class="btn-selesai-small" 
              title="Selesaikan Siklus"
            >
              <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Modal Target Input Harian -->
    <div v-if="isTargetModalOpen" class="modal-overlay" @click.self="closeTargetModal">
      <div class="logout-modal fade-in-up target-modal">
        <h3 class="modal-title">Atur Target Input Harian</h3>
        <p class="modal-text">Target merupakan jumlah minimum pencatatan per hari. Input tambahan tetap diperbolehkan.</p>
        <div class="form-group target-field">
          <label>Lingkungan per hari (2-3 kali)</label>
          <input v-model.number="targetForm.target_lingkungan_harian" type="number" min="2" max="3" step="1" class="modern-input" />
        </div>
        <div class="form-group target-field">
          <label>Pertumbuhan per hari (2-10 kali)</label>
          <input v-model.number="targetForm.target_pertumbuhan_harian" type="number" min="2" max="10" step="1" class="modern-input" />
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeTargetModal">Batal</button>
          <button class="btn-confirm" @click="saveDailyTargets" :disabled="isSavingTarget">
            {{ isSavingTarget ? 'Menyimpan...' : 'Simpan Target' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Selesai -->
    <div v-if="isSelesaiModalOpen" class="modal-overlay">
      <div class="logout-modal fade-in-up" style="background: white; border-radius: 16px; padding: 32px; width: 340px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
        <div class="modal-icon" style="font-size: 48px; margin-bottom: 16px;">📦</div>
        <h3 class="modal-title" style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #111827;">Selesaikan Siklus?</h3>
        <p class="modal-text" style="margin: 0 0 18px 0; color: #6b7280; font-size: 14px;">Rak yang digunakan akan kembali tersedia. Siklus ini tidak dapat dikembalikan ke status aktif.</p>
        <div class="form-group" style="text-align: left; margin-bottom: 16px;">
          <label style="display:block; font-size:13px; font-weight:700; margin-bottom:6px;">Alasan selesai <span class="text-danger">*</span></label>
          <select v-model="alasanSelesai" class="modern-select">
            <option value="" disabled>Pilih alasan</option>
            <option value="Berhasil (Panen Selesai)">Berhasil (Panen Selesai)</option>
            <option value="Gagal (Kontaminasi/Hama)">Gagal (Kontaminasi/Hama)</option>
            <option value="Rusak">Rusak</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          <input
            v-if="alasanSelesai === 'Lainnya'"
            v-model.trim="alasanLainnya"
            class="modern-input"
            style="margin-top:10px;"
            maxlength="100"
            placeholder="Jelaskan alasan selesai"
          />
        </div>
        <div class="modal-actions" style="display: flex; gap: 12px;">
          <button class="btn-cancel" @click="closeSelesaiModal" style="flex: 1; padding: 10px; border: 1px solid #d1d5db; background: white; border-radius: 8px; font-weight: 600; color: #374151; cursor: pointer;">Batal</button>
          <button class="btn-confirm" @click="confirmSelesai" :disabled="isSubmittingSelesai || !alasanSelesai || (alasanSelesai === 'Lainnya' && alasanLainnya.length < 3)" style="flex: 1; padding: 10px; border: none; background: #f59e0b; color: white; border-radius: 8px; font-weight: 600; cursor: pointer;">
            {{ isSubmittingSelesai ? 'Tunggu...' : 'Ya, Selesaikan' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import eventBus from '../../services/eventBus.js'
import { budidayaService, lokasiService, jenisJamurService, mediaTanamService, usersService } from '../../services/dataService.js'

const budidayaList = ref([])
const loading = ref(false)
const searchQuery = ref('')

const isSelesaiModalOpen = ref(false)
const isSubmittingSelesai = ref(false)
const selectedItem = ref(null)
const alasanSelesai = ref('')
const alasanLainnya = ref('')
const isTargetModalOpen = ref(false)
const isSavingTarget = ref(false)
const targetItem = ref(null)
const targetForm = ref({ target_lingkungan_harian: 2, target_pertumbuhan_harian: 2 })

const filteredBudidayaList = computed(() => {
  if (!searchQuery.value) return budidayaList.value
  const q = searchQuery.value.toLowerCase()
  return budidayaList.value.filter(item => 
    (item.nama_lokasi && item.nama_lokasi.toLowerCase().includes(q)) ||
    (item.nama_jamur && item.nama_jamur.toLowerCase().includes(q)) ||
    (item.nama_petugas && item.nama_petugas.toLowerCase().includes(q)) ||
    (`bdy-${item.id_budidaya}`.includes(q))
  )
})


async function loadBudidaya() {
  loading.value = true
  try {
    const response = await budidayaService.getAll()
    if (response?.success) {
      budidayaList.value = response.data
    }
  } catch (error) {
    console.error('Error load budidaya:', error)
  } finally {
    loading.value = false
  }
}

async function refreshData() {
  await loadBudidaya()
}

function openTargetModal(item) {
  targetItem.value = item
  targetForm.value = {
    target_lingkungan_harian: Number(item.target_lingkungan_harian || 2),
    target_pertumbuhan_harian: Number(item.target_pertumbuhan_harian || 2)
  }
  isTargetModalOpen.value = true
}

function closeTargetModal() {
  if (isSavingTarget.value) return
  isTargetModalOpen.value = false
  targetItem.value = null
}

async function saveDailyTargets() {
  if (!targetItem.value) return
  const lingkungan = Number(targetForm.value.target_lingkungan_harian)
  const pertumbuhan = Number(targetForm.value.target_pertumbuhan_harian)
  if (!Number.isInteger(lingkungan) || lingkungan < 2 || lingkungan > 3) {
    alert('Target lingkungan harus bilangan bulat 2-3.')
    return
  }
  if (!Number.isInteger(pertumbuhan) || pertumbuhan < 2 || pertumbuhan > 10) {
    alert('Target pertumbuhan harus bilangan bulat 2-10.')
    return
  }
  isSavingTarget.value = true
  try {
    await budidayaService.updateDailyTargets(targetItem.value.id_budidaya, {
      target_lingkungan_harian: lingkungan,
      target_pertumbuhan_harian: pertumbuhan
    })
    await loadBudidaya()
    closeTargetModal()
  } catch (error) {
    alert(error.message || 'Gagal memperbarui target harian')
  } finally {
    isSavingTarget.value = false
    if (isTargetModalOpen.value) closeTargetModal()
  }
}

function openSelesaiModal(item) {
  selectedItem.value = item
  alasanSelesai.value = ''
  alasanLainnya.value = ''
  isSelesaiModalOpen.value = true
}

function closeSelesaiModal() {
  isSelesaiModalOpen.value = false
  selectedItem.value = null
  alasanSelesai.value = ''
  alasanLainnya.value = ''
}

async function confirmSelesai() {
  if (!selectedItem.value) return
  const alasan = alasanSelesai.value === 'Lainnya'
    ? alasanLainnya.value.trim()
    : alasanSelesai.value

  if (alasan.length < 3) {
    alert('Alasan selesai wajib diisi dengan jelas.')
    return
  }

  isSubmittingSelesai.value = true
  try {
    const res = await budidayaService.selesaikan(selectedItem.value.id_budidaya, alasan)
    if (res?.success) {
      await loadBudidaya()
      eventBus.emit('refreshBudidayaData')
      closeSelesaiModal()
    }
  } catch (err) {
    console.error(err)
    alert(err.message || 'Gagal menyelesaikan siklus')
  } finally {
    isSubmittingSelesai.value = false
  }
}

const refreshListener = async () => {
  await loadBudidaya()
}

onMounted(async () => {
  await loadBudidaya()
  eventBus.on('refreshBudidayaData', refreshListener)
})

onUnmounted(() => {
  eventBus.off('refreshBudidayaData', refreshListener)
})
</script>

<style scoped>
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-text h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.modern-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.search-box .modern-input {
  padding-left: 38px;
  width: 260px;
}

.modern-input:focus, .modern-select:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.modern-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  font-family: inherit;
  cursor: pointer;
}
.modern-select:disabled { background-color: #f3f4f6; cursor: not-allowed; }

.btn-primary {
  display: inline-flex;
  align-items: center;
  background: #16a34a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(22,163,74,0.2); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-outline {
  display: inline-flex;
  align-items: center;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { background: #f9fafb; color: #111827; }

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

.mr-1 { margin-right: 4px; }
.mr-2 { margin-right: 8px; }
.mt-1 { margin-top: 4px; }
.text-danger { color: #dc2626; }
.text-muted { color: #6b7280; font-size: 12px; }
.text-center { text-align: center; }

.table-card-modern {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
  overflow-x: auto;
}

.budidaya-grid {
  display: grid;
  grid-template-columns: 90px 1.3fr 1.1fr 80px 130px 1.3fr 90px 100px;
  min-width: 1050px;
  gap: 16px;
  align-items: center;
  padding: 16px 24px;
  font-size: 14px;
}

.green-header {
  background: #e9fbef;
  border-bottom: none;
  font-weight: 800;
  color: var(--green-dark, #16a34a);
}

.table-header-modern {
  background: #f9fafb;
  font-weight: 700;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
}

.has-divider {
  border-top: 1px solid #f3f4f6;
  background: white;
}

.table-row-modern {
  transition: background 0.2s;
  color: #111827;
}
.table-row-modern:last-child { border-bottom: none; }
.table-row-modern:hover { background: #f9fafb; }

.empty-row { display: block; padding: 48px; text-align: center; color: #6b7280; }

.mx-auto { margin-left: auto; margin-right: auto; }
.block { display: block; }
.mb-4 { margin-bottom: 16px; }

.id-col { font-weight: 700; color: #374151; font-size: 13px; }
.fw-bold { font-weight: 600; }
.petugas-badge { display: inline-flex; align-items: center; background: #f3f4f6; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #4b5563; }

.btn-selesai-small {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.btn-selesai-small:hover { background: #d97706; }
.btn-target-small { background: #2563eb; color: white; border: 0; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
.btn-target-small:hover { background: #1d4ed8; }
.action-buttons { display: inline-flex; justify-content: center; gap: 6px; }
.daily-target-cell { display: flex; flex-direction: column; gap: 2px; color: #374151; }
.daily-target-cell small { font-size: 11px; white-space: nowrap; }
.target-modal { background: white; border-radius: 16px; padding: 28px; width: min(420px, calc(100vw - 32px)); box-shadow: 0 20px 25px -5px rgba(0,0,0,.15); }
.target-field { text-align: left; margin: 16px 0; }
.target-field label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 700; }

.status-pill {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}
.status-pill.aktif { background: #dcfce7; color: #166534; }
.status-pill.inisiasi { background: #fef3c7; color: #b45309; }
.status-pill.selesai { background: #f3f4f6; color: #4b5563; }

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
.fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}


</style>