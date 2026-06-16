<template>
  <div class="admin-page">

    <header class="page-header-modern">
      <div class="header-text">
        <h1>Jenis Jamur</h1>
      </div>
      <div class="header-actions">
        <button type="button" class="btn primary modern-btn" @click.prevent="openForm('create')">+ Tambah</button>
      </div>
    </header>

    <div v-if="showForm" class="modal-overlay">
      <div class="form-modal">
        <h3 class="modal-title">{{ formMode === 'create' ? 'Tambah Jenis Jamur' : 'Ubah Jenis Jamur' }}</h3>
        <form @submit.prevent="saveJenisJamur" class="horizontal-form">
          <div class="form-group">
            <label>Nama Jamur</label>
            <input v-model="formData.nama_jamur" type="text" placeholder="Contoh: Shiitake" required />
          </div>

          <div class="form-group">
            <label>Jenis/Genus</label>
            <input v-model="formData.genus" type="text" placeholder="Contoh: Lentinula" />
          </div>

          <div class="form-group">
            <label>Suhu Optimal (°C)</label>
            <input v-model.number="formData.suhu_optimal" type="number" min="0" max="60" step="0.1" placeholder="20" />
          </div>

          <div class="form-group">
            <label>Kelembapan Optimal (%)</label>
            <input v-model.number="formData.kelembapan_optimal" type="number" min="0" max="100" step="0.1" placeholder="80" />
          </div>

          <div class="form-actions right">
            <button type="button" class="btn outline modern-btn" @click="closeForm">Cancel</button>
            <button type="submit" class="btn primary modern-btn">{{ formMode === 'create' ? '+ Tambah' : 'Simpan' }}</button>
          </div>
        </form>
      </div>
    </div>

    <div class="table-card-modern">
      <div class="table-header-modern jamur-grid green-header">
        <span>ID</span>
        <span>Nama Jamur</span>
        <span>Jenis</span>
        <span>Suhu(°C)</span>
        <span>Kelembapan%</span>
        <span class="text-center">Aksi</span>
      </div>

      <div v-if="loading" class="table-row-modern jamur-grid empty-row">
        <span style="grid-column: 1 / -1; text-align: center;">Memuat data jenis jamur...</span>
      </div>
      <div v-if="errorMessage" class="table-row-modern jamur-grid empty-row err-text">
        <span style="grid-column: 1 / -1; text-align: center;">{{ errorMessage }}</span>
      </div>
      <div v-if="!loading && !jenisList.length && !errorMessage" class="table-row-modern jamur-grid empty-row">
        <span style="grid-column: 1 / -1; text-align: center;">Belum ada data jenis jamur.</span>
      </div>

      <div v-for="item in jenisList" :key="item.id_jenis" class="table-row-modern jamur-grid has-divider">
        <span class="id-col fw-600">BDY-{{ item.id_jenis?.toString().padStart(3, '0') || '000' }}</span>
        <span class="fw-700 hitam">{{ item.nama_jamur }}</span>
        <span class="hitam">{{ item.genus || '-' }}</span>
        <span class="hitam fw-600">{{ item.suhu_optimal ?? '-' }}°C</span>
        <span class="hitam fw-600">{{ item.kelembapan_optimal ?? '-' }}%</span>
        <span class="actions-modern">
          <button type="button" class="icon-btn edit" @click.prevent="openForm('edit', item)">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button type="button" class="icon-btn delete" @click.prevent="openDeleteModal(item.id_jenis)" title="Hapus">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div v-if="isDeleteModalOpen" class="modal-overlay">
      <div class="form-modal fade-in-up" style="max-width: 400px; text-align: center;">
        <div class="modal-icon" style="color: #ef4444; margin-bottom: 16px;">
          <svg viewBox="0 0 24 24" width="48" height="48" style="display: block; margin: 0 auto;"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <h3 class="modal-title" style="color: #ef4444; margin: 0 0 8px 0; font-size: 20px; font-weight: 800;">Konfirmasi Hapus</h3>
        <p class="modal-text" style="margin: 0 0 18px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
          Apakah Anda yakin ingin menghapus data jamur ini?
        </p>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <button class="btn outline modern-btn" @click="closeDeleteModal">Batal</button>
          <button class="btn primary modern-btn" style="background: #ef4444;" @click="executeDelete">Ya, Hapus</button>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import eventBus from '../../services/eventBus.js'
