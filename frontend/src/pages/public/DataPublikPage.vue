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
        <div class="public-img" />
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