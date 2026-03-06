<template>
  <div class="container">
    <div class="card" style="padding:18px">
      <h1 style="margin:0; font-size:18px; font-weight:950">Login</h1>
      <p class="small" style="margin:6px 0 0">
        Halaman login untuk Admin/Petugas (use case: Login/Logout). Frontend ini fokus halaman publik.
      </p>

      <div class="grid" style="margin-top:14px; grid-template-columns: 1fr; gap:10px; max-width: 460px">
        <label class="small"><b>Username</b></label>
        <input class="card" style="padding:10px 12px; border-radius:12px; outline:none" placeholder="username" />

        <label class="small"><b>Password</b></label>
        <input type="password" class="card" style="padding:10px 12px; border-radius:12px; outline:none" placeholder="password" />

        <button class="btn primary" style="margin-top:8px; width: 160px" @click="onLogin">Masuk</button>
      </div>

      <div class="small" style="margin-top:14px">
        Catatan integrasi ERD: tabel <b>users</b> (username, password, role) + relasi Admin/Petugas.
      </div>
    </div>
  </div>
</template>

<script setup>
function onLogin(){
  alert('Login (dummy). Hubungkan ke backend autentikasi.')
}
</script>
