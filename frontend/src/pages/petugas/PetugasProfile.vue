<template>
  <div class="petugas-page profile-page">
    <div v-if="loading" class="status-message loading-state py-4">Memuat data profil Anda...</div>
    <div v-if="error" class="status-message error py-4">{{ error }}</div>

    <div v-if="!loading && !error" class="profile-container">
      
      <!-- Bagian Kiri/Atas: Pengaturan Akun Utama -->
      <div class="profile-main-section">
        
        <div class="profile-card fade-in">
          <div class="card-header-clean">
            <h2 class="card-title-clean">Profil Saya</h2>
            <p class="card-subtitle-clean">Kelola informasi pribadi, detail kontak, dan preferensi keamanan Anda.</p>
          </div>
          
          <div class="profile-avatar-row">
            <div class="avatar-circle">
              <img v-if="profile.foto_profil" :src="'http://localhost:3000/uploads/' + profile.foto_profil" alt="Profile" class="avatar-img" />
              <span v-else>{{ avatarInitial }}</span>
              <input type="file" ref="fileInput" accept="image/*" @change="handleFileChange" style="display: none;" />
              <button class="btn-change-photo" @click="triggerFileInput" title="Ubah Foto">📷</button>
            </div>
            <div class="avatar-info">
              <h3>{{ profile.nama || 'Pengguna' }}</h3>
              <p>Petugas Lapangan • ID: PTG-{{ profile.id_user }}</p>
              <button class="btn-outline-small" @click="triggerFileInput">Ganti Foto Profil</button>
            </div>
          </div>

          <form @submit.prevent="updateProfile" class="profile-form mt-24">
            
            <div class="form-section">
              <h3 class="form-section-title">Detail Pribadi</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" v-model="formInfo.nama" required class="modern-input" placeholder="Masukkan nama lengkap" />
                </div>
                <div class="form-group">
                  <label>Username</label>
                  <input type="text" v-model="formInfo.username" required class="modern-input" placeholder="Buat username unik" />
                </div>
              </div>
            </div>

            <div class="form-section mt-24">
              <h3 class="form-section-title">Informasi Kontak</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Alamat Email</label>
                  <input type="email" v-model="formInfo.email" class="modern-input" placeholder="contoh@email.com" />
                </div>
                <div class="form-group">
                  <label>Nomor HP / WhatsApp</label>
                  <input type="tel" v-model="formInfo.no_hp" class="modern-input" placeholder="0812xxxxxx" />
                </div>
              </div>
            </div>
            
            <div class="form-actions mt-24">
              <button type="submit" class="btn-primary" :disabled="isSavingInfo">
                {{ isSavingInfo ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Keamanan Akun -->
        <div class="profile-card fade-in mt-24" style="animation-delay: 0.1s;">
          <div class="card-header-clean flex-between">
            <div>
              <h2 class="card-title-clean">Keamanan Akun</h2>
              <p class="card-subtitle-clean">Pastikan akun Anda aman dengan memperbarui kata sandi secara berkala.</p>
            </div>
            <button type="button" class="btn-outline" @click="showPasswordModal = true">Ubah Kata Sandi</button>
          </div>
        </div>

      </div>

      <!-- Bagian Kanan/Bawah: Kinerja -->
      <div class="profile-side-section">
        <div class="performance-card fade-in" style="animation-delay: 0.2s;">
          <div class="card-header-clean">
            <h2 class="card-title-clean">Kinerja Bulanan</h2>
            <p class="card-subtitle-clean">Ringkasan aktivitas Anda bulan ini.</p>
          </div>
          
          <div class="stats-col mt-16">
            <div class="stat-item">
              <div class="stat-icon-wrap bg-blue-light">🏠</div>
              <div class="stat-text-wrap">
                <span class="s-label">Tugas Rumah Jamur</span>
                <span class="s-val">{{ stats.activeBudidaya }} <small>Rak Aktif</small></span>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon-wrap bg-green-light">📝</div>
              <div class="stat-text-wrap">
                <span class="s-label">Total Pengamatan</span>
                <span class="s-val">{{ stats.monthlyGrowth }} <small>Catatan</small></span>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon-wrap bg-yellow-light">📦</div>
              <div class="stat-text-wrap">
                <span class="s-label">Akumulasi Panen</span>
                <span class="s-val">{{ stats.monthlyHarvest }} <small>Kg</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ubah Kata Sandi -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="password-modal fade-in-up">
        <div class="modal-header">
          <h2 class="modal-title">Ubah Kata Sandi</h2>
          <button class="btn-close" @click="closePasswordModal">✕</button>
        </div>
        <p class="modal-subtitle">Gunakan kata sandi yang belum pernah Anda gunakan sebelumnya.</p>
        
        <form @submit.prevent="updatePassword" class="password-form mt-16">
          <div class="form-group">
            <label>Kata Sandi Saat Ini</label>
            <input type="password" v-model="formPass.currentPassword" required class="modern-input" placeholder="Masukkan kata sandi lama" />
          </div>
          <div class="form-group">
            <label>Kata Sandi Baru</label>
            <input type="password" v-model="formPass.newPassword" required class="modern-input" placeholder="Minimal 8 karakter" />
          </div>
          <div class="form-group">
            <label>Konfirmasi Kata Sandi Baru</label>
            <input type="password" v-model="formPass.confirmPassword" required class="modern-input" placeholder="Ulangi kata sandi baru" />
          </div>
          
          <div v-if="passError" class="error-text mt-8">{{ passError }}</div>
          
          <div class="modal-actions mt-24">
            <button type="button" class="btn-cancel" @click="closePasswordModal">Batal</button>
            <button type="submit" class="btn-danger" :disabled="isSavingPass">
              {{ isSavingPass ? 'Memproses...' : 'Simpan Sandi Baru' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usersService, uploadService, budidayaService, pertumbuhanService, panenService } from '../../services/dataService.js'

const profile = ref({})
const loading = ref(true)
const error = ref('')

const isSavingInfo = ref(false)
const isSavingPass = ref(false)
const showPasswordModal = ref(false)

const fileInput = ref(null)

const formInfo = ref({
  nama: '',
  username: '',
  email: '',
  no_hp: '',
  foto_profil: null
})

const formPass = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passError = ref('')

const stats = ref({
  activeBudidaya: 0,
  monthlyHarvest: 0,
  monthlyGrowth: 0
})

const avatarInitial = computed(() => {
  if (profile.value.nama) {
    return profile.value.nama.charAt(0).toUpperCase()
  }
  return 'U'
})

async function loadProfile() {
  try {
    const response = await usersService.getMe()
    if (response?.success) {
      profile.value = response.data
      formInfo.value.nama = response.data.nama || ''
      formInfo.value.username = response.data.username || ''
      formInfo.value.email = response.data.email || ''
      formInfo.value.no_hp = response.data.no_hp || ''
      formInfo.value.foto_profil = response.data.foto_profil || null
    } else {
      throw new Error('Gagal memuat profil')
    }

    await loadStats()

  } catch (err) {
    console.error(err)
    error.value = 'Tidak dapat memuat profil Anda saat ini.'
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7)
    
    const [budRes, growthRes, panenRes] = await Promise.all([
      budidayaService.getByPetugas(), 
      pertumbuhanService.getAll(), 
      panenService.getAll()
    ])
    
    let assignedIds = new Set()
    
    if (budRes?.success) {
      const activeBudidayaList = budRes.data.filter(item => item.status === 'aktif')
      stats.value.activeBudidaya = activeBudidayaList.length
      assignedIds = new Set(budRes.data.map(item => item.id_budidaya))
    }
    
    if (growthRes?.success) {
      const myGrowth = growthRes.data.filter(item => assignedIds.has(item.id_budidaya) && item.tanggal_pengamatan?.startsWith(currentMonth))
      stats.value.monthlyGrowth = myGrowth.length
    }
    
    if (panenRes?.success) {
      const myHarvest = panenRes.data.filter(item => assignedIds.has(item.id_budidaya) && item.tanggal_panen?.startsWith(currentMonth))
      stats.value.monthlyHarvest = myHarvest.reduce((sum, item) => sum + (Number(item.jumlah_panen) || 0), 0)
    }
  } catch (err) {
    console.error('Gagal memuat stat:', err)
  }
}

function triggerFileInput() {
  fileInput.value.click()
}

async function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    const uploadRes = await uploadService.uploadImage(file)
    if (uploadRes.success) {
      formInfo.value.foto_profil = uploadRes.filename
      profile.value.foto_profil = uploadRes.filename
      alert('Foto profil berhasil diunggah! Jangan lupa klik Simpan Perubahan.')
    } else {
      alert(uploadRes.message || 'Gagal mengunggah foto.')
    }
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan saat mengunggah foto.')
  }
}

