<template>
  <div class="petugas-notifikasi">
    <div class="page-header-modern">
      <div class="header-text">
        <button class="back-btn" @click="$router.go(-1)" title="Kembali ke halaman sebelumnya">
          <svg viewBox="0 0 24 24" class="icon-back"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1>Notifikasi</h1>
      </div>
    </div>

    <div v-if="loading" class="card mt-16" style="text-align: center; padding: 40px; color: #6b7280;">
      Memuat notifikasi...
    </div>

    <div v-else class="card mt-16">
      <div class="widget-body">
        <div v-if="notificationsList.length === 0" style="text-align: center; padding: 48px 16px; color: #6b7280;">
          <div style="font-size: 56px; margin-bottom: 16px;">🎉</div>
          <h3 style="margin: 0 0 8px 0; color: #111827; font-weight: 800; font-size: 18px;">Tidak Ada Notifikasi Baru</h3>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Semua rumah jamur terpantau dengan baik dan pengamatan harian diperbarui.</p>
        </div>
        
        <div v-else v-for="(notif, index) in notificationsList" :key="index" :class="['notif-item', { 'mt-16': index > 0 }]">
           <span :class="['badge', getBadgeClass(notif.type)]">{{ notif.type.toUpperCase() }}</span>
           <div class="notif-text">
             <strong>{{ notif.title }}</strong>
             <span>{{ notif.text }}</span>
           </div>
           <span class="notif-time">{{ notif.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usersService, budidayaService, lingkunganService, pertumbuhanService, panenService } from '../../services/dataService.js'

const loading = ref(true)
const notificationsList = ref([])

function getBadgeClass(type) {
  if (type === 'warning') return 'badge-warning'
  if (type === 'info') return 'badge-info'
  return 'badge-success'
}

function getLocalDateString(d) {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getRelativeTimeString(dateStr) {
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diffTime = today - d
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays > 1) return `${diffDays} hari lalu`
  return formatDate(dateStr)
}

async function loadNotifications() {
  loading.value = true
  try {
    const meRes = await usersService.getMe()
    let isAdmin = false
    if (meRes?.success && meRes.data) {
      isAdmin = meRes.data.role === 'admin'
    }

    const [budRes, envRes, growthRes, panenRes] = await Promise.all([
      isAdmin ? budidayaService.getAll() : budidayaService.getByPetugas(),
      lingkunganService.getAll(),
      pertumbuhanService.getAll(),
      panenService.getAll()
    ])

    const list = []
    
    if (budRes?.success && envRes?.success) {
      const activeBudidaya = budRes.data.filter(b => b.status === 'aktif')
      const todayStr = getLocalDateString(new Date())

      activeBudidaya.forEach(b => {
        const records = envRes.data.filter(e => Number(e.id_budidaya) === Number(b.id_budidaya))
        
        // 1. Check if logged today
        const todayRecords = records.filter(e => getLocalDateString(e.tanggal_pengukuran) === todayStr)
        const targetLingkungan = Number(b.target_lingkungan_harian || 2)
        if (todayRecords.length < targetLingkungan) {
          list.push({
            type: 'info',
            title: 'Target Lingkungan Belum Terpenuhi',
            text: `BDY-${String(b.id_budidaya).padStart(3, '0')} (${b.nama_jamur}) baru ${todayRecords.length}/${targetLingkungan} kali dicatat hari ini.`,
            time: 'Hari ini',
            date: new Date(),
            weight: 2
          })
        }

        const todayGrowthRecords = (growthRes?.success ? growthRes.data : []).filter(g =>
          Number(g.id_budidaya) === Number(b.id_budidaya) &&
          getLocalDateString(g.tanggal_pengamatan) === todayStr
        )
        const targetPertumbuhan = Number(b.target_pertumbuhan_harian || 2)
        if (todayGrowthRecords.length < targetPertumbuhan) {
          list.push({
            type: 'info',
            title: 'Target Pertumbuhan Belum Terpenuhi',
            text: `BDY-${String(b.id_budidaya).padStart(3, '0')} (${b.nama_jamur}) baru ${todayGrowthRecords.length}/${targetPertumbuhan} kali dicatat hari ini.`,
            time: 'Hari ini',
            date: new Date(),
            weight: 2
          })
        }

        // 2. Check for lateness (no records for 3 days or more)
        if (records.length > 0) {
          records.sort((x, y) => new Date(y.tanggal_pengukuran) - new Date(x.tanggal_pengukuran))
          const latestRecord = records[0]
          const lastDate = new Date(latestRecord.tanggal_pengukuran)
          lastDate.setHours(0, 0, 0, 0)
          
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
          if (diffDays >= 3) {
            list.push({
              type: 'warning',
              title: 'Pengamatan Terlambat',
              text: `Rak BDY-${String(b.id_budidaya).padStart(3, '0')} (${b.nama_jamur}) belum dicatat selama ${diffDays} hari.`,
              time: `${diffDays} hari lalu`,
              date: lastDate,
              weight: 1
            })
          }
        } else {
          // Never recorded, check start date
          const startDate = new Date(b.tanggal_mulai)
          startDate.setHours(0, 0, 0, 0)
          
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
          if (diffDays >= 3) {
            list.push({
              type: 'warning',
              title: 'Pengamatan Terlambat',
              text: `Rak BDY-${String(b.id_budidaya).padStart(3, '0')} (${b.nama_jamur}) belum pernah dicatat sejak dimulai (${diffDays} hari lalu).`,
              time: `${diffDays} hari lalu`,
              date: startDate,
              weight: 1
            })
          }
        }
      })
    }

    // 3. Recent panen (last 7 days)
    if (panenRes?.success && budRes?.success) {
      const assignedIds = new Set(budRes.data.map(item => Number(item.id_budidaya)))
      const myPanen = panenRes.data.filter(p => assignedIds.has(Number(p.id_budidaya)))
      
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      myPanen.forEach(p => {
        const pDate = new Date(p.tanggal_panen)
        if (pDate >= oneWeekAgo) {
          list.push({
            type: 'success',
            title: 'Panen Berhasil Dicatat',
            text: `Panen sebesar ${p.jumlah_panen} gram pada BDY-${String(p.id_budidaya).padStart(3, '0')} telah dimasukkan.`,
            time: getRelativeTimeString(p.tanggal_panen),
            date: pDate,
            weight: 3
          })
        }
      })
    }

    // 4. Recent growth records (last 7 days)
    if (growthRes?.success && budRes?.success) {
      const assignedIds = new Set(budRes.data.map(item => Number(item.id_budidaya)))
      const myGrowth = growthRes.data.filter(g => assignedIds.has(Number(g.id_budidaya)))
      
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      myGrowth.forEach(g => {
        const gDate = new Date(g.tanggal_pengamatan)
        if (gDate >= oneWeekAgo) {
          list.push({
            type: 'success',
            title: 'Data Pertumbuhan Tersimpan',
            text: `Fase pertumbuhan diperbarui ke '${g.fase}' untuk BDY-${String(g.id_budidaya).padStart(3, '0')}.`,
            time: getRelativeTimeString(g.tanggal_pengamatan),
            date: gDate,
            weight: 4
          })
        }
      })
    }

    // Sort by priority weight, then by date descending
    list.sort((a, b) => {
      if (a.weight !== b.weight) {
        return a.weight - b.weight
      }
      return new Date(b.date) - new Date(a.date)
    })

    notificationsList.value = list
  } catch (err) {
    console.error('Gagal memproses notifikasi:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadNotifications)
</script>

<style scoped>
.petugas-notifikasi {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header-modern {
  display: flex;
  align-items: center;
}

.header-text {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-text h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

.back-btn {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.mt-16 {
  margin-top: 16px;
}

.widget-body {
  display: flex;
  flex-direction: column;
}

.notif-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.notif-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.badge {
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid;
  min-width: 65px;
  text-align: center;
}

.badge-warning {
  background: #fffbeb;
  color: #d97706;
  border-color: #fde68a;
}

.badge-info {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.badge-success {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.notif-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notif-text strong {
  font-size: 15px;
  color: #111827;
}

.notif-text span {
  font-size: 14px;
  color: #6b7280;
}

.notif-time {
  font-size: 13px;
  color: #9ca3af;
  white-space: nowrap;
}
</style>
