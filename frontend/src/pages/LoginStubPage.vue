<template>
  <div class="container">
    <div class="card" style="padding:18px">
      <h1 style="margin:0; font-size:18px; font-weight:950">Login</h1>
      <p class="small" style="margin:6px 0 0">
        Halaman login untuk Admin/Petugas (use case: Login/Logout).
      </p>

      <div class="grid" style="margin-top:14px; grid-template-columns: 1fr; gap:10px; max-width: 460px">
        <label class="small"><b>Username</b></label>
        <input 
          v-model="username" 
          class="card" 
          style="padding:10px 12px; border-radius:12px; outline:none" 
          placeholder="username" 
        />

        <label class="small"><b>Password</b></label>
        <input 
          v-model="password" 
          type="password" 
          class="card" 
          style="padding:10px 12px; border-radius:12px; outline:none" 
          placeholder="password" 
        />

        <button class="btn primary" style="margin-top:8px; width: 160px" @click="onLogin">Masuk</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const onLogin = async () => {
  // Cek apakah input kosong
  if (!username.value || !password.value) {
    alert("Silakan isi username dan password!");
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: username.value, 
        password: password.value 
      })
    })

    const data = await response.json()

    if (response.ok) {
      // Simpan data login ke browser
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      alert(`Login Berhasil sebagai ${data.user.nama}`)

      // Redirect ke Dashboard Petugas sesuai permintaan kamu sebelumnya
      router.push('/petugas/dashboard')
    } else {
      alert(data.message || 'Login Gagal: Username atau Password salah')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Server Backend belum aktif! Jalankan npm run dev di folder backend.')
  }
}
</script>