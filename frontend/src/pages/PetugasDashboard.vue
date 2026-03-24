<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="logo">MycoFlow</div>
      <nav>
        <a href="#" class="active">📊 Dashboard</a>
        <a href="#">🍄 Data Budidaya</a>
        <a href="#">📝 Log Aktivitas</a>
      </nav>
    </aside>

    <main class="content">
      <header style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2>Dashboard Petugas</h2>
          <div class="user-profile">Halo, {{ user.nama }}</div>
        </div>
        <button @click="showModal = true" class="btn-add">+ Tambah Data Monitoring</button>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="label">Total Lokasi</span>
          <span class="value">{{ stats.total_lokasi || 0 }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Rata-rata Suhu</span>
          <span class="value">{{ stats.avg_suhu || 0 }}°C</span>
        </div>
        <div class="stat-card">
          <span class="label">Rata-rata Kelembapan</span>
          <span class="value">{{ stats.avg_hum || 0 }}%</span>
        </div>
      </div>

      <section class="data-section card">
        <h3>Monitoring Budidaya Aktif</h3>
        <table>
          <thead>
            <tr>
              <th>Lokasi</th>
              <th>Suhu</th>
              <th>Kelembapan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in monitoringData" :key="item.id_monitoring">
              <td>{{ item.nama_lokasi }}</td>
              <td>{{ item.suhu }}°C</td>
              <td>{{ item.kelembapan }}%</td>
              <td>
                <button @click="openEditModal(item)" class="btn-edit">Update</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Tambah Data Monitoring</h3>
          <div class="form-group">
            <label>ID Lokasi</label>
            <input v-model="form.id_lokasi" type="number" placeholder="Contoh: 1">
          </div>
          <div class="form-group">
            <label>Suhu (°C)</label>
            <input v-model="form.suhu" type="number" placeholder="0">
          </div>
          <div class="form-group">
            <label>Kelembapan (%)</label>
            <input v-model="form.kelembapan" type="number" placeholder="0">
          </div>
          <div class="modal-actions">
            <button @click="showModal = false" class="btn-cancel">Batal</button>
            <button @click="simpanData" class="btn-save">Simpan ke Database</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const stats = ref({})
const monitoringData = ref([])

// Inisialisasi user dengan data kosong agar tidak error saat render pertama
const user = ref({ nama: '', username: '' })

const loadUserData = () => {
  const savedUser = localStorage.getItem('user')
  
  // Validasi: Cek apakah data ada dan bukan string "undefined"
  if (savedUser && savedUser !== "undefined") {
    try {
      user.value = JSON.parse(savedUser)
    } catch (e) {
      console.error("Gagal parse data user", e)
      router.push('/login')
    }
  } else {
    // Jika tidak ada data user, tendang balik ke login
    alert("Sesi habis, silakan login kembali.")
    router.push('/login')
  }
}

const loadData = async () => {
  try {
    const res = await fetch('/api/budidaya') // Sesuaikan endpoint yang kamu punya
    const data = await res.json()
    monitoringData.value = data
    
    if (data.length > 0) {
      stats.value = {
        total_lokasi: data.length,
        avg_suhu: (data.reduce((acc, curr) => acc + (curr.suhu || 0), 0) / data.length).toFixed(1),
        avg_hum: (data.reduce((acc, curr) => acc + (curr.kelembapan || 0), 0) / data.length).toFixed(1)
      }
    }
  } catch (err) {
    console.error("Gagal memuat data monitoring", err)
  }
}

onMounted(() => {
  loadUserData()
  loadData()
})
</script>

<style scoped>
/* CSS Tambahan untuk Modal & Tombol */
.dashboard-layout { display: flex; min-height: 100vh; background: #f4f7f6; font-family: 'Inter', sans-serif; }
.sidebar { width: 240px; background: #1a1a1a; color: white; padding: 20px; }
.content { flex: 1; padding: 30px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
.stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.value { display: block; font-size: 24px; font-weight: bold; color: #27ae60; }

.btn-add { background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
.modal-content { background: white; padding: 30px; border-radius: 16px; width: 400px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 12px; font-weight: bold; margin-bottom: 5px; }
.form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-save { background: #27ae60; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; }
.btn-cancel { background: #eee; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; }

table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th { text-align: left; padding: 12px; border-bottom: 2px solid #eee; font-size: 14px; }
td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
</style>