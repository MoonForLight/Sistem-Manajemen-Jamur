<template>
  <div class="petugas-page profile-page">
    <header class="page-header">
      <div>
        <h1>Profil Petugas</h1>
        <p class="page-description">Informasi akun dan peran Anda di sistem.</p>
      </div>
    </header>

    <div v-if="loading" class="status-message">Memuat profil...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <div v-if="!loading && !error" class="profile-card">
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
      <div class="profile-row">
        <span class="label">ID User</span>
        <span>{{ profile.id_user }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usersService } from '../../services/dataService.js'

const profile = ref({})
const loading = ref(true)
const error = ref('')

async function loadProfile() {
  try {
    const response = await usersService.getMe()
    if (response?.success) {
      profile.value = response.data
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

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.profile-row {
  display: grid;
  grid-template-columns: 180px 1fr;
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

.status-message {
  padding: 16px;
  border-radius: 14px;
  background: #f9fafb;
  color: #374151;
}

.status-message.error {
  background: #fef2f2;
  color: #991b1b;
}

@media(max-width: 768px) {
  .profile-row {
    grid-template-columns: 1fr;
  }
}
</style>