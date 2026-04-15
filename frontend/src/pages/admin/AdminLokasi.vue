<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Lokasi Budidaya</h1>
        <p class="page-description">Lihat, edit, dan kelola data lokasi budidaya jamur.</p>
      </div>
      <button type="button" class="btn primary" @click.prevent="openForm('create')">Tambah Lokasi Baru</button>
    </header>

    <div v-if="showForm" class="form-card">
      <h3>{{ formMode === 'create' ? 'Tambah Lokasi' : 'Ubah Lokasi' }}</h3>
      <form @submit.prevent="saveLocation">
        <label>
          Nama Lokasi
          <input v-model="formData.nama_lokasi" type="text" placeholder="Contoh: Sembalun" required />
        </label>

        <label>
          Alamat
          <input v-model="formData.alamat" type="text" placeholder="Alamat lokasi" />
        </label>

        <label>
          Jumlah Rak
          <input v-model.number="formData.jumlah_rak" type="number" min="0" placeholder="Jumlah rak" />
        </label>

        <label>
          Keterangan
          <textarea v-model="formData.keterangan" placeholder="Keterangan singkat"></textarea>
        </label>

        <div class="form-actions">
          <button type="submit" class="btn primary">Simpan</button>
          <button type="button" class="btn outline" @click="closeForm">Batal</button>
        </div>
      </form>
    </div>

    <div class="table-card">
      <div class="table-header">
        <span>Nama Lokasi</span>
        <span>Alamat</span>
        <span>Jumlah Rak</span>
        <span>Aksi</span>
      </div>
      <div v-if="loading" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Memuat data lokasi...</span>
      </div>
      <div v-if="!loading && !lokasiList.length" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Belum ada lokasi budidaya.</span>
      </div>
      <div v-for="item in lokasiList" :key="item.id_lokasi" class="table-row">
        <span>{{ item.nama_lokasi }}</span>
        <span>{{ item.alamat || '-' }}</span>
        <span>{{ item.jumlah_rak }}</span>
        <span class="actions">
          <button type="button" class="btn small" @click.prevent="openForm('edit', item)">Edit</button>
          <button type="button" class="btn small outline" @click.prevent="deleteLocation(item.id_lokasi)">Hapus</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import eventBus from '../../services/eventBus.js'
import { lokasiService } from '../../services/dataService.js'

const lokasiList = ref([])
const loading = ref(false)
const showForm = ref(false)
const formMode = ref('create')
const formData = ref({ nama_lokasi: '', alamat: '', jumlah_rak: 0, keterangan: '' })
const editId = ref(null)

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
  if (mode === 'edit' && item) {
    editId.value = item.id_lokasi
    formData.value = {
      nama_lokasi: item.nama_lokasi,
      alamat: item.alamat || '',
      jumlah_rak: item.jumlah_rak || 0,
      keterangan: item.keterangan || '',
    }
  } else {
    editId.value = null
    formData.value = { nama_lokasi: '', alamat: '', jumlah_rak: 0, keterangan: '' }
  }
}

function closeForm() {
  showForm.value = false
  editId.value = null
}

async function saveLocation() {
  try {
    const payload = { ...formData.value }
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
  grid-template-columns: 2fr 1fr 1fr 1fr;
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