import { jenisJamurService } from '../../services/dataService.js'

const jenisList = ref([])
const loading = ref(false)
const errorMessage = ref('')
const showForm = ref(false)
const formMode = ref('create')
const editId = ref(null)
const formData = ref({ nama_jamur: '', genus: '', suhu_optimal: 0, kelembapan_optimal: 0 })

const isDeleteModalOpen = ref(false)
const idToDelete = ref(null)

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

async function loadJenisJamur() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await jenisJamurService.getAll()
    if (response?.success) {
      jenisList.value = response.data
    } else {
      errorMessage.value = 'Gagal memuat data jenis jamur.'
    }
  } catch (error) {
    console.error('Error load jenis jamur:', error)
    errorMessage.value = 'Terjadi kesalahan saat mengambil data jenis jamur.'
  } finally {
    loading.value = false
  }
}

function openForm(mode, item = null) {
  formMode.value = mode
  showForm.value = true
  if (mode === 'edit' && item) {
    editId.value = item.id_jenis
    formData.value = {
      nama_jamur: item.nama_jamur,
      genus: item.genus || '',
      suhu_optimal: item.suhu_optimal ?? 0,
      kelembapan_optimal: item.kelembapan_optimal ?? 0,
    }
  } else {
    editId.value = null
    formData.value = { nama_jamur: '', genus: '', suhu_optimal: 0, kelembapan_optimal: 0 }
  }
}

function closeForm() {
  showForm.value = false
  editId.value = null
}

async function saveJenisJamur() {
  try {
    const payload = { ...formData.value }
    if (formMode.value === 'create') {
      await jenisJamurService.create(payload)
    } else if (editId.value) {
      await jenisJamurService.update(editId.value, payload)
    }

    await loadJenisJamur()
    eventBus.emit('refreshBudidayaData')
    showNotification('Data jamur berhasil disimpan!', 'success')
    closeForm()
  } catch (error) {
    console.error('Error simpan jenis jamur:', error)
    showNotification(error.message || 'Gagal menyimpan data jenis jamur.', 'error')
  }
}

function openDeleteModal(id) {
  idToDelete.value = id
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  idToDelete.value = null
}

async function executeDelete() {
  if (!idToDelete.value) return
  try {
    await jenisJamurService.delete(idToDelete.value)
    showNotification('Jenis jamur berhasil dihapus.', 'success')
    await loadJenisJamur()
    eventBus.emit('refreshBudidayaData')
  } catch (error) {
    console.error('Error hapus jenis jamur:', error)
    showNotification(error.message || 'Gagal menghapus data jenis jamur.', 'error')
  } finally {
    closeDeleteModal()
  }
}

onMounted(loadJenisJamur)
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}


.page-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
}

.page-header-modern h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  text-align: center;
}

.horizontal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  gap: 16px;
}
.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}
.form-group input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
}
.form-actions.right {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.modern-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn.primary.modern-btn {
  background: var(--green-dark, #22c55e);
  color: white;
  border: none;
}
.btn.primary.modern-btn:hover {
  background: #16a34a;
}
.btn.outline.modern-btn {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.table-card-modern {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.jamur-grid {
  display: grid;
  grid-template-columns: 120px 2fr 2fr 1fr 1.5fr 120px;
  gap: 16px;
  align-items: center;
  padding: 18px 24px;
  font-size: 14px;
}

.green-header {
  background: #e9fbef;
  border-bottom: none;
  font-weight: 800;
  color: var(--green-dark, #16a34a);
}

.has-divider {
  border-top: 1px solid #f3f4f6;
  background: white;
}

.empty-row {
  display: block;
  padding: 32px;
  color: #6b7280;
}
.err-text { color: #dc2626; }

.id-col { font-weight: 700; color: #111827; }
.hitam { color: #111827; }
.fw-600 { font-weight: 600; }
.fw-700 { font-weight: 700; }
.text-center { text-align: center; }

.actions-modern {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.icon-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 6px;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}
.icon-btn svg { width: 18px; height: 18px; }





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