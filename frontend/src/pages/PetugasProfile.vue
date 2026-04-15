<template>
  <div class="petugas-page profile-page">
    <header class="page-header">
      <div>
        <h1>Profil Petugas</h1>
        <p class="page-description">Kelola data akun dan kata sandi Anda dengan cepat.</p>
      </div>
    </header>

    <div v-if="loading" class="status-message">Memuat profil...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <div v-if="!loading && !error" class="profile-grid">
      <div class="profile-card">
        <h2>Informasi Akun</h2>
        <div class="profile-row">
          <span class="label">Nama</span>
          <span>{{ profile.nama }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Username</span>
          <span>{{ profile.username }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Peran</span>
          <span>{{ profile.role }}</span>
        </div>
      </div>

      <div class="profile-card edit-card">
        <h2>Perbarui Profil</h2>
        <form @submit.prevent="saveProfile">
          <label>
            Nama lengkap
            <input type="text" v-model="formData.nama" required />
          </label>
          <label>
            Username
            <input type="text" v-model="formData.username" required />
          </label>
          <button type="submit" class="btn-primary" :disabled="savingProfile">Simpan Perubahan</button>
          <div v-if="profileMessage" :class="['status-message', profileError ? 'error' : 'success']">
            {{ profileMessage }}
          </div>
        </form>
      </div>

      <div class="profile-card edit-card">
        <h2>Ubah Kata Sandi</h2>
        <form @submit.prevent="savePassword">
          <label>
            Password lama
            <input type="password" v-model="passwordData.currentPassword" required />
          </label>
          <label>
            Password baru
            <input type="password" v-model="passwordData.newPassword" required />
          </label>
          <button type="submit" class="btn-primary" :disabled="savingPassword">Perbarui Password</button>
          <div v-if="passwordMessage" :class="['status-message', passwordError ? 'error' : 'success']">
            {{ passwordMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usersService } from '../../services/dataService.js'

const profile = ref({})
const formData = ref({ nama: '', username: '' })
const passwordData = ref({ currentPassword: '', newPassword: '' })
const loading = ref(true)
const error = ref('')
const savingProfile = ref(false)
const savingPassword = ref(false)
const profileMessage = ref('')
const passwordMessage = ref('')
const profileError = ref(false)
const passwordError = ref(false)

async function loadProfile() {
  try {
    const response = await usersService.getMe()
    if (response?.success) {
      profile.value = response.data
      formData.value = {
        nama: response.data.nama || '',
        username: response.data.username || '',
      }
    } else {
      throw new Error('Gagal memuat profil')
    }
  } catch (err) {
    console.error(err)
    error.value = 'Tidak dapat memuat profil Anda saat ini.'
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  profileMessage.value = ''
  profileError.value = false
  savingProfile.value = true

  try {
    const response = await usersService.updateMe({
      nama: formData.value.nama,
      username: formData.value.username,
    })

    if (response?.success) {
      profileMessage.value = 'Profil berhasil diperbarui.'
      profile.value = { ...profile.value, ...formData.value }
    } else {
      throw new Error(response?.message || 'Gagal memperbarui profil.')
    }
  } catch (err) {
    console.error(err)
    profileMessage.value = err.message || 'Terjadi kesalahan saat menyimpan profil.'
    profileError.value = true
  } finally {
    savingProfile.value = false
  }
}

async function savePassword() {
  passwordMessage.value = ''
  passwordError.value = false
  savingPassword.value = true

  try {
    const response = await usersService.changePassword({
      currentPassword: passwordData.value.currentPassword,
      newPassword: passwordData.value.newPassword,
    })

    if (response?.success) {
      passwordMessage.value = 'Password berhasil diperbarui.'
      passwordData.value = { currentPassword: '', newPassword: '' }
    } else {
      throw new Error(response?.message || 'Gagal memperbarui password.')
    }
  } catch (err) {
    console.error(err)
    passwordMessage.value = err.message || 'Terjadi kesalahan saat memperbarui password.'
    passwordError.value = true
  } finally {
    savingPassword.value = false
  }
}

onMounted(loadProfile)
</script>

<style scoped>
.petugas-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #111827;
}

.page-description {
  margin: 8px 0 0;
  color: #6b7280;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
}

.profile-card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #111827;
}

.profile-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 16px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f3f4f6;
}

.profile-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 700;
  color: #374151;
}

label {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

.btn-primary {
  background: #16a34a;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}

.status-message {
  padding: 16px;
  border-radius: 14px;
  margin-top: 12px;
}

.status-message.error {
  background: #fef2f2;
  color: #991b1b;
}

.status-message.success {
  background: #ecfdf5;
  color: #166534;
}

@media(max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
