<template>
  <div class="container">
    <div class="card" style="padding:16px">
      <h1 style="margin:0; font-size:16px; font-weight:950">Data Publik Budidaya Jamur</h1>
      <p class="small" style="margin:6px 0 12px">Ringkasan lokasi monitoring (akses publik).</p>
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
        <div style="flex:1; min-width:200px">
          <div class="small" style="margin-bottom:6px"><b>🔍</b> Cari lokasi</div>
          <input v-model="q" class="card" style="width:100%; padding:10px 12px; border-radius:12px; outline:none; border:1px solid var(--border)" placeholder="Cari: Sembalun / Narmada" />
        </div>
      </div>
    </div>

    <div class="public-grid" style="margin-top:16px">
      <div v-for="l in filtered" :key="l.id_lokasi" class="card public-card">
        <div class="public-img">
          <img
            v-if="l.foto_lokasi"
            :src="`http://localhost:3000/uploads/${l.foto_lokasi}`"
            :alt="`Foto ${l.nama_lokasi}`"
          />
          <div v-else class="public-img-placeholder">Foto lokasi tidak tersedia</div>
        </div>
        <h3>📍 {{ l.nama_lokasi }}</h3>
        <div class="meta">Rak: <b>{{ l.jumlah_rak }}</b></div>
        <div class="meta">Jenis: <b>{{ l.jenis_jamur }}</b></div>
        <RouterLink class="btn primary" style="margin-top:12px; width:100%" :to="`/data/${l.id_lokasi}`">Lihat Detail</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { lokasiService } from '../../services/dataService.js'

const q = ref('')
const locations = ref([])

const fetchLocations = async () => {
  try {
    const response = await lokasiService.getAll()
    if (Array.isArray(response?.data)) {
      locations.value = response.data
    } else if (Array.isArray(response)) {
      locations.value = response
    } else {
      locations.value = []
      console.warn('Unexpected lokasi response shape:', response)
    }
  } catch (error) {
    console.error('Gagal mengambil data lokasi:', error)
    locations.value = []
  }
}

onMounted(fetchLocations)

const filtered = computed(() => {
  if (!Array.isArray(locations.value)) {
    return []
  }

  return locations.value.filter(l => 
    String(l.nama_lokasi || '').toLowerCase().includes(q.value.toLowerCase())
  )
})
</script>

<style scoped>
.public-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.public-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.public-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.public-img {
  width: 100%;
  height: 180px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.public-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.public-img-placeholder {
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
  padding: 16px;
  line-height: 1.4;
}

.public-card h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  padding: 16px 16px 8px 16px;
}

.meta {
  font-size: 13px;
  color: #6b7280;
  padding: 0 16px 8px 16px;
  margin: 0;
}

.btn {
  background: #16a34a;
  color: white;
  border: none;
  padding: 12px 16px;
  margin: 12px 16px 16px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  width: auto;
  flex: 1;
}

.btn:hover {
  background: #15803d;
}

.btn.primary {
  background: #16a34a;
}
</style>