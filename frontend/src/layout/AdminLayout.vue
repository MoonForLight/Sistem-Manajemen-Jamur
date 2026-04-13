<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="main-wrapper">
      <AdminNavbar />
      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AdminSidebar from '../components/admin/AdminSidebar.vue'
import AdminNavbar from '../components/admin/AdminNavbar.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #fafbfc;
  font-family: 'Inter', sans-serif;
  color: #333;
}
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.content-area {
  padding: 24px 32px;
  overflow-y: auto;
}
</style>