async function updateProfile() {
  isSavingInfo.value = true
  try {
    const res = await usersService.updateMe({
      nama: formInfo.value.nama,
      username: formInfo.value.username,
      email: formInfo.value.email,
      no_hp: formInfo.value.no_hp,
      foto_profil: formInfo.value.foto_profil
    })
    if (res?.success) {
      alert('Profil berhasil diperbarui!')
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        user.nama = formInfo.value.nama
        localStorage.setItem('user', JSON.stringify(user))
        window.dispatchEvent(new Event('storage'))
      }
      loadProfile()
    } else {
      alert(res?.message || 'Gagal memperbarui profil.')
    }
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan saat memperbarui profil.')
  } finally {
    isSavingInfo.value = false
  }
}

function closePasswordModal() {
  showPasswordModal.value = false
  formPass.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  passError.value = ''
}

async function updatePassword() {
  passError.value = ''
  if (formPass.value.newPassword !== formPass.value.confirmPassword) {
    passError.value = 'Konfirmasi kata sandi tidak cocok!'
    return
  }

  isSavingPass.value = true
  try {
    const res = await usersService.changePassword({
      currentPassword: formPass.value.currentPassword,
      newPassword: formPass.value.newPassword
    })
    
    if (res?.success) {
      alert('Kata sandi berhasil diperbarui!')
      closePasswordModal()
    } else {
      passError.value = res?.message || 'Gagal memperbarui kata sandi.'
    }
  } catch (err) {
    console.error(err)
    passError.value = err.response?.data?.message || 'Terjadi kesalahan server.'
  } finally {
    isSavingPass.value = false
  }
}

