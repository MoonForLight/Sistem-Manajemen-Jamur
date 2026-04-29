<template>
  <div class="admin-page">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Daftar Petugas</h1>
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

    <!-- Table content -->
    <div class="table-card-modern">
      <div class="table-header-modern petugas-grid">
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
        <span style="grid-column: 1 / -1; text-align: center;">Belum ada data petugas yang cocok.</span>
      </div>
      <div v-for="(user, index) in filteredPetugasList" :key="user.id_user" :class="['table-row-modern', 'petugas-grid', index % 2 === 0 ? 'even-row' : 'odd-row']">
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
          <button type="button" class="icon-btn delete" @click.prevent="deletePetugas(user.id_user)">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </span>
      </div>
    </div>
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
    closeForm()
  } catch (error) {
    console.error('Error simpan petugas:', error)
    alert(error.message || 'Gagal menyimpan data petugas.')
  }
}

async function deletePetugas(id) {
  if (!confirm('Hapus petugas ini?')) return
  try {
    await usersService.deletePetugas(id)
    await loadPetugas()
    eventBus.emit('refreshBudidayaData')
  } catch (error) {
    console.error('Error hapus petugas:', error)
    alert(error.message || 'Gagal menghapus data petugas.')
  }
}

onMounted(async () => {
  await Promise.all([loadPetugas(), loadLokasi()])
})
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.page-header-modern h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.search-box input {
  padding: 10px 12px 10px 36px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  font-size: 14px;
  width: 250px;
  transition: all 0.2s;
}
.search-box input:focus {
  outline: none;
  border-color: var(--green-dark, #16a34a);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
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

.form-group input,
.modern-select {
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

/* Modern Button */
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

/* Table Style */
.table-card-modern {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.table-header-modern,
.table-row-modern {
  display: grid;
  gap: 16px;
  align-items: center;
  padding: 16px 24px;
  font-size: 14px;
}

.petugas-grid {
  grid-template-columns: 100px 2fr 2fr 1fr 100px;
}

.table-header-modern {
  font-weight: 800;
  color: #111827;
  background: white;
  border-bottom: 2px solid #f3f4f6;
}

.even-row { background: #f4fcf6; }
.odd-row { background: #ffffff; }

.table-row-modern {
  color: #374151;
  border-bottom: 1px solid #f9fafb;
}

.empty-row {
  display: block;
  padding: 32px;
  color: #6b7280;
}

.id-col { font-weight: 500; color: #4b5563; }
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

.text-center { text-align: center; }

.actions-modern {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.2s;
}
.icon-btn svg { width: 20px; height: 20px; }
.icon-btn.edit:hover { background: #eff6ff; color: #3b82f6; }
.icon-btn.delete:hover { background: #fef2f2; color: #ef4444; }
</style>