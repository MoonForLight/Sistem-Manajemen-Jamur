<template>
  <div class="admin-page">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Daftar Petugas</h1>
        <p class="page-description">Kelola data pengguna, peran, dan penugasan lokasi.</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Cari petugas" />
        </div>
        <button type="button" class="btn primary modern-btn" @click.prevent="openForm('create')">+ Tambah</button>
      </div>
    </header>

    <div v-if="showForm" class="modal-overlay">
      <div class="form-modal">
        <h3 class="modal-title">{{ formMode === 'create' ? 'Tambah Petugas' : 'Ubah Petugas' }}</h3>
        <form @submit.prevent="savePetugas" class="horizontal-form">
          <div class="form-group">
            <label>Nama</label>
            <input v-model="formData.nama" type="text" placeholder="Nama lengkap" required />
          </div>

          <div class="form-group">
            <label>Username</label>
            <input v-model="formData.username" type="text" placeholder="Username login" required />
          </div>

          <div v-if="formMode === 'create'" class="form-group">
            <label>Password</label>
            <input v-model="formData.password" type="password" placeholder="Password login" required />
          </div>

          <div class="form-group">
            <label>Lokasi Bertugas</label>
            <select v-model.number="formData.id_lokasi" class="modern-select" required>
              <option value="" disabled>Pilih lokasi</option>
              <option v-for="lokasi in lokasiOptions" :key="lokasi.id_lokasi" :value="lokasi.id_lokasi">
                {{ lokasi.nama_lokasi }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Status</label>
            <select v-model="formData.status" class="modern-select" required>
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Non-aktif</option>
            </select>
          </div>

          <div class="form-actions right">
            <button type="button" class="btn outline modern-btn" @click="closeForm">Cancel</button>
            <button type="submit" class="btn primary modern-btn">{{ formMode === 'create' ? '+ Tambahkan' : 'Simpan' }}</button>
          </div>
        </form>
      </div>
    </div>

    <div class="table-card-modern">
      <div class="table-header-modern petugas-grid green-header">
        <span>ID</span>
        <span>Username</span>
        <span>Lokasi Bertugas</span>
        <span>Status</span>
        <span class="text-center">Action</span>
      </div>

      <div v-if="loading" class="table-row-modern petugas-grid empty-row">
        <span style="grid-column: 1 / -1; text-align: center;">Memuat data petugas...</span>
      </div>
      <div v-if="!loading && !filteredPetugasList.length" class="table-row-modern petugas-grid empty-row">
        <div style="grid-column: 1 / -1; text-align: center;">
          <svg viewBox="0 0 24 24" width="48" height="48" class="text-muted mb-4 mx-auto block"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
          <p>Belum ada data petugas yang cocok.</p>
        </div>
      </div>
      <div v-for="user in filteredPetugasList" :key="user.id_user" class="table-row-modern petugas-grid has-divider">
        <span class="id-col">#{{ user.id_user?.toString().padStart(5, '0') || '00000' }}</span>
        <div class="user-info">
          <span class="fw-600">{{ user.nama }}</span>
          <span class="text-sm sub-text">@{{ user.username }}</span>
        </div>
        <span>{{ user.nama_lokasi || '-' }}</span>
        <span>
          <span :class="['status-chip', user.status === 'aktif' ? 'active' : 'inactive']">
            {{ user.status || 'Unknown' }}
          </span>
        </span>
        <span class="actions-modern">
          <button type="button" class="icon-btn edit" @click.prevent="openForm('edit', user)">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button type="button" class="icon-btn delete" @click.prevent="openDeleteModal(user.id_user)">
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
          Apakah Anda yakin ingin menghapus petugas ini?
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
import { ref, onMounted, computed } from 'vue'
import eventBus from '../../services/eventBus.js'
import { usersService, lokasiService } from '../../services/dataService.js'

const petugasList = ref([])
const lokasiOptions = ref([])
const loading = ref(false)
const showForm = ref(false)
const formMode = ref('create')
const editId = ref(null)
const formData = ref({ nama: '', username: '', password: '', id_lokasi: '', status: 'aktif' })
const searchQuery = ref('')

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

const filteredPetugasList = computed(() => {
  if (!searchQuery.value) return petugasList.value
  const q = searchQuery.value.toLowerCase()
  return petugasList.value.filter(user => 
    user.nama.toLowerCase().includes(q) || 
    user.username.toLowerCase().includes(q) ||
    (user.nama_lokasi && user.nama_lokasi.toLowerCase().includes(q))
  )
})

async function loadPetugas() {
  loading.value = true
  try {
    const response = await usersService.getPetugasList()
    if (response?.success) {
      petugasList.value = response.data
    }
  } catch (error) {
    console.error('Error load petugas:', error)
  } finally {
    loading.value = false
  }
}

async function loadLokasi() {
  try {
    const response = await lokasiService.getAll()
    lokasiOptions.value = response?.success ? response.data : []
  } catch (error) {
    console.error('Error load lokasi untuk petugas:', error)
  }
}

function openForm(mode, user = null) {
  formMode.value = mode
  showForm.value = true
  if (mode === 'edit' && user) {
    editId.value = user.id_user
    formData.value = {
      nama: user.nama,
      username: user.username,
      password: '',
      id_lokasi: user.id_lokasi || '',
      status: user.status || 'aktif',
    }
  } else {
    editId.value = null
    formData.value = { nama: '', username: '', password: '', id_lokasi: '', status: 'aktif' }
  }
}

function closeForm() {
  showForm.value = false
  editId.value = null
}

async function savePetugas() {
  try {
    if (formMode.value === 'create') {
      await usersService.createPetugas({
        nama: formData.value.nama,
        username: formData.value.username,
        password: formData.value.password,
        role: 'petugas',
        id_lokasi: formData.value.id_lokasi,
        status: formData.value.status,
      })
    } else if (editId.value) {
      await usersService.updatePetugas(editId.value, {
        nama: formData.value.nama,
        username: formData.value.username,
        id_lokasi: formData.value.id_lokasi,
        status: formData.value.status,
      })
    }
    await loadPetugas()
    eventBus.emit('refreshBudidayaData')
    showNotification('Data petugas berhasil disimpan!', 'success')
    closeForm()
  } catch (error) {
    console.error('Error simpan petugas:', error)
    showNotification(error.message || 'Gagal menyimpan data petugas.', 'error')
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
    await usersService.deletePetugas(idToDelete.value)
    showNotification('Data petugas berhasil dihapus.', 'success')
    await loadPetugas()
    eventBus.emit('refreshBudidayaData')
  } catch (error) {
    console.error('Error hapus petugas:', error)
    showNotification(error.message || 'Gagal menghapus data petugas.', 'error')
  } finally {
    closeDeleteModal()
  }
}

onMounted(() => {
  loadPetugas()
  loadLokasi()
})
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  grid-template-columns: 140px 1fr;
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
  background: #ffffff;
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
.btn.outline.modern-btn:hover {
  background: #f9fafb;
}

.petugas-grid {
  grid-template-columns: 100px 2fr 2fr 1fr 100px;
}

.user-info { display: flex; flex-direction: column; }
.fw-600 { font-weight: 600; color: #111827; }
.sub-text { color: #9ca3af; font-size: 12px; }

.status-chip {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}
.status-chip.active { background: #dcfce7; color: #166534; }
.status-chip.inactive { background: #fee2e2; color: #991b1b; }





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