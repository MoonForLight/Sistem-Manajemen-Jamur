<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Jenis Jamur</h1>
        <p class="page-description">Kelola jenis jamur yang tersedia untuk budidaya dan monitoring.</p>
      </div>
      <button type="button" class="btn primary" @click.prevent="openForm('create')">Tambah Jenis</button>
    </header>

    <div v-if="showForm" class="form-card">
      <h3>{{ formMode === 'create' ? 'Tambah Jenis Jamur' : 'Ubah Jenis Jamur' }}</h3>
      <form @submit.prevent="saveJenisJamur">
        <label>
          Nama Jamur
          <input v-model="formData.nama_jamur" type="text" placeholder="Contoh: Shiitake" required />
        </label>

        <label>
          Genus
          <input v-model="formData.genus" type="text" placeholder="Contoh: Lentinula" />
        </label>

        <label>
          Suhu Optimal (°C)
          <input v-model.number="formData.suhu_optimal" type="number" min="0" placeholder="20" />
        </label>

        <label>
          Kelembapan Optimal (%)
          <input v-model.number="formData.kelembapan_optimal" type="number" min="0" placeholder="80" />
        </label>

        <div class="form-actions">
          <button type="submit" class="btn primary">Simpan</button>
          <button type="button" class="btn outline" @click="closeForm">Batal</button>
        </div>
      </form>
    </div>

    <div class="cards-grid">
      <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
      <div v-if="!loading && !jenisList.length && !errorMessage" class="error-banner">Belum ada data jenis jamur.</div>
      <div v-for="item in jenisList" :key="item.id_jenis" class="jenis-card">
        <div class="jenis-header">
          <span class="jenis-title">{{ item.nama_jamur }}</span>
          <span class="badge badge-active">Aktif</span>
        </div>
        <div class="jenis-details">
          <p><strong>Genus:</strong> {{ item.genus || '-' }}</p>
          <p><strong>Suhu Optimal:</strong> {{ item.suhu_optimal ?? '-' }}°C</p>
          <p><strong>Kelembapan Optimal:</strong> {{ item.kelembapan_optimal ?? '-' }}%</p>
        </div>
        <div class="card-actions">
          <button type="button" class="btn small" @click.prevent="openForm('edit', item)">Edit</button>
          <button type="button" class="btn small outline" @click.prevent="deleteJenis(item.id_jenis)">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import eventBus from '../../services/eventBus.js'
import { jenisJamurService } from '../../services/dataService.js'

const jenisList = ref([])
const loading = ref(false)
const errorMessage = ref('')
const showForm = ref(false)
const formMode = ref('create')
const editId = ref(null)
const formData = ref({ nama_jamur: '', genus: '', suhu_optimal: 0, kelembapan_optimal: 0 })

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
    closeForm()
  } catch (error) {
    console.error('Error simpan jenis jamur:', error)
    errorMessage.value = error.message || 'Gagal menyimpan data jenis jamur.'
  }
}

async function deleteJenis(id) {
  if (!confirm('Hapus jenis jamur ini?')) return
  try {
    await jenisJamurService.delete(id)
    await loadJenisJamur()
    eventBus.emit('refreshBudidayaData')
  } catch (error) {
    console.error('Error hapus jenis jamur:', error)
    errorMessage.value = error.message || 'Gagal menghapus data jenis jamur.'
  }
}

onMounted(loadJenisJamur)
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
.cards-grid {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
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

input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.jenis-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.jenis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.jenis-title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
}

.badge {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.badge-active {
  color: #166534;
  background: #dcfce7;
}

.jenis-details p {
  margin: 8px 0;
  color: #4b5563;
  font-size: 14px;
}

.card-actions {
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

.error-banner {
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 14px;
  border-radius: 16px;
}
</style>