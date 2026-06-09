<template>
  <div class="admin-layout">
    <AdminNavbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <div class="layout-body">
      <!-- Overlay for mobile when sidebar is open -->
      <div 
        v-if="isSidebarOpen" 
        class="sidebar-overlay" 
        @click="isSidebarOpen = false"
      ></div>
      
      <AdminSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AdminSidebar from '../components/admin/AdminSidebar.vue'
import AdminNavbar from '../components/admin/AdminNavbar.vue'

const isSidebarOpen = ref(false)
const route = useRoute()

// Tutup sidebar otomatis saat pindah halaman di mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fafbfc;
  font-family: 'Inter', sans-serif;
  color: #333;
}
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}
.content-area {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
  width: 100%;
}

@media (max-width: 768px) {
  .content-area {
    padding: 16px;
  }
}

@media print {
  /* Sembunyikan elemen UI yang tidak perlu saat di-print */
  .admin-layout > :not(.layout-body) {
    display: none !important;
  }
  .layout-body > :not(.content-area) {
    display: none !important;
  }
  .content-area {
    padding: 0 !important;
    overflow: visible !important;
  }
}
</style>
