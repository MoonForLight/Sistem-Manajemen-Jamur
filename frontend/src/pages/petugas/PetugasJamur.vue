<template>
  <div class="petugas-page">
    <header class="page-header">
      <div>
        <h1>Referensi Jenis Jamur</h1>
        <p class="page-description">Informasi jenis jamur dan kondisi optimal untuk monitoring di lapangan.</p>
      </div>
    </header>

    <div v-if="loading" class="status-message">Memuat data...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <div class="cards-grid" v-if="!loading && !error">
      <div v-if="jenisList.length === 0" class="status-message">Belum ada data jenis jamur.</div>
      <div v-for="item in jenisList" :key="item.id_jenis" class="jenis-card">
        <div class="jenis-header">
          <span class="jenis-title">{{ item.nama_jamur }}</span>
          <span class="badge">Petugas</span>
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
const error = ref('')

async function loadJenisJamur() {
  try {
    const response = await jenisJamurService.getAll()
    if (response?.success) {
      jenisList.value = response.data
    } else {
      error.value = 'Gagal memuat data jenis jamur.'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Terjadi kesalahan saat memuat jenis jamur.'
  } finally {
    loading.value = false
  }
}

onMounted(loadJenisJamur)
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
  background: #e5f7ff;
  color: #0b5e81;
  font-size: 12px;
  font-weight: 700;
}

.jenis-details p {
  margin: 10px 0 0;
  color: #4b5563;
  font-size: 14px;
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
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>