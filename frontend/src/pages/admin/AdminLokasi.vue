<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Lokasi Budidaya</h1>
        <p class="page-description">Lihat, edit, dan kelola data lokasi budidaya jamur.</p>
      </div>
      <button class="btn primary">Tambah Lokasi Baru</button>
    </header>

    <div class="table-card">
      <div class="table-header">
        <span>Nama Lokasi</span>
        <span>Alamat</span>
        <span>Jumlah Rak</span>
        <span>Keterangan</span>
      </div>
      <div v-for="item in lokasiList" :key="item.id_lokasi" class="table-row">
        <span>{{ item.nama_lokasi }}</span>
        <span>{{ item.alamat || '-' }}</span>
        <span>{{ item.jumlah_rak }}</span>
        <span>{{ item.keterangan || '-' }}</span>
      </div>
      <div v-if="!lokasiList.length && !loading" class="table-row">
        <span style="grid-column: 1 / -1">Belum ada data lokasi budidaya.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { lokasiService } from '../../services/dataService.js'

const lokasiList = ref([])
const loading = ref(true)
const errorMessage = ref('')

async function loadLokasi() {
  try {
    const response = await lokasiService.getAll()
    if (response?.success) {
      lokasiList.value = response.data
    } else {
      errorMessage.value = 'Gagal memuat lokasi budidaya.'
    }
  } catch (error) {
    console.error('Error load lokasi:', error)
    errorMessage.value = 'Terjadi kesalahan saat mengambil data lokasi.'
  } finally {
    loading.value = false
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

.table-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
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
