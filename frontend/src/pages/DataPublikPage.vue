<template>
  <div class="container">
    <div class="card" style="padding:18px">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:14px; flex-wrap:wrap">
        <div>
          <h1 style="margin:0; font-size:18px; font-weight:950">Data Publik Budidaya Jamur</h1>
          <p class="small" style="margin:6px 0 0">Ringkasan lokasi monitoring (akses publik).</p>
        </div>
        <div style="min-width: 260px">
          <div class="small" style="margin-bottom:6px"><b>🔍</b> Cari lokasi (contoh: Lombok Timur)</div>
          <input v-model="q" class="card" style="width:100%; padding:10px 12px; border-radius:12px; outline:none" placeholder="Cari: Sembalun / Narmada / Mataram" />
        </div>
      </div>
    </div>

    <div class="public-grid" style="margin-top:16px">
      <div v-for="l in filtered" :key="l.id_lokasi" class="card public-card">
        <div class="public-img" />
        <h3>📍 Lokasi: {{ l.nama_lokasi }}</h3>
        <div class="meta">Jumlah Rak: <b>{{ l.jumlah_rak }}</b></div>
        <div class="meta">Jenis Jamur: <b>{{ l.jenis_jamur }}</b></div>
        <RouterLink class="btn primary" style="margin-top:12px; width:100%" :to="`/data/${l.id_lokasi}`">Lihat Data</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getLokasiWithSummary } from '../services/mockDb'

const q = ref('')
const all = getLokasiWithSummary()

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return all
  return all.filter((x) => (x.nama_lokasi + ' ' + x.alamat).toLowerCase().includes(term))
})
</script>
