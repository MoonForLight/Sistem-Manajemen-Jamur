<template>
  <div class="admin-page fade-in">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Kelola Budidaya Jamur</h1>
        <p class="page-description">Buat dan delegasikan tugas budidaya ke petugas di setiap lokasi.</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Cari ID, Lokasi, atau Petugas..." class="modern-input" />
        </div>
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
              @click="openSelesaiModal(item)" 
              class="icon-btn selesai" 
              title="Selesaikan Siklus"
            >
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </button>
            <button
              @click="openDeleteModal(item)"
              class="icon-btn delete"
              title="Hapus Siklus (Admin Only)"
            >
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </span>
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
    
    <!-- Modal Konfirmasi Hapus Budidaya -->
    <div v-if="isDeleteModalOpen" class="modal-overlay">
      <div class="logout-modal fade-in-up" style="background: white; border-radius: 16px; padding: 32px; width: 400px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
        <div class="modal-icon" style="color: #ef4444; margin-bottom: 16px;">
          <svg viewBox="0 0 24 24" width="48" height="48" style="display: block; margin: 0 auto;"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <h3 class="modal-title" style="color: #ef4444; margin: 0 0 8px 0; font-size: 20px; font-weight: 800;">Peringatan Hapus Data</h3>
        <p class="modal-text" style="margin: 0 0 18px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
          Apakah Anda yakin ingin menghapus budidaya di <strong>{{ budidayaToDelete?.nama_lokasi }}</strong>?<br>
        </p>
        <div class="modal-actions" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
          <button class="btn-cancel" @click="closeDeleteModal" style="padding: 10px 16px; border: 1px solid #d1d5db; background: white; border-radius: 8px; font-weight: 600; color: #374151; cursor: pointer;">Batal</button>
          <button class="btn-cancel" @click="executeDelete(false)" style="padding: 10px 16px; border: 1px solid #ef4444; color: #ef4444; background: white; border-radius: 8px; font-weight: 600; cursor: pointer;">Hapus Tanpa Backup</button>
          <button class="btn-confirm" @click="executeDelete(true)" :disabled="isDeleting" style="padding: 10px 16px; border: none; background: #10b981; color: white; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center;">
            <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; margin-right: 6px;"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            {{ isDeleting ? 'Memproses...' : 'Backup Excel & Hapus' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Popup -->
    <Transition name="fade-slide">
      <div v-if="notification.show" class="notification-popup" :class="notification.type" @click="closeNotification" style="cursor: pointer;" title="Klik untuk menutup">
        <div class="notification-icon">
          <svg v-if="notification.type === 'success'" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          <svg v-else viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <div class="notification-content">
          <h4 class="notification-title">{{ notification.type === 'success' ? 'Berhasil' : 'Gagal' }}</h4>
          <p class="notification-message">{{ notification.message }}</p>
        </div>
        <button class="notification-close" @click.stop="closeNotification">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    </Transition>
    <!-- Notification Popup -->
    <Transition name="fade-slide">
      <div v-if="notification.show" class="notification-popup" :class="notification.type" @click="closeNotification" style="cursor: pointer;" title="Klik untuk menutup">
        <div class="notification-icon">
          <svg v-if="notification.type === 'success'" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          <svg v-else viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <div class="notification-content">
          <h4 class="notification-title">{{ notification.type === 'success' ? 'Berhasil' : 'Gagal' }}</h4>
          <p class="notification-message">{{ notification.message }}</p>
        </div>
        <button class="notification-close" @click.stop="closeNotification">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import eventBus from '../../services/eventBus.js'
import { budidayaService, lokasiService, jenisJamurService, mediaTanamService, usersService } from '../../services/dataService.js'
import { exportBudidayaBackup } from '../../utils/backupExport.js'

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

const isDeleteModalOpen = ref(false)
const budidayaToDelete = ref(null)
const isDeleting = ref(false)

const notification = ref({ show: false, message: '', type: 'success' })

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

