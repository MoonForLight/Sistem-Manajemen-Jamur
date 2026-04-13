<template>
  <aside class="sidebar">
    <div class="logo">
      <span style="color: #005F05;">Myco</span><span style="color: #66BB69;">Flow</span>
    </div>
    <nav class="sidebar-nav">
      <RouterLink to="/admin/dashboard" class="nav-item">
        <span class="icon">⊞</span> Dashboard
      </RouterLink>
      <RouterLink to="/admin/lokasi" class="nav-item">
        <span class="icon">📍</span> Lokasi Budidaya
      </RouterLink>
      <RouterLink to="/admin/petugas" class="nav-item">
        <span class="icon">👥</span> Petugas
      </RouterLink>
      <RouterLink to="/admin/jamur" class="nav-item">
        <span class="icon">🍄</span> Jamur
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
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
}
.logo {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 40px;
  padding-left: 10px;
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
  color: #4b5563;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}
.nav-item .icon {
  margin-right: 12px;
  font-size: 18px;
}
.nav-item:hover {
  background: #f3f4f6;
  color: #111827;
}
.nav-item.router-link-exact-active {
  background: #e9fbef;
  color: #16a34a;
}
</style>
