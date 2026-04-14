<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Petugas</h1>
        <p class="page-description">Kelola akun petugas dan hak akses untuk monitoring lokasi.</p>
      </div>
      <button class="btn primary">Tambah Petugas</button>
    </header>

    <div class="table-card">
      <div class="table-header">
        <span>Nama</span>
        <span>Username</span>
        <span>Lokasi</span>
        <span>Status</span>
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
      </div>
      <div v-if="!petugasList.length && !loading" class="table-row">
        <span style="grid-column: 1 / -1">Belum ada data petugas.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usersService } from '../../services/dataService.js'

const petugasList = ref([])
const loading = ref(true)
const errorMessage = ref('')

async function loadPetugas() {
  try {
    const response = await usersService.getPetugasList()
    if (response?.success) {
      petugasList.value = response.data
    } else {
      errorMessage.value = 'Gagal memuat daftar petugas.'
    }
  } catch (error) {
    console.error('Error load petugas:', error)
    errorMessage.value = 'Terjadi kesalahan saat mengambil data petugas.'
  } finally {
    loading.value = false
  }
}

onMounted(loadPetugas)
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

.table-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr;
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
</style>
