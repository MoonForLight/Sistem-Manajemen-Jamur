<template>
  <div class="admin-page fade-in">
    <header class="page-header-modern">
      <div class="header-text">
        <h1>Kelola Budidaya (Rumah Jamur)</h1>
        <p class="subtitle">Buat dan delegasikan tugas budidaya ke petugas di setiap lokasi.</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Cari ID, Lokasi, atau Petugas..." class="modern-input" />
        </div>
        <button type="button" class="btn-outline" @click.prevent="refreshData">
          <svg viewBox="0 0 24 24" width="16" height="16" class="mr-2"><path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Muat Ulang
        </button>
      </div>
    </header>

    <!-- Modal Form Dihapus (Kini read-only) -->

    <!-- Table content -->
    <div class="table-card">
      <div class="table-header budidaya-grid">
        <span>ID</span>
        <span>Lokasi</span>
        <span>Jenis Jamur</span>
        <span>Rak</span>
        <span>Petugas</span>
        <span>Status</span>
      </div>

      <div class="table-body">
        <div v-if="loading" class="empty-state">Memuat data budidaya...</div>
        <div v-else-if="!loading && !filteredBudidayaList.length" class="empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" class="text-muted mb-4 mx-auto block"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
          <p>Belum ada data budidaya yang cocok.</p>
        </div>

        <div v-for="item in filteredBudidayaList" :key="item.id_budidaya" class="table-row budidaya-grid">
          <span class="id-col">BDY-{{ item.id_budidaya?.toString().padStart(3, '0') || '000' }}</span>
          <span class="fw-bold">{{ item.nama_lokasi }}</span>
          <span>{{ item.nama_jamur }}</span>
          <span class="fw-bold">{{ item.jumlah_rak || 1 }} Rak</span>
          <span class="petugas-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" class="mr-1"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            {{ item.nama_petugas }}
          </span>
          <span>
            <span :class="['status-pill', item.status]">
              {{ item.status || 'Aktif' }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import eventBus from '../../services/eventBus.js'
import { budidayaService, lokasiService, jenisJamurService, mediaTanamService, usersService } from '../../services/dataService.js'

const budidayaList = ref([])
const loading = ref(false)
const searchQuery = ref('')

const filteredBudidayaList = computed(() => {
  if (!searchQuery.value) return budidayaList.value
  const q = searchQuery.value.toLowerCase()
  return budidayaList.value.filter(item => 
    (item.nama_lokasi && item.nama_lokasi.toLowerCase().includes(q)) ||
    (item.nama_jamur && item.nama_jamur.toLowerCase().includes(q)) ||
    (item.nama_petugas && item.nama_petugas.toLowerCase().includes(q)) ||
    (`bdy-${item.id_budidaya}`.includes(q))
  )
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

async function refreshData() {
  await loadBudidaya()
}

const refreshListener = async () => {
  await loadBudidaya()
}

onMounted(async () => {
  await loadBudidaya()
  eventBus.on('refreshBudidayaData', refreshListener)
})

onUnmounted(() => {
  eventBus.off('refreshBudidayaData', refreshListener)
})
</script>

<style scoped>
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-text h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.modern-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.search-box .modern-input {
  padding-left: 38px;
  width: 260px;
}

.modern-input:focus, .modern-select:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.modern-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  font-family: inherit;
  cursor: pointer;
}
.modern-select:disabled { background-color: #f3f4f6; cursor: not-allowed; }

.btn-primary {
  display: inline-flex;
  align-items: center;
  background: #16a34a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(22,163,74,0.2); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-outline {
  display: inline-flex;
  align-items: center;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { background: #f9fafb; color: #111827; }

.btn-cancel {
  background: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-cancel:hover { background: #f3f4f6; }

.mr-1 { margin-right: 4px; }
.mr-2 { margin-right: 8px; }
.mt-1 { margin-top: 4px; }
.text-danger { color: #dc2626; }
.text-muted { color: #6b7280; font-size: 12px; }
.text-center { text-align: center; }

/* Table Styles */
.table-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

.budidaya-grid {
  display: grid;
  grid-template-columns: 90px 1.5fr 1.2fr 100px 1.5fr 100px;
  gap: 16px;
  align-items: center;
  padding: 16px 24px;
  font-size: 14px;
}

.table-header {
  background: #f9fafb;
  font-weight: 700;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
  color: #111827;
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: #f9fafb; }

.empty-state { padding: 48px 24px; text-align: center; color: #6b7280; }
.mx-auto { margin-left: auto; margin-right: auto; }
.block { display: block; }
.mb-4 { margin-bottom: 16px; }

.id-col { font-weight: 700; color: #374151; font-size: 13px; }
.fw-bold { font-weight: 600; }
.petugas-badge { display: inline-flex; align-items: center; background: #f3f4f6; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #4b5563; }

.status-pill {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}
.status-pill.aktif { background: #dcfce7; color: #166534; }
.status-pill.inisiasi { background: #fef3c7; color: #b45309; }
.status-pill.selesai { background: #f3f4f6; color: #4b5563; }


</style>