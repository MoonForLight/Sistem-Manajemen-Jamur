<template>
  <div class="admin-page">
    <header class="page-header">
      <div>
        <h1>Kelola Jenis Jamur</h1>
        <p class="page-description">Kelola jenis jamur yang tersedia untuk budidaya dan monitoring.</p>
      </div>
      <button class="btn primary">Tambah Jenis</button>
    </header>

    <div class="cards-grid">
      <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
      <div v-if="!jenisList.length && !loading && !errorMessage" class="error-banner">Belum ada data jenis jamur.</div>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jenisJamurService } from '../../services/dataService.js'

const jenisList = ref([])
const loading = ref(true)
const errorMessage = ref('')

async function loadJenisJamur() {
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
}

.jenis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.badge-muted {
  color: #92400e;
  background: #fef3c7;
}

.jenis-details p {
  margin: 8px 0;
  color: #4b5563;
  font-size: 14px;
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
