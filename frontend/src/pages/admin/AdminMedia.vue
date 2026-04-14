<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Media Tanam</h1>
        <p class="page-description">Simpan dan perbarui pilihan media tanam untuk setiap jenis budidaya.</p>
      </div>
      <button class="btn primary">Tambah Media</button>
    </header>

    <div class="table-card">
      <div class="table-header">
        <span>Nama Media</span>
        <span>Kadar Air</span>
        <span>Catatan</span>
        <span>Aksi</span>
      </div>
      <div v-if="errorMessage" class="table-row">
        <span style="grid-column: 1 / -1">{{ errorMessage }}</span>
      </div>
      <div v-if="!mediaList.length && !loading && !errorMessage" class="table-row">
        <span style="grid-column: 1 / -1">Belum ada data media tanam.</span>
      </div>
      <div v-for="item in mediaList" :key="item.id_media" class="table-row">
        <span>{{ item.nama_media }}</span>
        <span>{{ item.kadar_air_optimal ?? '-' }}%</span>
        <span>{{ item.catatan || '-' }}</span>
        <span class="actions">
          <button class="btn small">Edit</button>
          <button class="btn small outline">Hapus</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mediaTanamService } from '../../services/dataService.js'

const mediaList = ref([])
const loading = ref(true)
const errorMessage = ref('')

async function loadMedia() {
  try {
    const response = await mediaTanamService.getAll()
    if (response?.success) {
      mediaList.value = response.data
    } else {
      errorMessage.value = 'Gagal memuat data media tanam.'
    }
  } catch (error) {
    console.error('Error load media tanam:', error)
    errorMessage.value = 'Terjadi kesalahan saat mengambil data media tanam.'
  } finally {
    loading.value = false
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

.table-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
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

.actions {
  display: flex;
  gap: 8px;
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

.btn.small.outline {
  background: transparent;
  color: #111827;
  border: 1px solid #d1d5db;
}
</style>
