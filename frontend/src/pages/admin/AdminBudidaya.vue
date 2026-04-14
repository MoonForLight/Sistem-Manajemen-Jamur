<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Budidaya</h1>
        <p class="page-description">Buat dan pantau sesi budidaya jamur untuk setiap lokasi.</p>
      </div>
      <button class="btn primary">Tambah Budidaya</button>
    </header>

    <div class="table-card">
      <div class="table-header">
        <span>ID Budidaya</span>
        <span>Lokasi</span>
        <span>Jenis</span>
        <span>Media</span>
        <span>Petugas</span>
        <span>Status</span>
      </div>
      <div v-for="item in budidayaList" :key="item.id_budidaya" class="table-row">
        <span>{{ item.id_budidaya }}</span>
        <span>{{ item.nama_lokasi }}</span>
        <span>{{ item.nama_jamur }}</span>
        <span>{{ item.nama_media }}</span>
        <span>{{ item.nama_petugas }}</span>
        <span>
          <span :class="['status-chip', item.status === 'aktif' ? 'active' : 'inactive']">
            {{ item.status || 'Tidak diketahui' }}
          </span>
        </span>
      </div>
      <div v-if="!budidayaList.length && !loading" class="table-row">
        <span style="grid-column: 1 / -1">Belum ada data budidaya.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { budidayaService } from '../../services/dataService.js'

const budidayaList = ref([])
const loading = ref(true)
const errorMessage = ref('')

async function loadBudidaya() {
  try {
    const response = await budidayaService.getAll()
    if (response?.success) {
      budidayaList.value = response.data
    } else {
      errorMessage.value = 'Gagal memuat daftar budidaya.'
    }
  } catch (error) {
    console.error('Error load budidaya:', error)
    errorMessage.value = 'Terjadi kesalahan saat mengambil data budidaya.'
  } finally {
    loading.value = false
  }
}

onMounted(loadBudidaya)
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
  grid-template-columns: 1.4fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr;
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
</style>
