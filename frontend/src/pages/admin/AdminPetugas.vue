<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Petugas</h1>
        <p class="page-description">Kelola akun petugas dan hak akses untuk monitoring lokasi.</p>
      </div>
      <button type="button" class="btn primary" @click.prevent="openForm('create')">Tambah Petugas</button>
    </header>

    <div v-if="showForm" class="form-card">
      <h3>{{ formMode === 'create' ? 'Tambah Petugas' : 'Ubah Petugas' }}</h3>
      <form @submit.prevent="savePetugas">
        <label>
          Nama
          <input v-model="formData.nama" type="text" placeholder="Nama petugas" required />
        </label>

        <label>
          Username
          <input v-model="formData.username" type="text" placeholder="Username" required />
        </label>

        <label v-if="formMode === 'create'">
          Password
          <input v-model="formData.password" type="password" placeholder="Password" required />
        </label>

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
          Status
          <select v-model="formData.status" required>
            <option value="aktif">Aktif</option>
            <option value="non-aktif">Non-aktif</option>
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
        <span>Nama</span>
        <span>Username</span>
        <span>Lokasi</span>
        <span>Status</span>
        <span>Aksi</span>
      </div>

      <div v-if="loading" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Memuat data petugas...</span>
      </div>
      <div v-if="!loading && !petugasList.length" class="table-row empty-row">
        <span style="grid-column: 1 / -1">Belum ada data petugas.</span>
      </div>
      <div v-for="user in petugasList" :key="user.id_user" class="table-row">
        <span>{{ user.nama }}</span>
        <span>{{ user.username }}</span>
        <span>{{ user.nama_lokasi || '-' }}</span>
        <span>
          <span :class="['status-chip', user.status === 'aktif' ? 'active' : 'inactive']">
            {{ user.status || 'Tidak diketahui' }}
          </span>
        </span>
        <span class="actions">
          <button type="button" class="btn small" @click.prevent="openForm('edit', user)">Edit</button>
          <button type="button" class="btn small outline" @click.prevent="deletePetugas(user.id_user)">Hapus</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import eventBus from '../../services/eventBus.js'
import { usersService, lokasiService } from '../../services/dataService.js'

const petugasList = ref([])
const lokasiOptions = ref([])
const loading = ref(false)
const showForm = ref(false)
const formMode = ref('create')
const editId = ref(null)
const formData = ref({ nama: '', username: '', password: '', id_lokasi: '', status: 'aktif' })

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
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
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