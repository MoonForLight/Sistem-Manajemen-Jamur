<template>
  <header class="top-header">
    <div class="logo">
      <span style="color: #005F05;">Myco</span><span style="color: #66BB69;">Flow</span>
    </div>
    <div class="header-right">
      <span class="greeting">Halo, Admin!!</span>
      <button @click="showLogoutModal = true" class="btn-logout">Logout</button>
    </div>

    <!-- Custom Logout Modal -->
    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="logout-modal fade-in-up">
        <div class="modal-icon">👋</div>
        <h3 class="modal-title">Konfirmasi Logout</h3>
        <p class="modal-text">Apakah Anda yakin ingin keluar dari halaman Admin?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showLogoutModal = false">Batal</button>
          <button class="btn-confirm" @click="confirmLogout">Ya, Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '../../services/authService.js'

const showLogoutModal = ref(false)

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
.greeting {
  font-weight: 800;
  color: var(--green-dark, #16a34a);
  font-size: 15px;
}
.btn-logout {
  background: #ff4757;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
}
.btn-logout:hover {
  background: #ff3344;
  transform: translateY(-1px);
}

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
