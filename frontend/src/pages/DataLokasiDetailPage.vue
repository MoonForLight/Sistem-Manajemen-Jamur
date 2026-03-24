<template>
  <div class="container" v-if="detail">
    <div class="card" style="padding:18px">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap">
        <div>
          <h1 style="margin:0; font-size:18px; font-weight:950">Ringkasan Data Lokasi: {{ detail.lokasi.nama_lokasi }}</h1>
          <p class="small" style="margin:6px 0 0">Data monitoring budidaya jamur (akses publik)</p>
        </div>
        <RouterLink class="btn" to="/data">← Kembali</RouterLink>
      </div>

      <div class="kpi-row" style="margin-top:14px">
        <div class="kpi">
          <div class="val">{{ detail.kpi.suhu_rata }}</div>
          <div class="lbl">Suhu rata-rata</div>
        </div>
        <div class="kpi">
          <div class="val">{{ detail.kpi.kelembapan }}</div>
          <div class="lbl">Kelembapan</div>
        </div>
        <div class="kpi">
          <div class="val">{{ detail.kpi.total_produksi }}</div>
          <div class="lbl">Total produksi</div>
        </div>
        <div class="kpi">
          <div class="val">{{ detail.kpi.status_lokasi }}</div>
          <div class="lbl">Status lokasi</div>
        </div>
      </div>

      <div class="card chart-card" style="margin-top:14px">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap">
          <div>
            <div style="font-weight:950">📈 Grafik Produksi Mingguan</div>
            <div class="small">Dummy chart (bisa diganti dari API).</div>
          </div>
          <div class="small">Periode: Minggu ini</div>
        </div>
        <ProductionChart :values="weekly" />
      </div>

      <div class="card" style="margin-top:14px; padding:16px">
        <div style="font-weight:950">📋 Ringkasan Data</div>
        <div class="grid" style="grid-template-columns: repeat(2, minmax(0,1fr)); gap:10px; margin-top:10px">
          <div class="small"><b>Alamat:</b> {{ detail.lokasi.alamat }}</div>
          <div class="small"><b>Jumlah Rak:</b> {{ detail.lokasi.jumlah_rak }}</div>
          <div class="small"><b>Total Budidaya:</b> {{ detail.budidaya.length }}</div>
          <div class="small"><b>Total Panen:</b> {{ detail.panen.length }} kali</div>
        </div>

        <div style="margin-top:12px">
          <table class="table">
            <thead>
              <tr>
                <th>Budidaya</th>
                <th>Jenis</th>
                <th>Status</th>
                <th>Tanggal mulai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in budidayaRows" :key="b.id_budidaya">
                <td><b>{{ b.id_budidaya }}</b></td>
                <td class="muted">{{ b.jenis }}</td>
                <td>
                  <span class="badge" :class="badgeClass(b.status)">{{ b.status }}</span>
                </td>
                <td class="muted">{{ b.tanggal_mulai }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap">
        <button class="btn" @click="exportPdf">Export PDF</button>
        <button class="btn primary" @click="exportCsv">Export CSV</button>
      </div>
    </div>
  </div>

  <div class="container" v-else>
    <div class="card" style="padding:18px">
      <b>Lokasi tidak ditemukan.</b>
      <div class="small" style="margin-top:8px">Kembali ke halaman data.</div>
      <RouterLink class="btn" style="margin-top:12px" to="/data">← Kembali</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ lokasiId: { type: String, required: true } })
const detail = ref(null)

onMounted(async () => {
  try {
    // Gunakan endpoint public monitoring yang menggabungkan data lokas dan rata-rata sensor
    const response = await fetch(`/api/public/monitoring?id=${props.lokasiId}`)
    const data = await response.json()
    // Karena endpoint /api/public/monitoring biasanya mengembalikan array, kita cari yang sesuai ID
    detail.value = data.find(d => d.id_lokasi == props.lokasiId)
  } catch (error) {
    console.error('Gagal mengambil detail lokasi:', error)
  }
})
</script>