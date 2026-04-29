<template>
  <div class="admin-page">
    <!-- Tabs Navigasi Pseudo -->
    <div class="tabs-bar">
      <RouterLink to="/admin/jamur" class="tab-item">Jenis Jamur</RouterLink>
      <RouterLink to="/admin/media" class="tab-item active">Media Tanam</RouterLink>
    </div>

    <header class="page-header-modern">
      <div class="header-text">
        <h1>Media Tanam</h1>
      </div>
      <div class="header-actions">
        <button type="button" class="btn primary modern-btn" @click.prevent="openForm('create')">+ Tambah</button>
      </div>
    </header>

    <div v-if="showForm" class="modal-overlay">
      <div class="form-modal">
        <h3 class="modal-title">{{ formMode === 'create' ? 'Tambah Media Tanam' : 'Ubah Media Tanam' }}</h3>
        <form @submit.prevent="saveMedia" class="horizontal-form">
          <div class="form-group">
            <label>Nama Media</label>
            <input v-model="formData.nama_media" type="text" placeholder="Serbuk Kayu" required />
          </div>

          <div class="form-group">
            <label>Kadar Air Optimal (%)</label>
            <input v-model.number="formData.kadar_air_optimal" type="number" min="0" placeholder="65" />
          </div>

          <div class="form-group">
            <label>Catatan</label>
            <input v-model="formData.catatan" type="text" placeholder="Informasi tambahan" />
          </div>

          <div class="form-actions right">
            <button type="button" class="btn outline modern-btn" @click="closeForm">Cancel</button>
            <button type="submit" class="btn primary modern-btn">{{ formMode === 'create' ? '+ Tambah' : 'Simpan' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Table content -->
    <div class="table-card-modern">
      <div class="table-header-modern media-grid green-header">
        <span>Nama Media</span>
        <span>Kadar Air</span>
        <span>Catatan</span>
        <span class="text-center">Aksi</span>
      </div>

      <div v-if="loading" class="table-row-modern media-grid empty-row">
        <span style="grid-column: 1 / -1; text-align: center;">Memuat data media tanam...</span>
      </div>
      <div v-if="errorMessage" class="table-row-modern media-grid empty-row err-text">
        <span style="grid-column: 1 / -1; text-align: center;">{{ errorMessage }}</span>
      </div>
      <div v-if="!loading && !mediaList.length && !errorMessage" class="table-row-modern media-grid empty-row">
        <span style="grid-column: 1 / -1; text-align: center;">Belum ada data media tanam.</span>
      </div>

      <div v-for="item in mediaList" :key="item.id_media" class="table-row-modern media-grid has-divider">
        <span class="fw-700 hitam">{{ item.nama_media }}</span>
        <span class="hitam fw-600">{{ item.kadar_air_optimal ?? '-' }}%</span>
        <span>{{ item.catatan || '-' }}</span>
        <span class="actions-modern">
          <button type="button" class="text-link-btn" @click.prevent="openForm('edit', item)">Update &rarr;</button>
          <button type="button" class="icon-btn delete-mini" @click.prevent="deleteMedia(item.id_media)" title="Hapus">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import eventBus from '../../services/eventBus.js'
import { mediaTanamService } from '../../services/dataService.js'

const mediaList = ref([])
const loading = ref(false)
const errorMessage = ref('')
const showForm = ref(false)
const formMode = ref('create')
const editId = ref(null)
const formData = ref({ nama_media: '', kadar_air_optimal: 0, catatan: '' })

async function loadMedia() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await mediaTanamService.getAll()
    if (response?.success) mediaList.value = response.data
    else errorMessage.value = 'Gagal memuat data media tanam.'
  } catch (error) {
    console.error('Error load media tanam:', error)
    errorMessage.value = 'Terjadi kesalahan saat mengambil data media tanam.'
  } finally {
    loading.value = false
  }
}

function openForm(mode, item = null) {
  formMode.value = mode
  showForm.value = true
  if (mode === 'edit' && item) {
    editId.value = item.id_media
    formData.value = {
      nama_media: item.nama_media,
      kadar_air_optimal: item.kadar_air_optimal ?? 0,
      catatan: item.catatan || '',
    }
  } else {
    editId.value = null
    formData.value = { nama_media: '', kadar_air_optimal: 0, catatan: '' }
  }
}

function closeForm() {
  showForm.value = false
  editId.value = null
}

async function saveMedia() {
  try {
    const payload = { ...formData.value }
    if (formMode.value === 'create') {
      await mediaTanamService.create(payload)
    } else if (editId.value) {
      await mediaTanamService.update(editId.value, payload)
    }
    await loadMedia()
    eventBus.emit('refreshBudidayaData')
    closeForm()
  } catch (error) {
    console.error('Error simpan media:', error)
    errorMessage.value = 'Gagal menyimpan data media tanam.'
  }
}

async function deleteMedia(id) {
  if (!confirm('Hapus media tanam ini?')) return
  try {
    await mediaTanamService.delete(id)
    await loadMedia()
    eventBus.emit('refreshBudidayaData')
  } catch (error) {
    console.error('Error hapus media:', error)
    errorMessage.value = 'Gagal menghapus data media tanam.'
  }
}

onMounted(loadMedia)
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Tabs */
.tabs-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}
.tab-item {
  padding: 10px 24px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.2s;
}
.tab-item.active {
  background: #e9fbef;
  color: var(--green-dark, #16a34a);
  border-color: #d1fae5;
}
.tab-item:hover:not(.active) {
  background: #f9fafb;
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
  max-width: 500px;
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
  grid-template-columns: 160px 1fr;
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

/* Table Style */
.table-card-modern {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.media-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 120px;
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

.hitam { color: #111827; }
.fw-600 { font-weight: 600; }
.fw-700 { font-weight: 700; }
.text-center { text-align: center; }

.actions-modern {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.text-link-btn {
  background: transparent;
  border: none;
  color: #3b82f6;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  padding: 4px;
}
.text-link-btn:hover { text-decoration: underline; }

.delete-mini {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ef4444;
  display: flex; align-items: center; justify-content: center;
  padding: 4px; border-radius: 4px; transition: all 0.2s;
}
.delete-mini:hover { background: #fee2e2; }
.delete-mini svg { width: 18px; height: 18px; }
</style>