onMounted(loadProfile)
</script>

<style scoped>
.petugas-page { display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }



/* Layout Grid */
.profile-container { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }

/* Cards */
.profile-card, .performance-card {
  background: white; border-radius: 16px; padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f3f4f6;
}

.card-header-clean { margin-bottom: 24px; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px; }
.card-title-clean { margin: 0 0 6px 0; font-size: 18px; font-weight: 800; color: #111827; }
.card-subtitle-clean { margin: 0; color: #6b7280; font-size: 14px; font-weight: 500; }

.flex-between { display: flex; justify-content: space-between; align-items: center; border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

/* Avatar Section */
.profile-avatar-row { display: flex; align-items: center; gap: 24px; margin-bottom: 32px; }

.avatar-circle {
  width: 100px; height: 100px; background: #f3f4f6; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 36px;
  font-weight: 800; color: #9ca3af; border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); position: relative; overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }

.btn-change-photo {
  position: absolute; bottom: 0; background: rgba(0,0,0,0.6); color: white;
  width: 100%; padding: 4px 0; border: none; font-size: 14px; cursor: pointer;
  display: flex; justify-content: center; transition: background 0.2s;
}
.btn-change-photo:hover { background: rgba(0,0,0,0.8); }

.avatar-info h3 { margin: 0 0 4px 0; font-size: 20px; font-weight: 800; color: #111827; }
.avatar-info p { margin: 0 0 12px 0; font-size: 14px; color: #6b7280; font-weight: 500; }

/* Forms */
.form-section { background: #fafbfc; padding: 20px; border-radius: 12px; border: 1px solid #f3f4f6; }
.form-section-title { margin: 0 0 16px 0; font-size: 14px; font-weight: 800; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 13px; font-weight: 700; color: #4b5563; }

.modern-input { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background: white; transition: all 0.2s; box-sizing: border-box; }
.modern-input:focus { outline: none; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }

.form-actions { display: flex; justify-content: flex-end; padding-top: 24px; border-top: 1px solid #f3f4f6; }

/* Buttons */
.btn-primary { background: #111827; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover:not(:disabled) { background: #374151; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-outline { background: white; color: #374151; border: 1px solid #d1d5db; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: #f9fafb; border-color: #9ca3af; }

.btn-outline-small { background: white; color: #4b5563; border: 1px solid #d1d5db; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; transition: all 0.2s; }
.btn-outline-small:hover { background: #f3f4f6; }

/* Stats Column */
.stats-col { display: flex; flex-direction: column; gap: 16px; }
.stat-item { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6; background: #fafbfc; }
.stat-icon-wrap { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.stat-text-wrap { display: flex; flex-direction: column; gap: 2px; }
.s-label { font-size: 12px; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.s-val { font-size: 20px; font-weight: 800; color: #111827; }
.s-val small { font-size: 13px; font-weight: 600; color: #6b7280; }

.bg-blue-light { background: #eff6ff; color: #2563eb; }
.bg-green-light { background: #f0fdf4; color: #16a34a; }
.bg-yellow-light { background: #fffbeb; color: #d97706; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.5); backdrop-filter: blur(2px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.password-modal { background: white; border-radius: 16px; padding: 32px; width: 100%; max-width: 450px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.modal-title { margin: 0; font-size: 20px; font-weight: 800; color: #111827; }
.modal-subtitle { margin: 0 0 24px 0; color: #6b7280; font-size: 14px; font-weight: 500; }
.btn-close { background: transparent; border: none; font-size: 20px; color: #9ca3af; cursor: pointer; padding: 4px; }
.btn-close:hover { color: #ef4444; }

.password-form { display: flex; flex-direction: column; gap: 16px; }
.modal-actions { display: flex; gap: 12px; }
.btn-cancel { flex: 1; padding: 12px; border: 1px solid #d1d5db; background: white; border-radius: 8px; font-weight: 700; color: #374151; cursor: pointer; }
.btn-cancel:hover { background: #f9fafb; }
.btn-danger { flex: 1; background: #111827; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-danger:hover:not(:disabled) { background: #374151; }

.error-text { color: #ef4444; font-size: 13px; font-weight: 600; margin-top: 4px; }

/* Utilities */
.mt-16 { margin-top: 16px; }
.mt-24 { margin-top: 24px; }
.mt-8 { margin-top: 8px; }
.py-4 { padding-top: 16px; padding-bottom: 16px; }
.loading-state { text-align: center; color: #6b7280; font-weight: 600; animation: pulse 2s infinite; }

.fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media(max-width: 1024px) {
  .profile-container { grid-template-columns: 1fr; }
}
@media(max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; gap: 16px; }
  .profile-card, .performance-card { padding: 20px; }
  .profile-avatar-row { flex-direction: column; text-align: center; }
}
</style>