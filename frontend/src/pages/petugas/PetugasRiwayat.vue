<template>
  <div class="petugas-page">
    <header class="page-header">
      <div>
        <h1>Riwayat Panen</h1>
        <p class="page-description">Lihat catatan panen dan hasil yang telah Anda laporkan.</p>
      </div>
      <button class="btn-primary" @click="openForm('create')">Tambah Panen</button>
    </header>

    <div v-if="showForm" class="form-card">
      <div class="form-head">
        <div>
          <h2>{{ formMode === 'create' ? 'Tambah Panen' : 'Ubah Panen' }}</h2>
          <p class="form-subtitle">Catat hasil panen sesuai data budidaya Anda.</p>
        </div>
        <button class="btn-outline" @click="closeForm">Tutup</button>
      </div>

      <form @submit.prevent="saveHarvest">
        <div class="form-grid">
          <label>
            Budidaya
            <select v-model.number="formData.id_budidaya" required>
              <option value="" disabled>Pilih budidaya</option>
              <option v-for="item in assignedBudidaya" :key="item.id_budidaya" :value="item.id_budidaya">
                {{ item.id_budidaya }} - {{ item.nama_lokasi }} / {{ item.nama_jamur }}
              </option>
            </select>
          </label>
          <label>
            Tanggal Panen
            <input v-model="formData.tanggal_panen" type="date" required />
          </label>
          <label>
            Jumlah Panen (kg)
            <input v-model.number="formData.jumlah_panen" type="number" step="0.1" required />
          </label>
          <label class="full-width">
            Catatan
            <textarea v-model="formData.catatan" rows="3" placeholder="Catatan tambahan"></textarea>
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ formMode === 'create' ? 'Simpan Panen' : 'Perbarui Panen' }}
          </button>
          <button type="button" class="btn-outline" @click="closeForm">Batal</button>
        </div>
        <div v-if="formError" class="status-message error">{{ formError }}</div>
        <div v-if="successMessage" class="status-message success">{{ successMessage }}</div>
      </form>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Total Panen</span>
        <span class="stat-value">{{ harvestRecords.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Budidaya Selesai</span>
        <span class="stat-value">{{ completedBudidaya }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Jumlah Kilogram</span>
        <span class="stat-value">{{ totalHarvestKg }}</span>
      </div>
    </div>

    <div v-if="loading" class="status-message">Memuat riwayat...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <div class="table-card" v-if="!loading && !error">
      <div class="table-header">
        <span>Budidaya</span>
        <span>Tanggal Panen</span>
        <span>Jumlah Panen</span>
        <span>Catatan</span>
        <span>Aksi</span>
      </div>

      <div v-if="harvestRecords.length === 0" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Belum ada riwayat panen.</span>
      </div>

      <div v-for="item in harvestRecords" :key="item.id_panen" class="table-row">
        <span>{{ item.id_budidaya }}</span>
        <span>{{ formatDate(item.tanggal_panen) }}</span>
        <span>{{ item.jumlah_panen ?? '-' }} kg</span>
        <span>{{ item.catatan || '-' }}</span>
        <span>
          <button type="button" class="btn-outline small" @click="openForm('edit', item)">Edit</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usersService, budidayaService, panenService } from '../../services/dataService.js'

const assignedBudidaya = ref([])
const harvestRecords = ref([])
const showForm = ref(false)
const formMode = ref('create')
const editId = ref(null)
const formData = ref({
  id_budidaya: '',
  tanggal_panen: '',
  jumlah_panen: '',
  catatan: '',
})
const saving = ref(false)
const formError = ref('')
const successMessage = ref('')
const loading = ref(true)
const error = ref('')

const completedBudidaya = computed(() => assignedBudidaya.value.filter(item => item.status === 'selesai').length)
const totalHarvestKg = computed(() => harvestRecords.value.reduce((sum, item) => sum + (item.jumlah_panen ?? 0), 0))

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function resetForm() {
  editId.value = null
  formMode.value = 'create'
  formError.value = ''
  successMessage.value = ''
  formData.value = {
    id_budidaya: '',
    tanggal_panen: '',
    jumlah_panen: '',
    catatan: '',
  }
}

function openForm(mode, record = null) {
  resetForm()
  formMode.value = mode
  showForm.value = true
  if (mode === 'edit' && record) {
    editId.value = record.id_panen
    formData.value = {
      id_budidaya: record.id_budidaya,
      tanggal_panen: record.tanggal_panen?.slice(0, 10) || '',
      jumlah_panen: record.jumlah_panen ?? '',
      catatan: record.catatan || '',
    }
  }
}

function closeForm() {
  showForm.value = false
  resetForm()
}

async function saveHarvest() {
  formError.value = ''
  successMessage.value = ''

  if (!formData.value.id_budidaya || !formData.value.tanggal_panen || formData.value.jumlah_panen === '' ) {
    formError.value = 'Lengkapi semua data panen sebelum menyimpan.'
    return
  }

  saving.value = true
  try {
    if (formMode.value === 'create') {
      await panenService.create({
        id_budidaya: formData.value.id_budidaya,
        tanggal_panen: formData.value.tanggal_panen,
        jumlah_panen: formData.value.jumlah_panen,
        catatan: formData.value.catatan,
      })
      successMessage.value = 'Data panen berhasil disimpan.'
    } else if (editId.value) {
      await panenService.update(editId.value, {
        id_budidaya: formData.value.id_budidaya,
        tanggal_panen: formData.value.tanggal_panen,
        jumlah_panen: formData.value.jumlah_panen,
        catatan: formData.value.catatan,
      })
      successMessage.value = 'Data panen berhasil diperbarui.'
    }
    await loadRiwayat()
    closeForm()
  } catch (err) {
    console.error(err)
    formError.value = err.message || 'Gagal menyimpan data panen.'
  } finally {
    saving.value = false
  }
}

async function loadRiwayat() {
  try {
    const [meRes, budRes, panenRes] = await Promise.all([
      usersService.getMe(),
      budidayaService.getByPetugas(),
      panenService.getAll(),
    ])

    if (!meRes?.success) {
      throw new Error('Gagal memuat profil petugas')
    }

    const userId = meRes.data.id_user
    if (budRes?.success) {
      assignedBudidaya.value = budRes.data
    }

    if (panenRes?.success) {
      harvestRecords.value = panenRes.data
        .filter(item => item.id_petugas === userId)
        .sort((a, b) => new Date(b.tanggal_panen) - new Date(a.tanggal_panen))
    }
  } catch (err) {
    console.error(err)
    error.value = 'Tidak dapat memuat riwayat panen saat ini.'
  } finally {
    loading.value = false
  }
}

onMounted(loadRiwayat)
</script>

<style scoped>
.petugas-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #eef2ff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 10px;
  font-weight: 600;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
}

.table-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.form-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  margin-bottom: 24px;
}

.form-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.form-subtitle {
  margin: 8px 0 0;
  color: #6b7280;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
}

.full-width {
  grid-column: span 3;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.btn-outline {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
}

.btn-outline.small {
  padding: 8px 12px;
  font-size: 13px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr 2fr 0.8fr;
  font-weight: 700;
  color: #374151;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
}

.table-row.empty-row {
  border-bottom: none;
}

.table-row:last-child {
  border-bottom: none;
}

.status-message {
  padding: 16px;
  border-radius: 14px;
  background: #f9fafb;
  color: #374151;
}

.status-message.error {
  background: #fef2f2;
  color: #991b1b;
}

@media(max-width: 1024px) {
  .stats-row,
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }
}
</style>