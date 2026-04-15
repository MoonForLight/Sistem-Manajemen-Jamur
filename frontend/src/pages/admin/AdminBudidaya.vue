<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Budidaya</h1>
        <p class="page-description">Buat dan pantau sesi budidaya jamur untuk setiap lokasi.</p>
      </div>
      <div class="page-actions">
        <button type="button" class="btn outline" @click.prevent="refreshData">Muat Ulang</button>
        <button type="button" class="btn primary" @click.prevent="openForm('create')">Tambah Budidaya</button>
      </div>
    </header>

    <div v-if="showForm" class="form-card">
      <h3>{{ formMode === 'create' ? 'Tambah Budidaya' : 'Ubah Budidaya' }}</h3>
      <form @submit.prevent="saveBudidaya">
        <label>
          Lokasi
          <select v-model.number="formData.id_lokasi" required>
            <option value="" disabled>Pilih lokasi</option>
            <option v-for="lokasi in lokasiOptions" :key="lokasi.id_lokasi" :value="lokasi.id_lokasi">
              {{ lokasi.nama_lokasi }}
            </option>
          </select>
        </label>

        <label>
          Jenis Jamur
          <select v-model.number="formData.id_jenis" required>
            <option value="" disabled>Pilih jenis jamur</option>
            <option v-for="jenis in jenisOptions" :key="jenis.id_jenis" :value="jenis.id_jenis">
              {{ jenis.nama_jamur }}
            </option>
          </select>
        </label>

        <label>
          Media Tanam
          <select v-model.number="formData.id_media" required>
            <option value="" disabled>Pilih media</option>
            <option v-for="media in mediaOptions" :key="media.id_media" :value="media.id_media">
              {{ media.nama_media }}
            </option>
          </select>
        </label>

        <label>
          Petugas
          <select v-model.number="formData.id_petugas" required>
            <option value="" disabled>Pilih petugas</option>
            <option v-for="petugas in petugasOptions" :key="petugas.id_user" :value="petugas.id_user">
              {{ petugas.nama }} - {{ petugas.nama_lokasi || 'Lokasi belum dipilih' }}
            </option>
          </select>
        </label>

        <label>
          Tanggal Mulai
          <input v-model="formData.tanggal_mulai" type="date" required />
        </label>

        <label>
          Status
          <select v-model="formData.status" required>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
            <option value="pending">Pending</option>
          </select>
        </label>

        <div class="form-actions">
          <button type="submit" class="btn primary">Simpan</button>
          <button type="button" class="btn outline" @click="closeForm">Batal</button>
        </div>
      </form>
    </div>

    <div class="table-card">
      <div class="table-header">
        <span>ID Budidaya</span>
        <span>Lokasi</span>
        <span>Jenis</span>
        <span>Media</span>
        <span>Petugas</span>
        <span>Status</span>
        <span>Aksi</span>
      </div>

      <div v-if="loading" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Memuat data budidaya...</span>
      </div>
      <div v-if="!loading && !budidayaList.length" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Belum ada data budidaya.</span>
      </div>
      <div v-for="item in budidayaList" :key="item.id_budidaya" class="table-row">
        <span>{{ item.id_budidaya }}</span>
        <span>{{ item.nama_lokasi }}</span>
        <span>{{ item.nama_jamur }}</span>
        <span>{{ item.nama_media }}</span>
        <span>{{ item.nama_petugas }}</span>
        <span>
          <span :class="['status-chip', item.status === 'aktif' ? 'active' : item.status === 'selesai' ? 'inactive' : 'pending']">
            {{ item.status || 'Tidak diketahui' }}
          </span>
        </span>
        <span class="actions">
          <button type="button" class="btn small" @click.prevent="openForm('edit', item)">Edit</button>
          <button type="button" class="btn small outline" @click.prevent="deleteBudidaya(item.id_budidaya)">Hapus</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import eventBus from '../../services/eventBus.js'
import { budidayaService, lokasiService, jenisJamurService, mediaTanamService, usersService } from '../../services/dataService.js'

const budidayaList = ref([])
const lokasiOptions = ref([])
const jenisOptions = ref([])
const mediaOptions = ref([])
const petugasOptions = ref([])
const loading = ref(false)
const showForm = ref(false)
const formMode = ref('create')
const editId = ref(null)
const formData = ref({
  id_lokasi: '',
  id_jenis: '',
  id_media: '',
  id_petugas: '',
  tanggal_mulai: '',
  status: 'aktif',
})

async function loadBudidaya() {
  loading.value = true
  try {
    const response = await budidayaService.getAll()
    if (response?.success) {
      budidayaList.value = response.data
    }
  } catch (error) {
    console.error('Error load budidaya:', error)
  } finally {
    loading.value = false
  }
}

async function loadOptions() {
  try {
    const [lokasi, jenis, media, petugas] = await Promise.all([
      lokasiService.getAll(),
      jenisJamurService.getAll(),
      mediaTanamService.getAll(),
      usersService.getPetugasList(),
    ])

    lokasiOptions.value = lokasi?.success ? lokasi.data : []
    jenisOptions.value = jenis?.success ? jenis.data : []
    mediaOptions.value = media?.success ? media.data : []
    petugasOptions.value = petugas?.success ? petugas.data : []
  } catch (error) {
    console.error('Error load options for budidaya:', error)
  }
}

async function refreshData() {
  await Promise.all([loadOptions(), loadBudidaya()])
}

async function openForm(mode, item = null) {
  await loadOptions()
  formMode.value = mode
  showForm.value = true
  if (mode === 'edit' && item) {
    editId.value = item.id_budidaya
    formData.value = {
      id_lokasi: item.id_lokasi || '',
      id_jenis: item.id_jenis || '',
      id_media: item.id_media || '',
      id_petugas: item.id_petugas || '',
      tanggal_mulai: item.tanggal_mulai || '',
      status: item.status || 'aktif',
    }
  } else {
    editId.value = null
    formData.value = {
      id_lokasi: '',
      id_jenis: '',
      id_media: '',
      id_petugas: '',
      tanggal_mulai: '',
      status: 'aktif',
    }
  }
}

function closeForm() {
  showForm.value = false
  editId.value = null
}

async function saveBudidaya() {
  try {
    const payload = { ...formData.value }
    if (formMode.value === 'create') {
      await budidayaService.create(payload)
    } else if (editId.value) {
      await budidayaService.update(editId.value, payload)
    }

    await loadBudidaya()
    closeForm()
  } catch (error) {
    console.error('Error simpan budidaya:', error)
    alert(error.message || 'Gagal menyimpan data budidaya.')
  }
}

async function deleteBudidaya(id) {
  if (!confirm('Hapus budidaya ini?')) return
  try {
    await budidayaService.delete(id)
    await loadBudidaya()
  } catch (error) {
    console.error('Error hapus budidaya:', error)
    alert(error.message || 'Gagal menghapus data budidaya.')
  }
}

const refreshListener = async () => {
  await Promise.all([loadOptions(), loadBudidaya()])
}

onMounted(async () => {
  await Promise.all([loadOptions(), loadBudidaya()])
  eventBus.on('refreshBudidayaData', refreshListener)
})

onUnmounted(() => {
  eventBus.off('refreshBudidayaData', refreshListener)
})
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

..page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #111827;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
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
select {
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

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 0.9fr 1.2fr 1.2fr 1.2fr 1.2fr 1fr 1fr;
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

.status-chip {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.status-chip.active {
  background: #dcfce7;
  color: #166534;
}

.status-chip.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-chip.pending {
  background: #fef3c7;
  color: #92400e;
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