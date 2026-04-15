<template>
  <div class="petugas-page">
    <header class="page-header">
      <div>
        <h1>Laporan Monitoring</h1>
        <p class="page-description">Laporan pengamatan pertumbuhan yang telah Anda input.</p>
      </div>
      <button class="btn-primary" @click="openForm('create')">Buat Laporan</button>
    </header>

    <div v-if="showForm" class="form-card">
      <div class="form-head">
        <div>
          <h2>{{ formMode === 'create' ? 'Tambah Pengamatan' : 'Ubah Pengamatan' }}</h2>
          <p class="form-subtitle">Catat kondisi pertumbuhan agar monitoring petugas sesuai ERD.</p>
        </div>
        <button class="btn-outline" @click="closeForm">Tutup</button>
      </div>

      <form @submit.prevent="saveReport">
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
            Tanggal Pengamatan
            <input v-model="formData.tanggal_pengamatan" type="date" required />
          </label>
          <label>
            Fase
            <input v-model="formData.fase" type="text" placeholder="Fase pertumbuhan" />
          </label>
          <label>
            Suhu (°C)
            <input v-model.number="formData.suhu" type="number" step="0.1" placeholder="Suhu" />
          </label>
          <label>
            Kelembapan (%)
            <input v-model.number="formData.kelembaban" type="number" step="0.1" placeholder="Kelembapan" />
          </label>
          <label>
            Intensitas Cahaya
            <input v-model.number="formData.intensitas_cahaya" type="number" step="0.1" placeholder="Intensitas cahaya" />
          </label>
          <label class="full-width">
            Catatan
            <textarea v-model="formData.catatan" rows="3" placeholder="Catatan tambahan"></textarea>
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ formMode === 'create' ? 'Simpan Pengamatan' : 'Perbarui Pengamatan' }}
          </button>
          <button type="button" class="btn-outline" @click="closeForm">Batal</button>
        </div>
        <div v-if="formError" class="status-message error">{{ formError }}</div>
        <div v-if="successMessage" class="status-message success">{{ successMessage }}</div>
      </form>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Total Pengamatan</span>
        <span class="stat-value">{{ growthRecords.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Budidaya Terkait</span>
        <span class="stat-value">{{ assignedBudidaya.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Laporan Hari Ini</span>
        <span class="stat-value">{{ todayReports }}</span>
      </div>
    </div>

    <div v-if="loading" class="status-message">Memuat laporan...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <div class="table-card" v-if="!loading && !error">
      <div class="table-header">
        <span>Budidaya</span>
        <span>Tanggal</span>
        <span>Fase</span>
        <span>Suhu</span>
        <span>Kelembapan</span>
        <span>Catatan</span>
        <span>Aksi</span>
      </div>

      <div v-if="growthRecords.length === 0" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Belum ada laporan pengamatan.</span>
      </div>

      <div v-for="item in growthRecords" :key="item.id_pertumbuhan" class="table-row">
        <span>{{ item.id_budidaya }}</span>
        <span>{{ formatDate(item.tanggal_pengamatan) }}</span>
        <span>{{ item.fase || '-' }}</span>
        <span>{{ item.suhu ?? '-' }}°C</span>
        <span>{{ item.kelembaban ?? '-' }}%</span>
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
import { usersService, budidayaService, pertumbuhanService } from '../../services/dataService.js'

const assignedBudidaya = ref([])
const growthRecords = ref([])
const showForm = ref(false)
const formMode = ref('create')
const editId = ref(null)
const formData = ref({
  id_budidaya: '',
  tanggal_pengamatan: '',
  fase: '',
  suhu: '',
  kelembaban: '',
  intensitas_cahaya: '',
  catatan: '',
})
const saving = ref(false)
const formError = ref('')
const successMessage = ref('')
const loading = ref(true)
const error = ref('')

const today = new Date().toISOString().slice(0, 10)

const todayReports = computed(() =>
  growthRecords.value.filter(record => record.tanggal_pengamatan?.startsWith(today)).length
)

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
    tanggal_pengamatan: '',
    fase: '',
    suhu: '',
    kelembaban: '',
    intensitas_cahaya: '',
    catatan: '',
  }
}

function openForm(mode, record = null) {
  resetForm()
  formMode.value = mode
  showForm.value = true
  if (mode === 'edit' && record) {
    editId.value = record.id_pertumbuhan
    formData.value = {
      id_budidaya: record.id_budidaya,
      tanggal_pengamatan: record.tanggal_pengamatan?.slice(0, 10) || '',
      fase: record.fase || '',
      suhu: record.suhu ?? '',
      kelembaban: record.kelembaban ?? '',
      intensitas_cahaya: record.intensitas_cahaya ?? '',
      catatan: record.catatan || '',
    }
  }
}

function closeForm() {
  showForm.value = false
  resetForm()
}

async function saveReport() {
  formError.value = ''
  successMessage.value = ''

  if (!formData.value.id_budidaya || !formData.value.tanggal_pengamatan) {
    formError.value = 'Pilih budidaya dan tanggal pengamatan terlebih dahulu.'
    return
  }

  saving.value = true
  try {
    if (formMode.value === 'create') {
      await pertumbuhanService.create({
        id_budidaya: formData.value.id_budidaya,
        tanggal_pengamatan: formData.value.tanggal_pengamatan,
        fase: formData.value.fase,
        suhu: formData.value.suhu,
        kelembaban: formData.value.kelembaban,
        intensitas_cahaya: formData.value.intensitas_cahaya,
        catatan: formData.value.catatan,
      })
      successMessage.value = 'Pengamatan berhasil disimpan.'
    } else if (editId.value) {
      await pertumbuhanService.update(editId.value, {
        id_budidaya: formData.value.id_budidaya,
        tanggal_pengamatan: formData.value.tanggal_pengamatan,
        fase: formData.value.fase,
        suhu: formData.value.suhu,
        kelembaban: formData.value.kelembaban,
        intensitas_cahaya: formData.value.intensitas_cahaya,
        catatan: formData.value.catatan,
      })
      successMessage.value = 'Pengamatan berhasil diperbarui.'
    }
    await loadReports()
    closeForm()
  } catch (err) {
    console.error(err)
    formError.value = err.message || 'Gagal menyimpan laporan.'
  } finally {
    saving.value = false
  }
}

async function loadReports() {
  try {
    const [meRes, budRes, growthRes] = await Promise.all([
      usersService.getMe(),
      budidayaService.getByPetugas(),
      pertumbuhanService.getAll(),
    ])

    if (!meRes?.success) {
      throw new Error('Gagal memuat profil petugas')
    }

    const userId = meRes.data.id_user
    if (budRes?.success) {
      assignedBudidaya.value = budRes.data
    }

    const assignedIds = new Set(assignedBudidaya.value.map(item => item.id_budidaya))

    if (growthRes?.success) {
      growthRecords.value = growthRes.data
        .filter(item => assignedIds.has(item.id_budidaya))
        .sort((a, b) => new Date(b.tanggal_pengamatan) - new Date(a.tanggal_pengamatan))
    }
  } catch (err) {
    console.error(err)
    error.value = 'Tidak dapat memuat laporan monitoring saat ini.'
  } finally {
    loading.value = false
  }
}

onMounted(loadReports)
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

.btn-primary {
  background: #16a34a;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
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
  grid-template-columns: 1fr 1.2fr 1fr 1fr 1fr 2fr 0.8fr;
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