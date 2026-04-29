<template>
  <div class="admin-page">
    <!-- Tabs Navigasi Pseudo -->
    <div class="tabs-bar">
      <RouterLink to="/admin/jamur" class="tab-item active">Jenis Jamur</RouterLink>
      <RouterLink to="/admin/media" class="tab-item">Media Tanam</RouterLink>
    </div>

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
            <input v-model.number="formData.suhu_optimal" type="number" min="0" placeholder="20" />
          </div>

          <div class="form-group">
            <label>Kelembapan Optimal (%)</label>
            <input v-model.number="formData.kelembapan_optimal" type="number" min="0" placeholder="80" />
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
          <button type="button" class="text-link-btn" @click.prevent="openForm('edit', item)">Update &rarr;</button>
          <button type="button" class="icon-btn delete-mini" @click.prevent="deleteJenis(item.id_jenis)" title="Hapus">
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
  font-size: 20px; /* Sedikit dikecilkan agar tab lebih menonjol */
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