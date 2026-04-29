<template>
  <header class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="brand" style="text-decoration: none; color: #005F05;">Myco<span style="color: #66BB69;">Flow</span></RouterLink>
      <nav class="navlinks">
        <RouterLink to="/edukasi">Edukasi</RouterLink>
        <RouterLink to="/data">Data</RouterLink>
        <a href="#" @click.prevent="showLoginModal = true" style="color: #005F05; cursor: pointer; text-decoration:none; font-weight: 800;">Login</a>
      </nav>
    </div>

    <!-- Login Popup Modal -->
    <Teleport to="body">
      <div v-if="showLoginModal" class="modal-overlay" @click.self="showLoginModal = false">
      <div class="modal-content">
        <button class="close-btn" @click="showLoginModal = false">✕</button>
        <div class="modal-header">
          <h2>Selamat Datang Kembali</h2>
          <p>Silakan masuk ke akun MycoFlow Anda</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" v-model="username" required placeholder="Masukkan username Anda" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" required placeholder="Masukkan password" />
          </div>
          <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
          
          <button type="submit" class="btn primary login-btn" style="background: #005F05; border-color: #005F05;" :disabled="isLoading">
            {{ isLoading ? 'Memuat...' : 'Masuk' }}
          </button>
        </form>
      </div>
    </div>
    </Teleport>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { authService } from '../services/authService.js'

const router = useRouter()
const showLoginModal = ref(false)
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await authService.login(username.value, password.value)
    showLoginModal.value = false
    
    // Redirect based on role provided
    const role = authService.getCurrentRole() || response.data?.user?.role
    if (role === 'admin') {
      router.push('/admin/dashboard')
    } else if (role === 'petugas') {
      router.push('/petugas/dashboard')
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = error.message || 'Gagal login. Periksa kembali username dan password Anda.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #111827;
}

.modal-header {
  text-align: center;
  margin-bottom: 30px;
}

.modal-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #111827;
}

.modal-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.login-form .form-group {
  margin-bottom: 20px;
  text-align: left;
}

.login-form label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.login-form input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.login-form input:focus {
  outline: none;
  border-color: #005F05;
  box-shadow: 0 0 0 3px rgba(0, 95, 5, 0.1);
}

.login-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  margin-top: 10px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
}

.error-msg {
  color: #dc2626;
  font-size: 13px;
  margin-top: -10px;
  margin-bottom: 15px;
  text-align: center;
}
</style>
