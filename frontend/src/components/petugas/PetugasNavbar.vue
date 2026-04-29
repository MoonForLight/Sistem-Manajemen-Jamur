<template>
  <header class="top-header">
    <div class="logo">
      <span style="color: #005F05;">Myco</span><span style="color: #66BB69;">Flow</span>
    </div>
    <div class="header-right">
      <span class="greeting">Halo, {{ userName || 'Petugas' }}!!</span>
      
      <!-- Profile Picture added to Navbar -->
      <div class="nav-avatar">
        <img v-if="fotoProfil" :src="'http://localhost:3000/uploads/' + fotoProfil" alt="Profile" class="nav-avatar-img" />
        <span v-else class="nav-avatar-initial">{{ userName.charAt(0).toUpperCase() }}</span>
      </div>

      <RouterLink to="/petugas/notifikasi" class="notification-bell" title="Notifikasi">
        <svg viewBox="0 0 24 24" class="bell-icon"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
        <span class="notification-dot"></span>
      </RouterLink>
      <button @click="showLogoutModal = true" class="btn-logout">Logout</button>
    </div>

    <!-- Custom Logout Modal -->
    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="logout-modal fade-in-up">
        <div class="modal-icon">👋</div>
        <h3 class="modal-title">Konfirmasi Logout</h3>
        <p class="modal-text">Apakah Anda yakin ingin keluar dari aplikasi?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showLogoutModal = false">Batal</button>
          <button class="btn-confirm" @click="confirmLogout">Ya, Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { authService } from '../../services/authService.js'
import { usersService } from '../../services/dataService.js'
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')
const fotoProfil = ref(null)
const showLogoutModal = ref(false)

const loadUserData = () => {
  const user = authService.getCurrentUser()
  if (user && user.nama) {
    userName.value = user.nama
  }
}

const fetchProfile = async () => {
  try {
    const res = await usersService.getMe()
    if (res.success && res.data) {
      fotoProfil.value = res.data.foto_profil
      userName.value = res.data.nama
    }
  } catch (error) {
    console.error("Failed to fetch profile in navbar:", error)
  }
}

// Menerima event storage jika profil diubah di tab lain atau di komponen lain
const onStorageChange = () => {
  loadUserData()
  fetchProfile()
}

onMounted(() => {
  loadUserData()
  fetchProfile()
  window.addEventListener('storage', onStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', onStorageChange)
})

const confirmLogout = () => {
  showLogoutModal.value = false
  authService.logout()
}
</script>

<style scoped>
.top-header {
  height: 70px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  border-bottom: 1px solid #eee;
}
.logo {
  font-size: 24px;
  font-weight: 900;
  display: flex;
  align-items: center;
}
.header-right { 
  display: flex; 
  align-items: center; 
  gap: 20px; 
}
.greeting { font-weight: 800; color: #16a34a; font-size: 15px; }

/* Avatar */
.nav-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #16a34a;
}
.nav-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nav-avatar-initial {
  font-weight: 700;
  color: #16a34a;
  font-size: 14px;
}

.notification-bell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f3f4f6;
  transition: all 0.2s;
  text-decoration: none;
}
.notification-bell:hover {
  background: #e5e7eb;
  color: #111827;
}
.bell-icon { width: 20px; height: 20px; }
.notification-dot {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid #f3f4f6;
}
.notification-bell:hover .notification-dot { border-color: #e5e7eb; }

.btn-logout { background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-logout:hover { background: #dc2626; }

/* Modal Logout */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.logout-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 340px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.modal-text {
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  flex: 1;
  padding: 10px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cancel:hover { background: #f3f4f6; }

.btn-confirm {
  flex: 1;
  padding: 10px;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-confirm:hover { background: #dc2626; }

.fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
