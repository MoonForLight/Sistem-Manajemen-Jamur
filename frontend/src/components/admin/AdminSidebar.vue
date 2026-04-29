<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <RouterLink to="/admin/dashboard" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11 3H3v8h8V3zm10 0h-8v8h8V3zm-10 10H3v8h8v-8zm10 0h-8v8h8v-8z"/></svg>
        Dashboard
      </RouterLink>
      
      <RouterLink to="/admin/lokasi" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        Lokasi Budidaya
      </RouterLink>
      
      <RouterLink to="/admin/budidaya" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        Budidaya Aktif
      </RouterLink>
      
      <RouterLink to="/admin/petugas" class="nav-item">
        <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        Data Petugas
      </RouterLink>

      <!-- Dropdown Data Master -->
      <div class="nav-group" :class="{ 'is-open': isMasterOpen }">
        <div class="nav-item nav-group-header" @click="isMasterOpen = !isMasterOpen">
          <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path fill="currentColor" d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/></svg>
          <span style="flex: 1">Data Master</span>
          <svg class="chevron-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
        </div>
        
        <div class="nav-group-items" v-show="isMasterOpen">
          <RouterLink to="/admin/jamur" class="nav-item sub-item">
            <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2C6.5,2,2,6.5,2,12 c0,3.3,1.6,6.3,4,8.1V22h12v-1.9c2.4-1.8,4-4.8,4-8.1C22,6.5,17.5,2,12,2z M12,4c4.4,0,8,3.6,8,8h-3c0-2.8-2.2-5-5-5S7,9.2,7,12H4 C4,7.6,7.6,4,12,4z M10,14h4v6h-4V14z"/></svg>
            Jenis Jamur
          </RouterLink>
          
          <RouterLink to="/admin/media" class="nav-item sub-item">
            <svg class="icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M17,17H7v-2h10V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z"/></svg>
            Media Tanam
          </RouterLink>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const isMasterOpen = ref(false)

watchEffect(() => {
  if (route.path.includes('/admin/jamur') || route.path.includes('/admin/media')) {
    isMasterOpen.value = true
  }
})
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
  cursor: pointer;
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
.nav-item.router-link-active:not(.nav-group-header) {
  background: #e9fbef;
  color: #16a34a;
}
.nav-item.router-link-active:not(.nav-group-header) .icon-svg {
  fill: #16a34a;
}

/* Dropdown */
.nav-group-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
  padding-left: 12px;
  border-left: 2px solid #f3f4f6;
  margin-left: 24px;
}
.sub-item {
  padding: 10px 16px;
  font-size: 13px;
}
.chevron-icon {
  width: 18px;
  height: 18px;
  fill: #9ca3af;
  transition: transform 0.3s;
}
.nav-group.is-open .chevron-icon {
  transform: rotate(180deg);
}
</style>
