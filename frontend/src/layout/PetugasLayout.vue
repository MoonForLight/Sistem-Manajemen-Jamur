<template>
  <div class="petugas-layout">
    <PetugasNavbar />
    <div class="layout-body">
      <PetugasSidebar />
      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import PetugasSidebar from '../components/petugas/PetugasSidebar.vue'
import PetugasNavbar from '../components/petugas/PetugasNavbar.vue'
</script>

<style scoped>
.petugas-layout {
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
}
.content-area {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

@media print {
  /* Sembunyikan elemen UI yang tidak perlu saat di-print */
  .petugas-layout > :not(.layout-body) {
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
