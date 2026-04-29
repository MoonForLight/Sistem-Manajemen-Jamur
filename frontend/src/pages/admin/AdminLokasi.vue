<template>
  <div class="admin-page">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Daftar Lokasi Budidaya</h1>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Cari lokasi" />
        </div>
        <button type="button" class="btn primary modern-btn" @click.prevent="openForm('create')">+ Tambah</button>
      </div>
    </header>

    <div v-if="showForm" class="modal-overlay">
      <div class="form-modal">
        <h3 class="modal-title">{{ formMode === 'create' ? 'Tambah Lokasi' : 'Ubah Lokasi' }}</h3>
        <form @submit.prevent="saveLocation" class="horizontal-form">
          
          <div class="form-group photo-group">
            <label>Foto Lokasi (Opsional)</label>
            <div class="photo-upload-area">
              <div v-if="fotoPreview || formData.foto_lokasi" class="photo-preview-container">
                <img :src="fotoPreview || 'http://localhost:3000/uploads/' + formData.foto_lokasi" class="photo-preview" />
                <button type="button" class="btn-remove-photo" @click="removePhoto">Hapus</button>
              </div>
              <div v-else class="upload-placeholder" @click="$refs.fileInput.click()">
                <span>+ Pilih Foto Rumah Jamur</span>
              </div>
              <input type="file" ref="fileInput" accept="image/*" @change="handleFileChange" style="display: none;" />
            </div>
          </div>

          <div class="form-group">
            <label>Nama Lokasi</label>
            <input v-model="formData.nama_lokasi" type="text" placeholder="Contoh: Sembalun" required />
          </div>

          <div class="form-group">
            <label>Alamat</label>
            <input v-model="formData.alamat" type="text" placeholder="Alamat lokasi" />
          </div>

          <div class="form-group">
            <label>Jumlah Rak</label>
            <input v-model.number="formData.jumlah_rak" type="number" min="0" placeholder="Jumlah rak" />
          </div>

          <div class="form-group">
            <label>Keterangan</label>
            <input v-model="formData.keterangan" type="text" placeholder="Keterangan singkat" />
          </div>

          <div class="form-actions right">
            <button type="button" class="btn outline modern-btn" @click="closeForm">Cancel</button>
            <button type="submit" class="btn primary modern-btn" :disabled="isUploading">
              {{ isUploading ? 'Mengunggah...' : (formMode === 'create' ? '+ Tambahkan' : 'Simpan') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Table content -->
    <div class="table-card-modern">
      <div class="table-header-modern">
        <span>Foto</span>
        <span>ID</span>
        <span>Nama Lokasi</span>
        <span>Alamat</span>
        <span>Keterangan</span>
        <span class="text-center">Action</span>
      </div>
      <div v-if="loading" class="table-row-modern empty-row">
        <span style="grid-column: 1 / -1; text-align: center;">Memuat data lokasi...</span>
      </div>
      <div v-if="!loading && !filteredLokasiList.length" class="table-row-modern empty-row">
        <span style="grid-column: 1 / -1; text-align: center;">Belum ada hasil pencarian / lokasi budidaya.</span>
      </div>
      <div v-for="(item, index) in filteredLokasiList" :key="item.id_lokasi" :class="['table-row-modern', index % 2 === 0 ? 'even-row' : 'odd-row']">
        <div class="table-photo-col">
          <img v-if="item.foto_lokasi" :src="'http://localhost:3000/uploads/' + item.foto_lokasi" class="table-thumb" />
          <div v-else class="table-thumb-placeholder">🏞️</div>
        </div>
        <span class="id-col">#{{ item.id_lokasi?.toString().padStart(5, '0') || '00000' }}</span>
        <span class="fw-600">{{ item.nama_lokasi }}</span>
        <span>{{ item.alamat || '-' }}</span>
        <span>{{ item.keterangan || '-' }}</span>
        <span class="actions-modern">
          <button type="button" class="icon-btn edit" @click.prevent="openForm('edit', item)">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button type="button" class="icon-btn delete" @click.prevent="deleteLocation(item.id_lokasi)">
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
import { lokasiService, uploadService } from '../../services/dataService.js'

const lokasiList = ref([])
const loading = ref(false)
const showForm = ref(false)
const formMode = ref('create')
const formData = ref({ nama_lokasi: '', alamat: '', jumlah_rak: 0, keterangan: '', foto_lokasi: null })
const editId = ref(null)
const searchQuery = ref('')
const isUploading = ref(false)

const fileToUpload = ref(null)
const fotoPreview = ref(null)

const filteredLokasiList = computed(() => {
  if (!searchQuery.value) return lokasiList.value
  const q = searchQuery.value.toLowerCase()
  return lokasiList.value.filter(item => 
    item.nama_lokasi.toLowerCase().includes(q) || 
    (item.alamat && item.alamat.toLowerCase().includes(q))
  )
})

async function loadLokasi() {
  loading.value = true
  try {
    const response = await lokasiService.getAll()
    if (response?.success) lokasiList.value = response.data
  } catch (error) {
    console.error('Gagal memuat lokasi:', error)
  } finally {
    loading.value = false
  }
}

function openForm(mode, item = null) {
  formMode.value = mode
  showForm.value = true
  fileToUpload.value = null
  fotoPreview.value = null

  if (mode === 'edit' && item) {
    editId.value = item.id_lokasi
    formData.value = {
      nama_lokasi: item.nama_lokasi,
      alamat: item.alamat || '',
      jumlah_rak: item.jumlah_rak || 0,
      keterangan: item.keterangan || '',
      foto_lokasi: item.foto_lokasi || null
    }
  } else {
    editId.value = null
    formData.value = { nama_lokasi: '', alamat: '', jumlah_rak: 0, keterangan: '', foto_lokasi: null }
  }
}

function closeForm() {
  showForm.value = false
  editId.value = null
  fileToUpload.value = null
  fotoPreview.value = null
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  fileToUpload.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    fotoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removePhoto() {
  fileToUpload.value = null
  fotoPreview.value = null
  formData.value.foto_lokasi = null
}

async function saveLocation() {
  try {
    isUploading.value = true
    let finalFileName = formData.value.foto_lokasi

    if (fileToUpload.value) {
      const uploadRes = await uploadService.uploadImage(fileToUpload.value)
      if (uploadRes.success) {
        finalFileName = uploadRes.filename
      } else {
        alert('Gagal mengunggah foto. Menyimpan tanpa foto baru.')
      }
    }

    const payload = { ...formData.value, foto_lokasi: finalFileName }
    
    if (formMode.value === 'create') {
      await lokasiService.create(payload)
    } else if (editId.value) {
      await lokasiService.update(editId.value, payload)
    }
    
    await loadLokasi()
    eventBus.emit('refreshBudidayaData')
    closeForm()
  } catch (error) {
    console.error('Gagal menyimpan lokasi:', error)
    alert('Terjadi kesalahan saat menyimpan lokasi.')
  } finally {
    isUploading.value = false
  }
}

async function deleteLocation(id) {
  if (!confirm('Hapus lokasi ini?')) return
  try {
    await lokasiService.delete(id)
    await loadLokasi()
    eventBus.emit('refreshBudidayaData')
  } catch (error) {
    console.error('Gagal menghapus lokasi:', error)
  }
}

onMounted(loadLokasi)
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
  max-height: 90vh;
  overflow-y: auto;
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

.photo-group {
  align-items: start;
}

.photo-upload-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-placeholder {
  width: 100%;
  height: 120px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  background: #f9fafb;
  transition: all 0.2s;
}

.upload-placeholder:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.photo-preview-container {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-photo {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-remove-photo:hover {
  background: rgb(220, 38, 38);
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
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
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
.btn.primary.modern-btn:hover:not(:disabled) {
  background: #16a34a;
}
.btn.primary.modern-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  grid-template-columns: 60px 80px 2fr 2fr 1.5fr 100px;
  gap: 16px;
  align-items: center;
  padding: 12px 24px;
  font-size: 14px;
}

.table-photo-col {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}

.table-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.table-thumb-placeholder {
  font-size: 20px;
}

.table-header-modern {
  font-weight: 800;
  color: #111827;
  background: white;
  border-bottom: 2px solid #f3f4f6;
  padding: 16px 24px;
}

.even-row {
  background: #f4fcf6;
}
.odd-row {
  background: #ffffff;
}
.table-row-modern {
  color: #374151;
  border-bottom: 1px solid #f9fafb;
}

.empty-row {
  display: block;
  padding: 32px;
  color: #6b7280;
}

.id-col {
  font-weight: 500;
  color: #4b5563;
}
.fw-600 {
  font-weight: 600;
  color: #111827;
}

.text-center {
  text-align: center;
}

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
.icon-btn svg {
  width: 20px;
  height: 20px;
}
.icon-btn.edit:hover {
  background: #eff6ff;
  color: #3b82f6;
}
.icon-btn.delete:hover {
  background: #fef2f2;
  color: #ef4444;
}

@media(max-width: 768px) {
  .form-group {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
