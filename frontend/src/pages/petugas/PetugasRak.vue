<template>
  <div class="rack-page">
    <header class="page-header">
      <div>
        <h1>Rak & Jenis Jamur</h1>
      </div>
      <div class="filters">
        <select v-model="statusFilter" class="control" @change="loadFiltered">
          <option value="aktif,inisiasi">Aktif & Inisiasi</option>
          <option value="aktif">Aktif</option>
          <option value="inisiasi">Inisiasi</option>
          <option value="selesai">Selesai</option>
        </select>
        <select v-model="jenisFilter" class="control" @change="loadFiltered">
          <option value="">Semua jenis</option>
          <option v-for="jenis in jenisOptions" :key="jenis.id_jenis" :value="jenis.id_jenis">
            {{ jenis.nama_jamur }}
          </option>
        </select>
        <input v-model.trim="search" class="control" placeholder="Cari ID, lokasi, jenis..." @keyup.enter="loadFiltered" />
        <button class="btn" @click="loadFiltered">Terapkan</button>
      </div>
    </header>

    <div v-if="loading" class="empty">Memuat daftar rak...</div>
    <div v-else-if="groups.length === 0" class="empty">Tidak ada rak yang sesuai dengan filter.</div>

    <section v-for="group in groups" :key="group.id_jenis" class="type-section">
      <div class="type-heading">
        <div>
          <h2>{{ group.nama_jamur }}</h2>
          <span>{{ group.racks.length }} rak dari {{ group.budidayaCount }} siklus</span>
        </div>
      </div>

      <div class="rack-grid">
        <article v-for="rack in group.racks" :key="rack.key" class="rack-card">
          <div class="rack-top">
            <span class="rack-number">Rak {{ rack.nomor_rak }}</span>
            <span :class="['status', rack.status]">{{ rack.status }}</span>
          </div>
          <h3>BDY-{{ String(rack.id_budidaya).padStart(3, '0') }}</h3>
          <dl>
            <div><dt>Lokasi</dt><dd>{{ rack.nama_lokasi }}</dd></div>
            <div><dt>Media</dt><dd>{{ rack.nama_media }}</dd></div>
            <div><dt>Mulai</dt><dd>{{ formatDate(rack.tanggal_mulai) }}</dd></div>
          </dl>
          <button
            class="manage-btn"
            :disabled="rack.status === 'selesai'"
            @click="openRack(rack)"
          >
            {{ rack.status === 'selesai' ? 'Siklus selesai' : 'Kelola rak ini' }}
          </button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { budidayaService } from '../../services/dataService.js'

const router = useRouter()
const loading = ref(false)
const records = ref([])
const jenisOptions = ref([])
const statusFilter = ref('aktif,inisiasi')
const jenisFilter = ref('')
const search = ref('')

const virtualRacks = computed(() => records.value.flatMap((budidaya) => {
  const total = Math.max(1, Number(budidaya.jumlah_rak) || 1)
  return Array.from({ length: total }, (_, index) => ({
    ...budidaya,
    nomor_rak: index + 1,
    key: `${budidaya.id_budidaya}-${index + 1}`
  }))
}))

const groups = computed(() => {
  const map = new Map()
  virtualRacks.value.forEach((rack) => {
    const key = String(rack.id_jenis)
    if (!map.has(key)) {
      map.set(key, {
        id_jenis: rack.id_jenis,
        nama_jamur: rack.nama_jamur,
        racks: [],
        budidayaIds: new Set()
      })
    }
    const group = map.get(key)
    group.racks.push(rack)
    group.budidayaIds.add(rack.id_budidaya)
  })
  return Array.from(map.values()).map((group) => ({
    ...group,
    budidayaCount: group.budidayaIds.size
  }))
})

async function loadOptions() {
  const res = await budidayaService.getByPetugas()
  const unique = new Map()
  ;(res?.data || []).forEach((item) => unique.set(String(item.id_jenis), {
    id_jenis: item.id_jenis,
    nama_jamur: item.nama_jamur
  }))
  jenisOptions.value = Array.from(unique.values()).sort((a, b) => a.nama_jamur.localeCompare(b.nama_jamur))
}

async function loadFiltered() {
  loading.value = true
  try {
    const res = await budidayaService.getByPetugas({
      status: statusFilter.value,
      id_jenis: jenisFilter.value,
      q: search.value
    })
    records.value = res?.data || []
  } finally {
    loading.value = false
  }
}

function openRack(rack) {
  router.push({
    name: 'petugas-jamur',
    query: { budidaya: rack.id_budidaya, rak: rack.nomor_rak }
  })
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  await Promise.all([loadOptions(), loadFiltered()])
})
</script>

<style scoped>
.rack-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; flex-wrap: wrap; }
h1 { margin: 0; font-size: 26px; color: #111827; }
.page-header p { margin: 6px 0 0; color: #6b7280; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.control { min-height: 42px; padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 9px; background: white; font: inherit; }
.btn, .manage-btn { border: 0; border-radius: 9px; padding: 10px 16px; font-weight: 700; cursor: pointer; }
.btn { background: #166534; color: white; }
.mapping-note { padding: 14px 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; color: #1e3a8a; font-size: 14px; }
.empty { background: white; border: 1px dashed #d1d5db; border-radius: 14px; padding: 48px; text-align: center; color: #6b7280; }
.type-section { display: flex; flex-direction: column; gap: 14px; }
.type-heading { display: flex; justify-content: space-between; align-items: center; }
.type-heading h2 { margin: 0; font-size: 20px; color: #111827; }
.type-heading span { color: #6b7280; font-size: 13px; }
.rack-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.rack-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(15, 23, 42, .04); }
.rack-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.rack-number { color: #166534; font-weight: 800; }
.status { padding: 4px 9px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: capitalize; }
.status.aktif { background: #dcfce7; color: #166534; }
.status.inisiasi { background: #fef3c7; color: #92400e; }
.status.selesai { background: #f3f4f6; color: #4b5563; }
.rack-card h3 { margin: 16px 0 12px; font-size: 18px; }
dl { margin: 0; display: grid; gap: 8px; }
dl div { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; }
dt { color: #6b7280; } dd { margin: 0; color: #111827; font-weight: 600; text-align: right; }
.manage-btn { width: 100%; margin-top: 18px; background: #16a34a; color: white; }
.manage-btn:disabled { background: #d1d5db; cursor: not-allowed; }
@media (max-width: 700px) { .filters, .control { width: 100%; } }
</style>
