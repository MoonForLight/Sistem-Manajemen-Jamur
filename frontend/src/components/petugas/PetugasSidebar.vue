<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <RouterLink to="/petugas/dashboard" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11 3H3v8h8V3zm10 0h-8v8h8V3zm-10 10H3v8h8v-8zm10 0h-8v8h8v-8z"/></svg>
        Dashboard
      </RouterLink>
      
      <RouterLink to="/petugas/jamur" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        Kelola Jamur
      </RouterLink>
      
      <RouterLink to="/petugas/laporan" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        Laporan
      </RouterLink>
      
      <RouterLink to="/petugas/riwayat" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
        Riwayat
      </RouterLink>
      
      <RouterLink to="/petugas/profile" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        Profil Saya
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #eee;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: #6b7280;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}
.icon-svg {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  fill: #9ca3af;
  transition: fill 0.2s;
}
.nav-item:hover {
  background: #f9fafb;
  color: #111827;
}
.nav-item:hover .icon-svg {
  fill: #4b5563;
}
.nav-item.router-link-active {
  background: #e9fbef;
  color: #16a34a;
}
.nav-item.router-link-active .icon-svg {
  fill: #16a34a;
}
</style>
