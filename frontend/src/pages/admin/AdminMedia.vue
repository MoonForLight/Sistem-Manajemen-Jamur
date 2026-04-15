<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Media Tanam</h1>
        <p class="page-description">Simpan dan perbarui pilihan media tanam untuk setiap jenis budidaya.</p>
      </div>
      <button type="button" class="btn primary" @click.prevent="openForm('create')">Tambah Media</button>
    </header>

    <div v-if="showForm" class="form-card">
      <h3>{{ formMode === 'create' ? 'Tambah Media Tanam' : 'Ubah Media Tanam' }}</h3>
      <form @submit.prevent="saveMedia">
        <label>
          Nama Media
          <input v-model="formData.nama_media" type="text" placeholder="Serbuk Kayu" required />
        </label>

        <label>
          Kadar Air Optimal (%)
          <input v-model.number="formData.kadar_air_optimal" type="number" min="0" placeholder="65" />
        </label>

        <label>
          Catatan
          <textarea v-model="formData.catatan" placeholder="Informasi tambahan"></textarea>
        </label>

        <div class="form-actions">
          <button type="submit" class="btn primary">Simpan</button>
          <button type="button" class="btn outline" @click="closeForm">Batal</button>
        </div>
      </form>
    </div>

    <div class="table-card">
      <div class="table-header">
        <span>Nama Media</span>
        <span>Kadar Air</span>
        <span>Catatan</span>
        <span>Aksi</span>
      </div>

      <div v-if="loading" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Memuat data media tanam...</span>
      </div>
      <div v-if="errorMessage" class="table-row empty-row">
        <span style="grid-column: 1 / -1">{{ errorMessage }}</span>
      </div>
      <div v-if="!loading && !mediaList.length && !errorMessage" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Belum ada data media tanam.</span>
      </div>

      <div v-for="item in mediaList" :key="item.id_media" class="table-row">
        <span>{{ item.nama_media }}</span>
        <span>{{ item.kadar_air_optimal ?? '-' }}%</span>
        <span>{{ item.catatan || '-' }}</span>
        <span class="actions">
          <button type="button" class="btn small" @click.prevent="openForm('edit', item)">Edit</button>
          <button type="button" class="btn small outline" @click.prevent="deleteMedia(item.id_media)">Hapus</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #111827;
}

.page-description {
  margin: 8px 0 0;
  color: #6b7280;
}

.form-card,
.table-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.form-card h3 {
  margin-top: 0;
}

form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

input,
textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  gap: 12px;
  align-items: center;
  padding: 14px 0;
}

.table-header {
  border-bottom: 1px solid #e5e7eb;
  font-weight: 700;
  color: #374151;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
}

.table-row:last-child {
  border-bottom: none;
}

.empty-row span {
  grid-column: 1 / -1;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn.primary {
  background: #16a34a;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}

.btn.small {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
}

.btn.small.outline,
.btn.outline {
  background: transparent;
  color: #111827;
  border: 1px solid #d1d5db;
}
</style>
