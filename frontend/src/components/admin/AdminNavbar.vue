<template>
  <header class="top-header">
    <div class="header-right">
      <span class="greeting">Halo, Admin!!</span>
      <button @click="handleLogout" class="btn-logout">Logout</button>
    </div>
  </header>
</template>

<script setup>
import { authService } from '../../services/authService.js'

const handleLogout = () => {
  if (confirm('Anda yakin ingin logout?')) {
    authService.logout()
  }
}
</script>

<style scoped>
.top-header {
  height: 70px;
  background: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 32px;
  border-bottom: 1px solid #eee;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.greeting {
  font-weight: 800;
  color: #16a34a;
  font-size: 15px;
}
.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-logout:hover {
  background: #dc2626;
}
</style>