function closeNotification() {
  notification.value.show = false
}

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
    showNotification('Target lingkungan harus bilangan bulat 2-3.', 'error')
    return
  }
  if (!Number.isInteger(pertumbuhan) || pertumbuhan < 2 || pertumbuhan > 10) {
    showNotification('Target pertumbuhan harus bilangan bulat 2-10.', 'error')
    return
  }
  isSavingTarget.value = true
  try {
    await budidayaService.updateDailyTargets(targetItem.value.id_budidaya, {
      target_lingkungan_harian: lingkungan,
      target_pertumbuhan_harian: pertumbuhan
    })
    showNotification('Target harian berhasil diperbarui', 'success')
    await loadBudidaya()
    closeTargetModal()
  } catch (error) {
    showNotification(error.message || 'Gagal memperbarui target harian', 'error')
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
    showNotification('Alasan selesai wajib diisi dengan jelas.', 'error')
    return
  }

  isSubmittingSelesai.value = true
  try {
    const res = await budidayaService.selesaikan(selectedItem.value.id_budidaya, alasan)
    if (res?.success) {
      showNotification('Siklus budidaya berhasil diselesaikan.', 'success')
      await loadBudidaya()
      eventBus.emit('refreshBudidayaData')
      closeSelesaiModal()
    }
  } catch (err) {
    console.error(err)
    showNotification(err.message || 'Gagal menyelesaikan siklus', 'error')
  } finally {
    isSubmittingSelesai.value = false
  }
}

function openDeleteModal(item) {
  budidayaToDelete.value = item
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  if (isDeleting.value) return
  isDeleteModalOpen.value = false
  budidayaToDelete.value = null
}

async function executeDelete(withBackup) {
  if (!budidayaToDelete.value) return
  const id = budidayaToDelete.value.id_budidaya
  isDeleting.value = true
  
  try {
    if (withBackup) {
      const backupRes = await budidayaService.getBackupData(id)
      if (backupRes && backupRes.success) {
        await exportBudidayaBackup(backupRes.data)
      } else {
        throw new Error('Gagal menarik data backup dari server.')
      }
    }

    await budidayaService.delete(id)
    showNotification('Data budidaya berhasil dihapus.', 'success')
    
    await loadBudidaya()
    eventBus.emit('refreshBudidayaData')
    closeDeleteModal()
  } catch (error) {
    console.error('Gagal menghapus budidaya:', error)
    showNotification(error.response?.data?.message || error.message || 'Gagal menghapus budidaya.', 'error')
  } finally {
    isDeleting.value = false
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

.subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: #6b7280;
}


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

.budidaya-grid {
  display: grid;
  grid-template-columns: 90px 1.3fr 1.1fr 80px 130px 1.3fr 90px 100px;
  min-width: 1050px;
  gap: 16px;
  align-items: center;
  padding: 16px 24px;
  font-size: 14px;
}

.mx-auto { margin-left: auto; margin-right: auto; }
.block { display: block; }
.mb-4 { margin-bottom: 16px; }

.fw-bold { font-weight: 600; }
.petugas-badge { display: inline-flex; align-items: center; background: #f3f4f6; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #4b5563; }

.icon-btn.target:hover { background: #e0f2fe; border-color: #bae6fd; color: #0284c7; }
.icon-btn.selesai:hover { background: #fef3c7; border-color: #fde68a; color: #d97706; }

.action-buttons { display: inline-flex; justify-content: center; gap: 8px; }
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

/* Notification Popup */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-slide-enter-from { opacity: 0; transform: translate(-50%, 20px); }
.fade-slide-leave-to { opacity: 0; transform: translate(-50%, -20px); }

.notification-popup {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  min-width: 320px;
  max-width: 90vw;
}

.notification-popup.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.notification-popup.error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
.notification-icon svg { width: 100%; height: 100%; }

.notification-content { flex-grow: 1; display: flex; flex-direction: column; gap: 2px; }
.notification-title { margin: 0; font-size: 14px; font-weight: 700; }
.notification-message { margin: 0; font-size: 13px; opacity: 0.9; }

.notification-close {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: inherit;
  opacity: 0.5;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}
.notification-close:hover { opacity: 1; background: rgba(0,0,0,0.05); }
.notification-close svg { width: 18px; height: 18px; }

</style>